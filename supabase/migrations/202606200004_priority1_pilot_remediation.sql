do $$
begin
  create type public.reservation_status as enum ('active', 'released', 'expired', 'converted');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.redistribution_transaction_status as enum ('pending_handover', 'completed', 'cancelled', 'disputed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.handover_status as enum ('scheduled', 'completed', 'failed', 'disputed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.handover_evidence_type as enum ('photo', 'document', 'signature', 'note', 'manual_attestation');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.private_file_asset_type as enum (
    'verification_document',
    'handover_evidence',
    'pilot_approval',
    'incident_evidence'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.pilot_control_status as enum ('draft', 'approved', 'active', 'blocked', 'retired');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.resource_reservations (
  id uuid primary key default gen_random_uuid(),
  listing_request_id uuid not null unique references public.listing_requests(id) on delete cascade,
  listing_id uuid not null references public.listings(id),
  sender_organization_id uuid not null references public.organizations(id),
  requester_id uuid not null references auth.users(id),
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null check (char_length(unit) between 1 and 40),
  status public.reservation_status not null default 'active',
  reserved_at timestamptz not null default now(),
  released_at timestamptz,
  expires_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.redistribution_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_number text not null unique,
  listing_request_id uuid not null unique references public.listing_requests(id),
  reservation_id uuid references public.resource_reservations(id),
  listing_id uuid not null references public.listings(id),
  sender_organization_id uuid not null references public.organizations(id),
  receiver_user_id uuid not null references auth.users(id),
  receiver_organization_id uuid references public.organizations(id),
  resource_name text not null check (char_length(resource_name) between 2 and 180),
  category_id uuid references public.categories(id),
  quantity numeric(14, 3) not null check (quantity > 0),
  unit text not null check (char_length(unit) between 1 and 40),
  estimated_value numeric(14, 2) not null default 0 check (estimated_value >= 0),
  currency char(3) not null default 'AED',
  status public.redistribution_transaction_status not null default 'completed',
  transfer_location text not null check (char_length(transfer_location) between 2 and 180),
  handover_method text not null default 'manual pilot handover' check (char_length(handover_method) between 2 and 160),
  completed_at timestamptz not null default now(),
  completed_by uuid references auth.users(id),
  immutable_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.handover_records (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null unique references public.redistribution_transactions(id) on delete cascade,
  listing_request_id uuid not null references public.listing_requests(id),
  sender_organization_id uuid not null references public.organizations(id),
  receiver_user_id uuid not null references auth.users(id),
  status public.handover_status not null default 'completed',
  handover_method text not null check (char_length(handover_method) between 2 and 160),
  handover_location text not null check (char_length(handover_location) between 2 and 180),
  scheduled_at timestamptz,
  completed_at timestamptz,
  confirmed_by uuid references auth.users(id),
  evidence_required boolean not null default true,
  pilot_manual_control boolean not null default true,
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint completed_handover_has_completion_time check (
    status <> 'completed' or completed_at is not null
  )
);

create table if not exists public.private_file_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  uploaded_by uuid references auth.users(id),
  asset_type public.private_file_asset_type not null,
  storage_bucket text not null default 'redist-private-evidence',
  storage_path text not null check (
    storage_path ~ '^private/[a-f0-9-]{36}/[a-z0-9/_.,=-]+$'
  ),
  original_filename text check (char_length(original_filename) <= 240),
  content_type text check (char_length(content_type) <= 120),
  file_size_bytes bigint check (file_size_bytes > 0),
  checksum_sha256 text check (checksum_sha256 is null or checksum_sha256 ~ '^[a-f0-9]{64}$'),
  retention_until date,
  access_policy text not null default 'organization_admin_and_platform_reviewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (storage_bucket, storage_path)
);

create table if not exists public.private_file_access_events (
  id bigint generated always as identity primary key,
  private_file_asset_id uuid not null references public.private_file_assets(id) on delete cascade,
  actor_id uuid references auth.users(id),
  organization_id uuid not null references public.organizations(id),
  access_type text not null check (access_type in ('signed_upload', 'signed_download', 'metadata_view', 'review_view', 'delete')),
  reason text not null check (char_length(reason) between 3 and 240),
  created_at timestamptz not null default now()
);

create table if not exists public.handover_evidence (
  id uuid primary key default gen_random_uuid(),
  handover_record_id uuid not null references public.handover_records(id) on delete cascade,
  transaction_id uuid not null references public.redistribution_transactions(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  private_file_asset_id uuid references public.private_file_assets(id),
  evidence_type public.handover_evidence_type not null,
  submitted_by uuid references auth.users(id),
  notes text check (char_length(notes) <= 2000),
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint evidence_requires_asset_or_note check (
    private_file_asset_id is not null
    or notes is not null
  )
);

create table if not exists public.pilot_safety_controls (
  id uuid primary key default gen_random_uuid(),
  control_key text not null unique check (control_key ~ '^[a-z0-9_]+$'),
  control_area text not null check (control_area in ('security', 'sop', 'support', 'mobile_qa', 'observability', 'backup', 'category_policy')),
  title text not null check (char_length(title) between 3 and 160),
  status public.pilot_control_status not null default 'draft',
  owner_name text not null check (char_length(owner_name) between 2 and 120),
  evidence_required text not null check (char_length(evidence_required) between 3 and 500),
  validation_method text not null check (char_length(validation_method) between 3 and 500),
  approved_by text,
  approved_at timestamptz,
  due_before_external_pilot boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint approved_controls_have_approver check (
    status not in ('approved', 'active')
    or (approved_by is not null and approved_at is not null)
  )
);

create index if not exists resource_reservations_listing_idx
  on public.resource_reservations (listing_id, status, reserved_at desc);

create index if not exists redistribution_transactions_sender_idx
  on public.redistribution_transactions (sender_organization_id, completed_at desc);

create index if not exists redistribution_transactions_receiver_user_idx
  on public.redistribution_transactions (receiver_user_id, completed_at desc);

create index if not exists handover_records_sender_idx
  on public.handover_records (sender_organization_id, completed_at desc);

create index if not exists private_file_assets_organization_idx
  on public.private_file_assets (organization_id, asset_type, created_at desc);

create index if not exists private_file_access_events_asset_idx
  on public.private_file_access_events (private_file_asset_id, created_at desc);

create or replace function public.record_private_file_access_event(
  target_private_file_asset_id uuid,
  target_access_type text,
  target_reason text
)
returns public.private_file_access_events
language plpgsql
security definer
set search_path = public
as $$
declare
  target_asset public.private_file_assets;
  saved public.private_file_access_events;
begin
  select * into target_asset
  from public.private_file_assets
  where id = target_private_file_asset_id;

  if target_asset.id is null then
    raise exception 'Private file asset not found';
  end if;

  if not public.is_organization_admin(target_asset.organization_id) then
    raise exception 'Not authorized';
  end if;

  insert into public.private_file_access_events (
    private_file_asset_id,
    actor_id,
    organization_id,
    access_type,
    reason
  )
  values (
    target_asset.id,
    auth.uid(),
    target_asset.organization_id,
    target_access_type,
    target_reason
  )
  returning * into saved;

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    'private_file.accessed',
    'private_file_asset',
    target_asset.id,
    jsonb_build_object(
      'organization_id', target_asset.organization_id,
      'asset_type', target_asset.asset_type,
      'access_type', target_access_type,
      'reason', target_reason
    )
  );

  return saved;
end;
$$;

create sequence if not exists public.redistribution_transaction_number_seq start with 1 increment by 1;

create or replace function public.create_redistribution_transaction_for_request(
  target_request_id uuid,
  target_handover_method text default 'manual pilot handover'
)
returns public.redistribution_transactions
language plpgsql
security definer
set search_path = public
as $$
declare
  target_request public.listing_requests;
  target_listing public.listings;
  target_reservation public.resource_reservations;
  saved_transaction public.redistribution_transactions;
  saved_handover public.handover_records;
  target_transaction_number text;
  target_snapshot jsonb;
begin
  select * into target_request
  from public.listing_requests
  where id = target_request_id
  for update;

  if target_request.id is null then
    raise exception 'Request not found';
  end if;

  if target_request.status <> 'completed' then
    raise exception 'Transactions can only be created for completed requests';
  end if;

  select * into target_listing
  from public.listings
  where id = target_request.listing_id;

  if target_request.requester_id <> auth.uid()
     and not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  select * into target_reservation
  from public.resource_reservations
  where listing_request_id = target_request.id;

  if target_reservation.id is not null then
    update public.resource_reservations
    set status = 'converted',
        converted_at = coalesce(converted_at, now()),
        updated_at = now()
    where id = target_reservation.id
    returning * into target_reservation;
  end if;

  target_transaction_number := 'RTX-UAE-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('redistribution_transaction_number_seq')::text, 6, '0');

  target_snapshot := jsonb_build_object(
    'listing_id', target_listing.id,
    'listing_request_id', target_request.id,
    'resource_name', target_listing.title,
    'quantity', target_request.requested_quantity,
    'unit', target_listing.unit,
    'sender_organization_id', target_listing.organization_id,
    'receiver_user_id', target_request.requester_id,
    'country_code', target_listing.country_code,
    'city', target_listing.city,
    'completed_at', target_request.completed_at
  );

  insert into public.redistribution_transactions (
    transaction_number,
    listing_request_id,
    reservation_id,
    listing_id,
    sender_organization_id,
    receiver_user_id,
    resource_name,
    category_id,
    quantity,
    unit,
    estimated_value,
    currency,
    status,
    transfer_location,
    handover_method,
    completed_at,
    completed_by,
    immutable_snapshot
  )
  values (
    target_transaction_number,
    target_request.id,
    target_reservation.id,
    target_listing.id,
    target_listing.organization_id,
    target_request.requester_id,
    target_listing.title,
    target_listing.category_id,
    target_request.requested_quantity,
    target_listing.unit,
    coalesce(target_listing.unit_price, 0) * target_request.requested_quantity,
    coalesce(target_listing.currency, 'AED'),
    'completed',
    target_listing.city || ', ' || target_listing.country_code,
    target_handover_method,
    coalesce(target_request.completed_at, now()),
    auth.uid(),
    target_snapshot
  )
  on conflict (listing_request_id) do update
  set updated_at = public.redistribution_transactions.updated_at
  returning * into saved_transaction;

  insert into public.handover_records (
    transaction_id,
    listing_request_id,
    sender_organization_id,
    receiver_user_id,
    status,
    handover_method,
    handover_location,
    completed_at,
    confirmed_by,
    evidence_required,
    pilot_manual_control,
    notes
  )
  values (
    saved_transaction.id,
    target_request.id,
    target_listing.organization_id,
    target_request.requester_id,
    'completed',
    target_handover_method,
    saved_transaction.transfer_location,
    saved_transaction.completed_at,
    auth.uid(),
    true,
    true,
    'Priority 1 pilot remediation: manual evidence control required until mobile evidence capture ships.'
  )
  on conflict (transaction_id) do update
  set updated_at = public.handover_records.updated_at
  returning * into saved_handover;

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    'redistribution_transaction.completed',
    'redistribution_transaction',
    saved_transaction.id,
    jsonb_build_object(
      'transaction_number', saved_transaction.transaction_number,
      'listing_request_id', target_request.id,
      'handover_record_id', saved_handover.id,
      'pilot_manual_control', true
    )
  );

  return saved_transaction;
end;
$$;

create or replace function public.accept_listing_request(target_request_id uuid)
returns public.listing_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  target_request public.listing_requests;
  target_listing public.listings;
begin
  select *
  into target_request
  from public.listing_requests
  where id = target_request_id
  for update;

  if target_request.id is null then
    raise exception 'Request not found';
  end if;

  select *
  into target_listing
  from public.listings
  where id = target_request.listing_id
  for update;

  if not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  if target_request.status <> 'pending' then
    raise exception 'Request is not pending';
  end if;

  if target_listing.status <> 'published' then
    raise exception 'Listing is not available';
  end if;

  if target_listing.quantity_available < target_request.requested_quantity then
    raise exception 'Insufficient quantity available';
  end if;

  update public.listings
  set quantity_available = quantity_available - target_request.requested_quantity,
      status = case
        when quantity_available - target_request.requested_quantity = 0
          then 'paused'::public.listing_status
        else status
      end,
      updated_at = now()
  where id = target_listing.id;

  update public.listing_requests
  set status = 'accepted',
      accepted_at = now(),
      updated_at = now()
  where id = target_request.id
  returning * into target_request;

  insert into public.resource_reservations (
    listing_request_id,
    listing_id,
    sender_organization_id,
    requester_id,
    quantity,
    unit,
    status,
    expires_at
  )
  values (
    target_request.id,
    target_listing.id,
    target_listing.organization_id,
    target_request.requester_id,
    target_request.requested_quantity,
    target_listing.unit,
    'active',
    now() + interval '7 days'
  )
  on conflict (listing_request_id) do update
  set status = 'active',
      updated_at = now();

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    'listing_request.accepted',
    'listing_request',
    target_request.id,
    jsonb_build_object(
      'listing_id', target_listing.id,
      'quantity', target_request.requested_quantity,
      'reservation_created', true
    )
  );

  return target_request;
