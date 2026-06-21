do $$
begin
  create type public.trust_score_level as enum ('bronze', 'silver', 'gold', 'platinum');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.organization_trust_scores (
  organization_id uuid primary key references public.organizations(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  level public.trust_score_level not null,
  factors jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default now(),
  calculated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_trust_score_history (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  previous_score integer check (previous_score is null or previous_score between 0 and 100),
  score integer not null check (score between 0 and 100),
  previous_level public.trust_score_level,
  level public.trust_score_level not null,
  factors jsonb not null default '[]'::jsonb,
  reason text not null default 'recalculation' check (char_length(reason) between 2 and 240),
  calculated_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists organization_trust_scores_level_idx
  on public.organization_trust_scores (level, score desc);

create index if not exists organization_trust_score_history_org_idx
  on public.organization_trust_score_history (organization_id, created_at desc);

create or replace function public.trust_score_level_for_score(target_score integer)
returns public.trust_score_level
language sql
immutable
as $$
  select case
    when target_score >= 85 then 'platinum'::public.trust_score_level
    when target_score >= 70 then 'gold'::public.trust_score_level
    when target_score >= 50 then 'silver'::public.trust_score_level
    else 'bronze'::public.trust_score_level
  end;
$$;

create or replace function public.record_trust_score(
  target_organization_id uuid,
  target_score integer,
  target_factors jsonb,
  target_reason text default 'recalculation'
)
returns public.organization_trust_scores
language plpgsql
security definer
set search_path = public
as $$
declare
  previous public.organization_trust_scores;
  saved public.organization_trust_scores;
  next_level public.trust_score_level;
begin
  if target_score < 0 or target_score > 100 then
    raise exception 'Trust score must be between 0 and 100.';
  end if;

  select * into previous
  from public.organization_trust_scores
  where organization_id = target_organization_id;

  next_level := public.trust_score_level_for_score(target_score);

  insert into public.organization_trust_scores (
    organization_id,
    score,
    level,
    factors,
    calculated_by,
    calculated_at,
    updated_at
  )
  values (
    target_organization_id,
    target_score,
    next_level,
    coalesce(target_factors, '[]'::jsonb),
    auth.uid(),
    now(),
    now()
  )
  on conflict (organization_id) do update
  set score = excluded.score,
      level = excluded.level,
      factors = excluded.factors,
      calculated_by = excluded.calculated_by,
      calculated_at = excluded.calculated_at,
      updated_at = excluded.updated_at
  returning * into saved;

  insert into public.organization_trust_score_history (
    organization_id,
    previous_score,
    score,
    previous_level,
    level,
    factors,
    reason,
    calculated_by
  )
  values (
    target_organization_id,
    previous.score,
    saved.score,
    previous.level,
    saved.level,
    saved.factors,
    coalesce(target_reason, 'recalculation'),
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
    'trust_score.recalculated',
    'organization',
    target_organization_id,
    jsonb_build_object(
      'previous_score', previous.score,
      'score', saved.score,
      'previous_level', previous.level,
      'level', saved.level,
      'reason', coalesce(target_reason, 'recalculation'),
      'factors', saved.factors
    )
  );

  return saved;
end;
$$;

alter table public.organization_trust_scores enable row level security;
alter table public.organization_trust_score_history enable row level security;

create policy "organization members and reviewers view trust scores"
  on public.organization_trust_scores for select
  to authenticated
  using (
    public.is_organization_member(organization_id)
    or public.has_platform_role(array['support_operator', 'verifier', 'senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[])
  );

create policy "organization members and reviewers view trust score history"
  on public.organization_trust_score_history for select
  to authenticated
  using (
    public.is_organization_member(organization_id)
    or public.has_platform_role(array['support_operator', 'verifier', 'senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[])
  );

create policy "reviewers manage trust scores through service"
  on public.organization_trust_scores for all
  to authenticated
  using (public.has_platform_role(array['senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[]))
  with check (public.has_platform_role(array['senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[]));

create policy "reviewers append trust score history"
  on public.organization_trust_score_history for insert
  to authenticated
  with check (public.has_platform_role(array['senior_verifier', 'country_admin', 'platform_admin']::public.platform_role[]));

revoke all on function public.trust_score_level_for_score(integer) from public;
grant execute on function public.trust_score_level_for_score(integer) to authenticated;

revoke all on function public.record_trust_score(uuid, integer, jsonb, text) from public;
grant execute on function public.record_trust_score(uuid, integer, jsonb, text) to authenticated;
