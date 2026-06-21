do $$
begin
  create type public.transfer_certificate_status as enum ('issued', 'revoked', 'superseded', 'expired');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.transfer_certificates (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique check (public_id ~ '^[a-zA-Z0-9_-]{12,80}$'),
  certificate_number text not null unique,
  status public.transfer_certificate_status not null default 'issued',
  transaction_id text not null unique check (char_length(transaction_id) between 3 and 120),
  listing_request_id uuid references public.listing_requests(id),
  sender_organization_id uuid not null references public.organizations(id),
  receiver_organization_id uuid references public.organizations(id),
  sender_organization_name text not null check (char_length(sender_organization_name) between 2 and 160),
  receiver_organization_name text not null check (char_length(receiver_organization_name) between 2 and 160),
  item_name text not null check (char_length(item_name) between 2 and 180),
  category text not null check (char_length(category) between 2 and 120),
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null check (char_length(unit) between 1 and 40),
  estimated_value numeric(14, 2) not null default 0 check (estimated_value >= 0),
  currency char(3) not null default 'AED',
  transfer_date timestamptz not null,
  location text not null check (char_length(location) between 2 and 160),
  handover_method text not null check (char_length(handover_method) between 2 and 120),
  trust_snapshot jsonb not null default '{}'::jsonb,
  impact_snapshot jsonb not null default '{}'::jsonb,
  qr_verification_token text not null unique check (char_length(qr_verification_token) between 24 and 160),
  certificate_hash text not null,
  payload_version integer not null default 1,
  pdf_storage_path text,
  issued_at timestamptz not null default now(),
  issued_by uuid references auth.users(id),
  revoked_at timestamptz,
  revoked_by uuid references auth.users(id),
  revocation_reason text,
  superseded_by_certificate_id uuid references public.transfer_certificates(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_certificates_revoked_reason check (
    status <> 'revoked'
    or (revoked_at is not null and revocation_reason is not null and char_length(revocation_reason) >= 3)
  )
);

create table if not exists public.transfer_certificate_history (
  id bigint generated always as identity primary key,
  certificate_id uuid not null references public.transfer_certificates(id) on delete cascade,
  status_from public.transfer_certificate_status,
  status_to public.transfer_certificate_status not null,
  payload jsonb not null default '{}'::jsonb,
  reason text,
  actor_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists transfer_certificates_sender_idx
  on public.transfer_certificates (sender_organization_id, issued_at desc);

create index if not exists transfer_certificates_receiver_idx
  on public.transfer_certificates (receiver_organization_id, issued_at desc)
  where receiver_organization_id is not null;

create index if not exists transfer_certificates_status_idx
  on public.transfer_certificates (status, issued_at desc);

create index if not exists transfer_certificates_request_idx
  on public.transfer_certificates (listing_request_id)
  where listing_request_id is not null;

create index if not exists transfer_certificate_history_certificate_idx
  on public.transfer_certificate_history (certificate_id, created_at desc);

create or replace function public.transfer_certificate_payload_hash(target_payload jsonb)
returns text
language sql
immutable
as $$
  select md5(target_payload::text);
$$;

create or replace function public.record_transfer_certificate_history()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.transfer_certificate_history (
    certificate_id,
    status_from,
    status_to,
    payload,
    reason,
    actor_id
  )
  values (
    new.id,
    case when tg_op = 'UPDATE' then old.status else null end,
    new.status,
    to_jsonb(new),
    coalesce(new.revocation_reason, 'certificate issued'),
    auth.uid()
  );

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    case
      when tg_op = 'UPDATE' and new.status = 'revoked' then 'certificate.revoked'
      when tg_op = 'UPDATE' and new.status = 'superseded' then 'certificate.superseded'
      else 'certificate.issued'
    end,
    'transfer_certificate',
    new.id,
    jsonb_build_object(
      'public_id', new.public_id,
      'certificate_number', new.certificate_number,
      'transaction_id', new.transaction_id,
      'listing_request_id', new.listing_request_id,
      'sender_organization_id', new.sender_organization_id,
      'receiver_organization_id', new.receiver_organization_id,
      'status', new.status,
      'certificate_hash', new.certificate_hash
    )
  );

  return new;
end;
$$;

drop trigger if exists transfer_certificate_history_after_insert on public.transfer_certificates;
create trigger transfer_certificate_history_after_insert
  after insert on public.transfer_certificates
  for each row execute function public.record_transfer_certificate_history();

drop trigger if exists transfer_certificate_history_after_update_status on public.transfer_certificates;
create trigger transfer_certificate_history_after_update_status
  after update of status on public.transfer_certificates
  for each row
  when (old.status is distinct from new.status)
  execute function public.record_transfer_certificate_history();

create sequence if not exists public.transfer_certificate_number_seq start with 1 increment by 1;

create or replace function public.issue_transfer_certificate(
  target_transaction_id text,
  target_listing_request_id uuid,
  target_sender_organization_id uuid,
  target_receiver_organization_id uuid,
  target_sender_organization_name text,
  target_receiver_organization_name text,
  target_item_name text,
  target_category text,
  target_quantity numeric,
  target_unit text,
  target_estimated_value numeric,
  target_currency text,
  target_transfer_date timestamptz,
  target_location text,
  target_handover_method text,
  target_trust_snapshot jsonb,
  target_impact_snapshot jsonb
)
returns public.transfer_certificates
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.transfer_certificates;
  request_record public.listing_requests;
  next_public_id text;
  next_certificate_number text;
  next_token text;
  payload jsonb;
begin
  if target_listing_request_id is not null then
    select * into request_record
    from public.listing_requests
    where id = target_listing_request_id;

    if request_record.id is null then
      raise exception 'Listing request was not found.';
    end if;

    if request_record.status <> 'completed' then
      raise exception 'Transfer certificates can only be issued for completed requests.';
    end if;
  end if;

  next_public_id := 'cert_' || replace(gen_random_uuid()::text, '-', '');
  next_token := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  next_certificate_number := 'RD-' || upper(coalesce(target_currency, 'AED')) || '-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('transfer_certificate_number_seq')::text, 6, '0');

  payload := jsonb_build_object(
    'transaction_id', target_transaction_id,
    'listing_request_id', target_listing_request_id,
    'sender_organization_id', target_sender_organization_id,
    'receiver_organization_id', target_receiver_organization_id,
    'sender_organization_name', target_sender_organization_name,
    'receiver_organization_name', target_receiver_organization_name,
    'item_name', target_item_name,
    'category', target_category,
    'quantity', target_quantity,
    'unit', target_unit,
    'estimated_value', target_estimated_value,
    'currency', upper(coalesce(target_currency, 'AED')),
    'transfer_date', target_transfer_date,
    'location', target_location,
    'handover_method', target_handover_method,
    'trust_snapshot', coalesce(target_trust_snapshot, '{}'::jsonb),
    'impact_snapshot', coalesce(target_impact_snapshot, '{}'::jsonb)
  );

  insert into public.transfer_certificates (
    public_id,
    certificate_number,
    transaction_id,
    listing_request_id,
    sender_organization_id,
    receiver_organization_id,
    sender_organization_name,
    receiver_organization_name,
    item_name,
    category,
    quantity,
    unit,
    estimated_value,
    currency,
    transfer_date,
    location,
    handover_method,
    trust_snapshot,
    impact_snapshot,
    qr_verification_token,
    certificate_hash,
    issued_by
  )
  values (
    next_public_id,
    next_certificate_number,
    target_transaction_id,
    target_listing_request_id,
    target_sender_organization_id,
    target_receiver_organization_id,
    target_sender_organization_name,
    target_receiver_organization_name,
    target_item_name,
    target_category,
    target_quantity,
    target_unit,
    target_estimated_value,
    upper(coalesce(target_currency, 'AED')),
    target_transfer_date,
    target_location,
    target_handover_method,
    coalesce(target_trust_snapshot, '{}'::jsonb),
    coalesce(target_impact_snapshot, '{}'::jsonb),
    next_token,
    public.transfer_certificate_payload_hash(payload),
    auth.uid()
  )
  on conflict (transaction_id) do update
  set updated_at = public.transfer_certificates.updated_at
  returning * into saved;

  return saved;
end;
$$;

create or replace function public.verify_transfer_certificate(target_token text)
returns table (
  public_id text,
  certificate_number text,
  status public.transfer_certificate_status,
  sender_organization_name text,
  receiver_organization_name text,
  item_name text,
  category text,
  quantity numeric,
  unit text,
  transfer_date timestamptz,
  location text,
  certificate_hash text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    public_id,
    certificate_number,
    status,
    sender_organization_name,
    receiver_organization_name,
    item_name,
    category,
    quantity,
    unit,
    transfer_date,
    location,
    certificate_hash
  from public.transfer_certificates
  where qr_verification_token = target_token
    and status in ('issued', 'revoked', 'superseded', 'expired');
$$;

alter table public.transfer_certificates enable row level security;
alter table public.transfer_certificate_history enable row level security;

create policy "participant organizations view transfer certificates"
  on public.transfer_certificates for select
  to authenticated
  using (
    public.is_organization_member(sender_organization_id)
    or (receiver_organization_id is not null and public.is_organization_member(receiver_organization_id))
    or public.has_platform_role(array['support_operator', 'country_admin', 'platform_admin']::public.platform_role[])
  );

create policy "participant organizations view certificate history"
  on public.transfer_certificate_history for select
  to authenticated
  using (
    exists (
      select 1
      from public.transfer_certificates c
      where c.id = certificate_id
        and (
          public.is_organization_member(c.sender_organization_id)
          or (c.receiver_organization_id is not null and public.is_organization_member(c.receiver_organization_id))
          or public.has_platform_role(array['support_operator', 'country_admin', 'platform_admin']::public.platform_role[])
        )
    )
  );

create policy "platform admins manage transfer certificates"
  on public.transfer_certificates for all
  to authenticated
  using (public.has_platform_role(array['country_admin', 'platform_admin']::public.platform_role[]))
  with check (public.has_platform_role(array['country_admin', 'platform_admin']::public.platform_role[]));

revoke all on function public.issue_transfer_certificate(
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  text,
  numeric,
  text,
  timestamptz,
  text,
  text,
  jsonb,
  jsonb
) from public;

grant execute on function public.issue_transfer_certificate(
  text,
  uuid,
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  numeric,
  text,
  numeric,
  text,
  timestamptz,
  text,
  text,
  jsonb,
  jsonb
) to authenticated;

revoke all on function public.verify_transfer_certificate(text) from public;
grant execute on function public.verify_transfer_certificate(text) to anon, authenticated;
