do $$
begin
  create type public.verification_level as enum (
    'unverified',
    'basic_verified',
    'business_verified',
    'enterprise_verified',
    'ngo_verified',
    'government_verified'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.verification_document_type as enum (
    'trade_license',
    'vat_trn',
    'food_permit',
    'storage_permit',
    'ngo_license',
    'government_authorization',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.platform_role as enum (
    'verifier',
    'senior_verifier',
    'country_admin',
    'platform_admin',
    'support_operator'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.verification_statuses (
  code text primary key check (code ~ '^[a-z0-9_]+$'),
  label text not null check (char_length(label) between 2 and 80),
  description text,
  is_terminal boolean not null default false,
  is_positive boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.verification_statuses (code, label, description, is_terminal, is_positive, sort_order)
values
  ('draft', 'Draft', 'Verification package is not yet submitted.', false, false, 10),
  ('submitted', 'Submitted', 'Verification package was submitted by the organization.', false, false, 20),
  ('pending_review', 'Pending review', 'Verification package is waiting for review.', false, false, 30),
  ('needs_changes', 'Needs changes', 'Reviewer requested updates or additional evidence.', false, false, 40),
  ('approved', 'Approved', 'Verification package is approved.', false, true, 50),
  ('rejected', 'Rejected', 'Verification package was rejected.', true, false, 60),
  ('suspended', 'Suspended', 'Verification is suspended by an authorized reviewer.', false, false, 70),
  ('expired', 'Expired', 'Verification or a critical document expired.', false, false, 80)
on conflict (code) do update
set label = excluded.label,
    description = excluded.description,
    is_terminal = excluded.is_terminal,
    is_positive = excluded.is_positive,
    sort_order = excluded.sort_order;

create table if not exists public.platform_staff_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.platform_role not null,
  country_code text check (country_code is null or char_length(country_code) = 2),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (user_id, role, country_code)
);

create table if not exists public.organization_verifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  level public.verification_level not null default 'unverified',
  status_code text not null default 'draft' references public.verification_statuses(code),
  country_code text not null check (char_length(country_code) = 2),
  submitted_by uuid references auth.users(id),
  submitted_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  expires_at timestamptz,
  review_notes text check (char_length(review_notes) <= 4000),
  internal_notes text check (char_length(internal_notes) <= 4000),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status_code in ('submitted', 'pending_review') and submitted_at is not null and submitted_by is not null)
    or status_code not in ('submitted', 'pending_review')
  )
);

create table if not exists public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  verification_id uuid not null references public.organization_verifications(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_type public.verification_document_type not null,
  status_code text not null default 'draft' references public.verification_statuses(code),
  document_number text check (document_number is null or char_length(document_number) <= 160),
  issuing_authority text check (issuing_authority is null or char_length(issuing_authority) <= 180),
  issue_date date,
  expiry_date date,
  storage_path text not null check (char_length(storage_path) between 3 and 500),
  original_filename text check (original_filename is null or char_length(original_filename) <= 240),
  content_type text check (content_type is null or char_length(content_type) <= 120),
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes > 0),
  submitted_by uuid references auth.users(id),
  submitted_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_notes text check (char_length(review_notes) <= 4000),
  rejection_reason text check (rejection_reason is null or char_length(rejection_reason) <= 1000),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status_code in ('submitted', 'pending_review') and submitted_at is not null and submitted_by is not null)
    or status_code not in ('submitted', 'pending_review')
  )
);

create table if not exists public.verification_audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  verification_id uuid references public.organization_verifications(id) on delete set null,
  document_id uuid references public.verification_documents(id) on delete set null,
  actor_id uuid references auth.users(id),
  event_type text not null check (char_length(event_type) between 3 and 160),
  from_status text references public.verification_statuses(code),
  to_status text references public.verification_statuses(code),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_staff_roles_user_idx
  on public.platform_staff_roles (user_id, role, country_code);

create index if not exists organization_verifications_org_idx
  on public.organization_verifications (organization_id, status_code, level);

create index if not exists organization_verifications_review_idx
  on public.organization_verifications (country_code, status_code, submitted_at);

create index if not exists verification_documents_verification_idx
  on public.verification_documents (verification_id, status_code, document_type);

create index if not exists verification_documents_expiry_idx
  on public.verification_documents (expiry_date, status_code)
  where expiry_date is not null;

create index if not exists verification_audit_events_org_idx
  on public.verification_audit_events (organization_id, created_at desc);

create or replace function public.has_platform_role(required_roles public.platform_role[], target_country_code text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.platform_staff_roles role_assignment
    where role_assignment.user_id = auth.uid()
      and role_assignment.role = any(required_roles)
      and (
        role_assignment.country_code is null
        or target_country_code is null
        or role_assignment.country_code = target_country_code
      )
  );
$$;