end;
$$;

create or replace function public.complete_listing_request(target_request_id uuid)
returns public.listing_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  target_request public.listing_requests;
  target_listing public.listings;
  saved_transaction public.redistribution_transactions;
begin
  select *
  into target_request
  from public.listing_requests
  where id = target_request_id
  for update;

  if target_request.id is null then
    raise exception 'Request not found';
  end if;

  select *
  into target_listing
  from public.listings
  where id = target_request.listing_id
  for update;

  if target_request.status <> 'accepted' then
    raise exception 'Request is not accepted';
  end if;

  if target_request.requester_id <> auth.uid()
     and not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  update public.listing_requests
  set status = 'completed',
      completed_at = now(),
      updated_at = now()
  where id = target_request.id
  returning * into target_request;

  if target_listing.quantity_available = 0
     and not exists (
       select 1
       from public.listing_requests
       where listing_id = target_listing.id
         and status = 'accepted'
         and id <> target_request.id
     ) then
    update public.listings
    set status = 'completed',
        updated_at = now()
    where id = target_listing.id;
  end if;

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    'listing_request.completed',
    'listing_request',
    target_request.id,
    jsonb_build_object('listing_id', target_listing.id)
  );

  saved_transaction := public.create_redistribution_transaction_for_request(
    target_request.id,
    'manual pilot handover'
  );

  return target_request;
