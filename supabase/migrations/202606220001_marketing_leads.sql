create type public.marketing_lead_status as enum (
  'new',
  'contacted',
  'meeting_booked',
  'pilot_candidate',
  'archived'
);

create type public.marketing_lead_inquiry_type as enum (
  'pilot',
  'supplier',
  'recipient',
  'partner',
  'impact',
  'demo',
  'question'
);

create table public.marketing_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  organization text not null check (char_length(organization) between 2 and 160),
  email text not null check (char_length(email) <= 180),
  phone text check (char_length(phone) <= 40),
  inquiry_type public.marketing_lead_inquiry_type not null,
  message text not null check (char_length(message) between 10 and 2000),
  status public.marketing_lead_status not null default 'new',
  organization_type text check (char_length(organization_type) <= 120),
  role_title text check (char_length(role_title) <= 120),
  city text check (char_length(city) <= 120),
  timeline text check (char_length(timeline) <= 80),
  source text not null default 'marketing_contact_form',
  ip_address text check (char_length(ip_address) <= 80),
  user_agent text check (char_length(user_agent) <= 500),
  contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index marketing_leads_status_created_idx
  on public.marketing_leads (status, created_at desc);

create index marketing_leads_email_idx
  on public.marketing_leads (lower(email));

alter table public.marketing_leads enable row level security;

create policy "platform operators view marketing leads"
  on public.marketing_leads for select
  to authenticated
  using (public.has_any_platform_role(array['founder', 'platform_admin', 'pilot_coordinator']::public.platform_role[]));

create policy "platform operators update marketing leads"
  on public.marketing_leads for update
  to authenticated
  using (public.has_any_platform_role(array['founder', 'platform_admin', 'pilot_coordinator']::public.platform_role[]))
  with check (public.has_any_platform_role(array['founder', 'platform_admin', 'pilot_coordinator']::public.platform_role[]));

create or replace function public.touch_marketing_leads_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger touch_marketing_leads_updated_at
  before update on public.marketing_leads
  for each row execute function public.touch_marketing_leads_updated_at();
