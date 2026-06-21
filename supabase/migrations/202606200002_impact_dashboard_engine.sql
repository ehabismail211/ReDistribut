do $$
begin
  create type public.impact_scope as enum ('user', 'organization', 'platform');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.impact_metric_history (
  id bigint generated always as identity primary key,
  scope public.impact_scope not null,
  user_id uuid references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  country_code text check (country_code is null or char_length(country_code) = 2),
  period_start date not null,
  period_end date not null,
  aed_recovered numeric(14, 2) not null default 0 check (aed_recovered >= 0),
  resources_redistributed numeric(14, 2) not null default 0 check (resources_redistributed >= 0),
  waste_prevented_kg numeric(14, 2) not null default 0 check (waste_prevented_kg >= 0),
  co2_saved_kg numeric(14, 2) not null default 0 check (co2_saved_kg >= 0),
  completed_transactions integer not null default 0 check (completed_transactions >= 0),
  active_listings integer not null default 0 check (active_listings >= 0),
  active_requests integer not null default 0 check (active_requests >= 0),
  top_categories jsonb not null default '[]'::jsonb,
  top_locations jsonb not null default '[]'::jsonb,
  source jsonb not null default '{}'::jsonb,
  calculated_by uuid references auth.users(id),
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint impact_metric_history_valid_period check (period_end >= period_start),
  constraint impact_metric_history_scope_owner check (
    (scope = 'platform' and user_id is null and organization_id is null)
    or (scope = 'organization' and organization_id is not null)
    or (scope = 'user' and user_id is not null)
  )
);

create index if not exists impact_metric_history_scope_idx
  on public.impact_metric_history (scope, calculated_at desc);

create index if not exists impact_metric_history_org_idx
  on public.impact_metric_history (organization_id, calculated_at desc)
  where organization_id is not null;

create index if not exists impact_metric_history_user_idx
  on public.impact_metric_history (user_id, calculated_at desc)
  where user_id is not null;

create index if not exists impact_metric_history_country_idx
  on public.impact_metric_history (country_code, calculated_at desc)
  where country_code is not null;

create or replace function public.record_impact_metric_snapshot(
  target_scope public.impact_scope,
  target_user_id uuid,
  target_organization_id uuid,
  target_country_code text,
  target_period_start date,
  target_period_end date,
  target_aed_recovered numeric,
  target_resources_redistributed numeric,
  target_waste_prevented_kg numeric,
  target_co2_saved_kg numeric,
  target_completed_transactions integer,
  target_active_listings integer,
  target_active_requests integer,
  target_top_categories jsonb default '[]'::jsonb,
  target_top_locations jsonb default '[]'::jsonb,
  target_source jsonb default '{}'::jsonb
)
returns public.impact_metric_history
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.impact_metric_history;
begin
  if target_period_end < target_period_start then
    raise exception 'Impact period_end must be on or after period_start.';
  end if;

  insert into public.impact_metric_history (
    scope,
    user_id,
    organization_id,
    country_code,
    period_start,
    period_end,
    aed_recovered,
    resources_redistributed,
    waste_prevented_kg,
    co2_saved_kg,
    completed_transactions,
    active_listings,
    active_requests,
    top_categories,
    top_locations,
    source,
    calculated_by
  )
  values (
    target_scope,
    target_user_id,
    target_organization_id,
    upper(target_country_code),
    target_period_start,
    target_period_end,
    target_aed_recovered,
    target_resources_redistributed,
    target_waste_prevented_kg,
    target_co2_saved_kg,
    target_completed_transactions,
    target_active_listings,
    target_active_requests,
    coalesce(target_top_categories, '[]'::jsonb),
    coalesce(target_top_locations, '[]'::jsonb),
    coalesce(target_source, '{}'::jsonb),
    auth.uid()
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
    'impact.snapshot.recorded',
    'impact_metric_history',
    null,
    jsonb_build_object(
      'impact_metric_history_id', saved.id,
      'scope', saved.scope,
      'organization_id', saved.organization_id,
      'user_id', saved.user_id,
      'country_code', saved.country_code,
      'period_start', saved.period_start,
      'period_end', saved.period_end,
      'aed_recovered', saved.aed_recovered,
      'resources_redistributed', saved.resources_redistributed,
      'waste_prevented_kg', saved.waste_prevented_kg,
      'co2_saved_kg', saved.co2_saved_kg,
      'completed_transactions', saved.completed_transactions
    )
  );

  return saved;
end;
$$;

alter table public.impact_metric_history enable row level security;

create policy "users view own impact snapshots"
  on public.impact_metric_history for select
  to authenticated
  using (scope = 'user' and user_id = auth.uid());

create policy "organization members view organization impact"
  on public.impact_metric_history for select
  to authenticated
  using (
    scope = 'organization'
    and organization_id is not null
    and public.is_organization_member(organization_id)
  );

create policy "platform roles view platform impact"
  on public.impact_metric_history for select
  to authenticated
  using (
    public.has_platform_role(array['support_operator', 'verifier', 'senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[], country_code)
  );

create policy "platform roles append impact snapshots"
  on public.impact_metric_history for insert
  to authenticated
  with check (
    public.has_platform_role(array['country_admin', 'platform_admin']::public.platform_role[], country_code)
  );

revoke all on function public.record_impact_metric_snapshot(
  public.impact_scope,
  uuid,
  uuid,
  text,
  date,
  date,
  numeric,
  numeric,
  numeric,
  numeric,
  integer,
  integer,
  integer,
  jsonb,
  jsonb,
  jsonb
) from public;

grant execute on function public.record_impact_metric_snapshot(
  public.impact_scope,
  uuid,
  uuid,
  text,
  date,
  date,
  numeric,
  numeric,
  numeric,
  numeric,
  integer,
  integer,
  integer,
  jsonb,
  jsonb,
  jsonb
) to authenticated;