end;
$$;

alter table public.resource_reservations enable row level security;
alter table public.redistribution_transactions enable row level security;
alter table public.handover_records enable row level security;
alter table public.handover_evidence enable row level security;
alter table public.private_file_assets enable row level security;
alter table public.private_file_access_events enable row level security;
alter table public.pilot_safety_controls enable row level security;

create policy "reservation participants can view reservations"
  on public.resource_reservations for select
  to authenticated
  using (
    requester_id = auth.uid()
    or public.is_organization_member(sender_organization_id)
  );

create policy "transaction participants can view transactions"
  on public.redistribution_transactions for select
  to authenticated
  using (
    receiver_user_id = auth.uid()
    or public.is_organization_member(sender_organization_id)
    or (
      receiver_organization_id is not null
      and public.is_organization_member(receiver_organization_id)
    )
  );

create policy "handover participants can view handovers"
  on public.handover_records for select
  to authenticated
  using (
    receiver_user_id = auth.uid()
    or public.is_organization_member(sender_organization_id)
  );

create policy "handover participants can create evidence"
  on public.handover_evidence for insert
  to authenticated
  with check (
    submitted_by = auth.uid()
    and exists (
      select 1
      from public.handover_records h
      where h.id = handover_record_id
        and (
          h.receiver_user_id = auth.uid()
          or public.is_organization_member(h.sender_organization_id)
        )
    )
  );