create or replace function public.can_submit_verification(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_organization_admin(target_organization_id)
    or public.has_platform_role(array['platform_admin']::public.platform_role[]);
$$;

create or replace function public.can_review_verification(target_country_code text default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_platform_role(
    array['verifier', 'senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[],
    target_country_code
  );
$$;

create or replace function public.record_verification_audit_event(
  target_organization_id uuid,
  target_verification_id uuid,
  target_document_id uuid,
  target_event_type text,
  previous_status text default null,
  next_status text default null,
  event_details jsonb default '{}'::jsonb
)
returns public.verification_audit_events
language plpgsql
security definer
set search_path = public
as $$
declare
  created_event public.verification_audit_events;
begin
  insert into public.verification_audit_events (
    organization_id,
    verification_id,
    document_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    details
  )
  values (
    target_organization_id,
    target_verification_id,
    target_document_id,
    auth.uid(),
    target_event_type,
    previous_status,
    next_status,
    coalesce(event_details, '{}'::jsonb)
  )
  returning * into created_event;

  insert into public.audit_events (
    actor_id,
    event_type,
    entity_type,
    entity_id,
    details
  )
  values (
    auth.uid(),
    target_event_type,
    'organization_verification',
    coalesce(target_verification_id, target_document_id, target_organization_id),
    jsonb_build_object(
      'organization_id', target_organization_id,
      'verification_id', target_verification_id,
      'document_id', target_document_id,
      'from_status', previous_status,
      'to_status', next_status,
      'details', coalesce(event_details, '{}'::jsonb)
    )
  );

  return created_event;
end;
$$;

alter table public.verification_statuses enable row level security;
alter table public.platform_staff_roles enable row level security;
alter table public.organization_verifications enable row level security;
alter table public.verification_documents enable row level security;
alter table public.verification_audit_events enable row level security;

create policy "verification statuses are visible"
  on public.verification_statuses for select
  using (true);

create policy "platform staff view their roles"
  on public.platform_staff_roles for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.has_platform_role(array['platform_admin']::public.platform_role[])
  );

create policy "platform admins manage staff roles"
  on public.platform_staff_roles for all
  to authenticated
  using (public.has_platform_role(array['platform_admin']::public.platform_role[]))
  with check (public.has_platform_role(array['platform_admin']::public.platform_role[]));

create policy "organization members and reviewers view verifications"
  on public.organization_verifications for select
  to authenticated
  using (
    public.is_organization_member(organization_id)
    or public.can_review_verification(country_code)
  );

create policy "organization admins create verifications"
  on public.organization_verifications for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.can_submit_verification(organization_id)
  );

create policy "organization admins update draft verifications"
  on public.organization_verifications for update
  to authenticated
  using (
    public.can_submit_verification(organization_id)
    or public.can_review_verification(country_code)
  )
  with check (
    public.can_submit_verification(organization_id)
    or public.can_review_verification(country_code)
  );

create policy "organization members and reviewers view verification documents"
  on public.verification_documents for select
  to authenticated
  using (
    public.is_organization_member(organization_id)
    or exists (
      select 1
      from public.organization_verifications verification
      where verification.id = verification_id
        and public.can_review_verification(verification.country_code)
    )
  );

create policy "organization admins create verification documents"
  on public.verification_documents for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.can_submit_verification(organization_id)
  );

create policy "organization admins and reviewers update verification documents"
  on public.verification_documents for update
  to authenticated
  using (
    public.can_submit_verification(organization_id)
    or exists (
      select 1
      from public.organization_verifications verification
      where verification.id = verification_id
        and public.can_review_verification(verification.country_code)
    )
  )
  with check (
    public.can_submit_verification(organization_id)
    or exists (
      select 1
      from public.organization_verifications verification
      where verification.id = verification_id
        and public.can_review_verification(verification.country_code)
    )
  );

create policy "organization members and reviewers view verification audit"
  on public.verification_audit_events for select
  to authenticated
  using (
    public.is_organization_member(organization_id)
    or exists (
      select 1
      from public.organization_verifications verification
      where verification.id = verification_id
        and public.can_review_verification(verification.country_code)
    )
  );

create policy "authenticated users create verification audit through function"
  on public.verification_audit_events for insert
  to authenticated
  with check (
    public.is_organization_member(organization_id)
    or exists (
      select 1
      from public.organization_verifications verification
      where verification.id = verification_id
        and public.can_review_verification(verification.country_code)
    )
  );

revoke all on function public.has_platform_role(public.platform_role[], text) from public;
grant execute on function public.has_platform_role(public.platform_role[], text) to authenticated;

revoke all on function public.can_submit_verification(uuid) from public;
grant execute on function public.can_submit_verification(uuid) to authenticated;

revoke all on function public.can_review_verification(text) from public;
grant execute on function public.can_review_verification(text) to authenticated;

revoke all on function public.record_verification_audit_event(uuid, uuid, uuid, text, text, text, jsonb) from public;
grant execute on function public.record_verification_audit_event(uuid, uuid, uuid, text, text, text, jsonb) to authenticated;
