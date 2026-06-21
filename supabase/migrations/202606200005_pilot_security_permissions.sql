do $$
begin
  create type public.platform_role as enum (
    'founder',
    'platform_admin',
    'reviewer',
    'pilot_coordinator'
  );
exception
  when duplicate_object then null;
end $$;

alter type public.organization_role add value if not exists 'organization_admin';
alter type public.organization_role add value if not exists 'organization_user';

create table if not exists public.user_platform_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.platform_role not null,
  assigned_by uuid references auth.users(id),
  assigned_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (user_id, role)
);

create table if not exists public.permission_audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  actor_role text,
  permission text not null,
  decision text not null check (decision in ('allowed', 'denied')),
  entity_type text,
  entity_id uuid,
  organization_id uuid references public.organizations(id),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists user_platform_roles_active_idx
  on public.user_platform_roles (role, user_id)
  where revoked_at is null;

create index if not exists permission_audit_actor_idx
  on public.permission_audit_events (actor_id, created_at desc);

create index if not exists permission_audit_organization_idx
  on public.permission_audit_events (organization_id, created_at desc)
  where organization_id is not null;

create or replace function public.has_platform_role(target_role public.platform_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_platform_roles
    where user_id = auth.uid()
      and role = target_role
      and revoked_at is null
  );
$$;

create or replace function public.has_any_platform_role(target_roles public.platform_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_platform_roles
    where user_id = auth.uid()
      and role = any(target_roles)
      and revoked_at is null
  );
$$;

create or replace function public.record_permission_audit_event(
  target_permission text,
  target_decision text,
  target_actor_role text default null,
  target_entity_type text default null,
  target_entity_id uuid default null,
  target_organization_id uuid default null,
  event_details jsonb default '{}'::jsonb
)
returns public.permission_audit_events
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.permission_audit_events;
begin
  insert into public.permission_audit_events (
    actor_id,
    actor_role,
    permission,
    decision,
    entity_type,
    entity_id,
    organization_id,
    details
  )
  values (
    auth.uid(),
    target_actor_role,
    target_permission,
    target_decision,
    target_entity_type,
    target_entity_id,
    target_organization_id,
    coalesce(event_details, '{}'::jsonb)
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
    'permission.' || target_decision,
    coalesce(target_entity_type, 'permission'),
    target_entity_id,
    jsonb_build_object(
      'permission', target_permission,
      'actor_role', target_actor_role,
      'organization_id', target_organization_id,
      'details', coalesce(event_details, '{}'::jsonb)
    )
  );

  return saved;
end;
$$;

alter table public.user_platform_roles enable row level security;
alter table public.permission_audit_events enable row level security;

create policy "platform roles are visible to active platform operators"
  on public.user_platform_roles for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.has_any_platform_role(array['founder', 'platform_admin']::public.platform_role[])
  );

create policy "permission audit visible to platform and organization admins"
  on public.permission_audit_events for select
  to authenticated
  using (
    public.has_any_platform_role(array['founder', 'platform_admin', 'reviewer', 'pilot_coordinator']::public.platform_role[])
    or (
      organization_id is not null
      and public.is_organization_admin(organization_id)
    )
  );

revoke all on function public.has_platform_role(public.platform_role) from public;
grant execute on function public.has_platform_role(public.platform_role) to authenticated;
revoke all on function public.has_any_platform_role(public.platform_role[]) from public;
grant execute on function public.has_any_platform_role(public.platform_role[]) to authenticated;
revoke all on function public.record_permission_audit_event(text, text, text, text, uuid, uuid, jsonb) from public;
grant execute on function public.record_permission_audit_event(text, text, text, text, uuid, uuid, jsonb) to authenticated;