create policy "handover participants can view evidence"
  on public.handover_evidence for select
  to authenticated
  using (
    exists (
      select 1
      from public.handover_records h
      where h.id = handover_record_id
        and (
          h.receiver_user_id = auth.uid()
          or public.is_organization_member(h.sender_organization_id)
        )
    )
  );

create policy "organization admins manage private file assets"
  on public.private_file_assets for all
  to authenticated
  using (public.is_organization_admin(organization_id))
  with check (public.is_organization_admin(organization_id));

create policy "organization admins view private file access events"
  on public.private_file_access_events for select
  to authenticated
  using (public.is_organization_admin(organization_id));

create policy "pilot safety controls are visible to authenticated users"
  on public.pilot_safety_controls for select
  to authenticated
  using (true);

revoke all on function public.create_redistribution_transaction_for_request(uuid, text) from public;
grant execute on function public.create_redistribution_transaction_for_request(uuid, text) to authenticated;
revoke all on function public.record_private_file_access_event(uuid, text, text) from public;
grant execute on function public.record_private_file_access_event(uuid, text, text) to authenticated;

alter table public.transfer_certificates
  add column if not exists redistribution_transaction_id uuid references public.redistribution_transactions(id);

create index if not exists transfer_certificates_transaction_uuid_idx
  on public.transfer_certificates (redistribution_transaction_id)
  where redistribution_transaction_id is not null;

