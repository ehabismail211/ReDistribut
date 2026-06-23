create type public.marketing_lead_meeting_status as enum (
  'not_scheduled',
  'scheduled',
  'completed',
  'follow_up_required'
);

create type public.marketing_lead_pilot_status as enum (
  'not_invited',
  'invited',
  'accepted',
  'onboarding',
  'active',
  'completed'
);

alter table public.marketing_leads
  add column meeting_status public.marketing_lead_meeting_status not null default 'not_scheduled',
  add column meeting_status_updated_at timestamptz,
  add column pilot_status public.marketing_lead_pilot_status not null default 'not_invited',
  add column pilot_status_updated_at timestamptz;

create index marketing_leads_meeting_status_idx
  on public.marketing_leads (meeting_status, updated_at desc);

create index marketing_leads_pilot_status_idx
  on public.marketing_leads (pilot_status, updated_at desc);
