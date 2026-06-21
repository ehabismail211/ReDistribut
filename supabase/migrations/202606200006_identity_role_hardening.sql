create or replace function public.sync_user_platform_role_claims(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  active_roles text[];
begin
  select coalesce(array_agg(role::text order by role::text), '{}'::text[])
  into active_roles
  from public.user_platform_roles
  where user_id = target_user_id
    and revoked_at is null;

  update auth.users
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{redist_platform_roles}',
    to_jsonb(active_roles),
    true
  )
  where id = target_user_id;
end;
$$;

create or replace function public.sync_user_platform_role_claims_from_row()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_user_platform_role_claims(coalesce(new.user_id, old.user_id));
  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_user_platform_role_claims_after_change on public.user_platform_roles;

create trigger sync_user_platform_role_claims_after_change
after insert or update or delete on public.user_platform_roles
for each row execute function public.sync_user_platform_role_claims_from_row();

create or replace function public.assign_platform_role(
  target_user_id uuid,
  target_role public.platform_role
)
returns public.user_platform_roles
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.user_platform_roles;
begin
  if not public.has_any_platform_role(array['founder', 'platform_admin']::public.platform_role[]) then
    raise exception 'permission denied assigning platform role';
  end if;

  insert into public.user_platform_roles (user_id, role, assigned_by, revoked_at)
  values (target_user_id, target_role, auth.uid(), null)
  on conflict (user_id, role)
  do update set
    assigned_by = auth.uid(),
    assigned_at = now(),
    revoked_at = null
  returning * into saved;

  perform public.record_permission_audit_event(
    'platform_role.assign',
    'allowed',
    target_role::text,
    'user_platform_role',
    target_user_id,
    null,
    jsonb_build_object('assigned_role', target_role)
  );

  return saved;
end;
$$;

create or replace function public.revoke_platform_role(
  target_user_id uuid,
  target_role public.platform_role
)
returns public.user_platform_roles
language plpgsql
security definer
set search_path = public
as $$
declare
  saved public.user_platform_roles;
begin
  if not public.has_any_platform_role(array['founder', 'platform_admin']::public.platform_role[]) then
    raise exception 'permission denied revoking platform role';
  end if;

  update public.user_platform_roles
  set revoked_at = now()
  where user_id = target_user_id
    and role = target_role
  returning * into saved;

  perform public.record_permission_audit_event(
    'platform_role.revoke',
    'allowed',
    target_role::text,
    'user_platform_role',
    target_user_id,
    null,
    jsonb_build_object('revoked_role', target_role)
  );

  return saved;
end;
$$;

revoke all on function public.sync_user_platform_role_claims(uuid) from public;
revoke all on function public.sync_user_platform_role_claims_from_row() from public;
revoke all on function public.assign_platform_role(uuid, public.platform_role) from public;
grant execute on function public.assign_platform_role(uuid, public.platform_role) to authenticated;
revoke all on function public.revoke_platform_role(uuid, public.platform_role) from public;
grant execute on function public.revoke_platform_role(uuid, public.platform_role) to authenticated;
