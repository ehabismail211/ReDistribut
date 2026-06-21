do $$
begin
  create type public.account_type as enum ('company', 'supplier');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.verification_status as enum ('draft', 'pending_review', 'verified', 'needs_changes', 'rejected');
exception
  when duplicate_object then null;
end $$;

alter table public.organizations
  add column if not exists account_type public.account_type not null default 'supplier',
  add column if not exists legal_name text,
  add column if not exists trade_name text,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists registered_address text,
  add column if not exists emirate text,
  add column if not exists business_category text,
  add column if not exists business_subcategory text,
  add column if not exists business_activity text,
  add column if not exists tax_registration_number text,
  add column if not exists authorized_person_name text,
  add column if not exists authorized_person_role text,
  add column if not exists authorized_person_email text,
  add column if not exists authorized_person_phone text,
  add column if not exists verification_status public.verification_status not null default 'draft',
  add column if not exists verification_notes text,
  add column if not exists verification_submitted_at timestamptz,
  add column if not exists verified_at timestamptz;

create table if not exists public.organization_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  license_type text not null check (char_length(license_type) between 2 and 120),
  license_number text not null check (char_length(license_number) between 2 and 120),
  issuing_authority text not null check (char_length(issuing_authority) between 2 and 160),
  issue_date date,
  expiry_date date not null,
  document_path text,
  status public.verification_status not null default 'pending_review',
  review_notes text,
  created_by uuid not null references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_verification_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_type text not null check (char_length(document_type) between 2 and 120),
  document_path text not null,
  status public.verification_status not null default 'pending_review',
  review_notes text,
  created_by uuid not null references auth.users(id),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_licenses_org_idx
  on public.organization_licenses (organization_id, status, expiry_date);

create index if not exists organization_verification_documents_org_idx
  on public.organization_verification_documents (organization_id, status, document_type);

alter table public.organization_licenses enable row level security;
alter table public.organization_verification_documents enable row level security;

create policy "organization members view licenses"
  on public.organization_licenses for select
  to authenticated
  using (public.is_organization_member(organization_id));

create policy "organization admins manage licenses"
  on public.organization_licenses for all
  to authenticated
  using (public.is_organization_admin(organization_id))
  with check (
    public.is_organization_admin(organization_id)
    and created_by = auth.uid()
  );

create policy "organization members view verification documents"
  on public.organization_verification_documents for select
  to authenticated
  using (public.is_organization_member(organization_id));

create policy "organization admins manage verification documents"
  on public.organization_verification_documents for all
  to authenticated
  using (public.is_organization_admin(organization_id))
  with check (
    public.is_organization_admin(organization_id)
    and created_by = auth.uid()
  );