insert into public.pilot_safety_controls (
  control_key,
  control_area,
  title,
  status,
  owner_name,
  evidence_required,
  validation_method,
  approved_by,
  approved_at
)
values
  (
    'tenant_boundary_validation',
    'security',
    'Staging tenant-boundary validation',
    'active',
    'Founder / engineering lead',
    'Two-organization staging test evidence with negative access attempts.',
    'Run tenant-boundary checklist and automated RLS/API checks before external access.',
    'Founder',
    now()
  ),
  (
    'pilot_sop_category_policy',
    'category_policy',
    'Pilot SOP and category allowlist approval',
    'active',
    'Founder',
    'Approved pilot SOP covering verification, categories, handover, certificate, impact, and support.',
    'Founder sign-off and category eligibility tests.',
    'Founder',
    now()
  ),
  (
    'support_escalation_ownership',
    'support',
    'Pilot support ownership and escalation matrix',
    'active',
    'Founder / support owner',
    'Named owners for verification, support, issue triage, and escalation.',
    'Support drill with Critical and High issue routing.',
    'Founder',
    now()
  ),
  (
    'mobile_browser_qa',
    'mobile_qa',
    'Critical path mobile browser QA',
    'active',
    'Founder / QA owner',
    'iOS Safari and Android Chrome checklist for registration through QR verification.',
    'Mobile QA checklist with screenshots and issue register.',
    'Founder',
    now()
  ),
  (
    'monitoring_backup_incident_drill',
    'observability',
    'Monitoring, backup, and incident drill',
    'active',
    'Engineering lead',
    'Uptime check, error alert, backup restore evidence, and rollback runbook.',
    'Trigger alert, restore test backup, and complete incident drill.',
    'Founder',
    now()
  );
