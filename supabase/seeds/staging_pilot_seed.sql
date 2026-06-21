-- ReDist staging pilot seed
-- Apply only to staging/local pilot environments. Do not run against production.
-- Default seed password for all accounts: ReDistPilot!2026
-- Rotate passwords before inviting real organizations.

create extension if not exists pgcrypto;

do $$
declare
  seed_password text := 'ReDistPilot!2026';
begin
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values
    (
      '10000000-0000-4000-8000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'founder@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"redist_platform_roles":["founder"]}'::jsonb,
      '{"display_name":"ReDist Founder"}'::jsonb,
      now(),
      now()
    ),
    (
      '10000000-0000-4000-8000-000000000002',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'platform-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"redist_platform_roles":["platform_admin"]}'::jsonb,
      '{"display_name":"ReDist Platform Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '10000000-0000-4000-8000-000000000003',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'reviewer@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"redist_platform_roles":["reviewer"]}'::jsonb,
      '{"display_name":"ReDist Verification Reviewer"}'::jsonb,
      now(),
      now()
    ),
    (
      '10000000-0000-4000-8000-000000000004',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'pilot-coordinator@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"],"redist_platform_roles":["pilot_coordinator"]}'::jsonb,
      '{"display_name":"ReDist Pilot Coordinator"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000001',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'restaurant-a-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Restaurant A Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000002',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'restaurant-a-user@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Restaurant A User"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000003',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'restaurant-b-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Restaurant B Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000004',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'restaurant-b-user@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Restaurant B User"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000005',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'hotel-a-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Hotel A Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000006',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'hotel-a-user@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Hotel A User"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000007',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'warehouse-a-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Warehouse A Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000008',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'warehouse-a-user@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Warehouse A User"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000009',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'ngo-a-admin@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"NGO A Admin"}'::jsonb,
      now(),
      now()
    ),
    (
      '20000000-0000-4000-8000-000000000010',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'ngo-a-user@staging.redist.ae',
      crypt(seed_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"NGO A User"}'::jsonb,
      now(),
      now()
    )
  on conflict (id) do update
  set email = excluded.email,
      encrypted_password = excluded.encrypted_password,
      email_confirmed_at = excluded.email_confirmed_at,
      raw_app_meta_data = excluded.raw_app_meta_data,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();
end $$;

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  id::text,
  id,
  jsonb_build_object(
    'sub', id::text,
    'email', email,
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  now(),
  now(),
  now()
from auth.users
where email in (
  'founder@staging.redist.ae',
  'platform-admin@staging.redist.ae',
  'reviewer@staging.redist.ae',
  'pilot-coordinator@staging.redist.ae',
  'restaurant-a-admin@staging.redist.ae',
  'restaurant-a-user@staging.redist.ae',
  'restaurant-b-admin@staging.redist.ae',
  'restaurant-b-user@staging.redist.ae',
  'hotel-a-admin@staging.redist.ae',
  'hotel-a-user@staging.redist.ae',
  'warehouse-a-admin@staging.redist.ae',
  'warehouse-a-user@staging.redist.ae',
  'ngo-a-admin@staging.redist.ae',
  'ngo-a-user@staging.redist.ae'
)
on conflict (provider_id, provider) do update
set user_id = excluded.user_id,
    identity_data = excluded.identity_data,
    updated_at = now();

insert into public.profiles (id, display_name, phone, country_code, city)
values
  ('10000000-0000-4000-8000-000000000001', 'ReDist Founder', '+971500000001', 'AE', 'Dubai'),
  ('10000000-0000-4000-8000-000000000002', 'ReDist Platform Admin', '+971500000002', 'AE', 'Dubai'),
  ('10000000-0000-4000-8000-000000000003', 'ReDist Verification Reviewer', '+971500000003', 'AE', 'Dubai'),
  ('10000000-0000-4000-8000-000000000004', 'ReDist Pilot Coordinator', '+971500000004', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000001', 'Restaurant A Admin', '+971501000001', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000002', 'Restaurant A User', '+971501000002', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000003', 'Restaurant B Admin', '+971501000003', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000004', 'Restaurant B User', '+971501000004', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000005', 'Hotel A Admin', '+971501000005', 'AE', 'Abu Dhabi'),
  ('20000000-0000-4000-8000-000000000006', 'Hotel A User', '+971501000006', 'AE', 'Abu Dhabi'),
  ('20000000-0000-4000-8000-000000000007', 'Warehouse A Admin', '+971501000007', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000008', 'Warehouse A User', '+971501000008', 'AE', 'Dubai'),
  ('20000000-0000-4000-8000-000000000009', 'NGO A Admin', '+971501000009', 'AE', 'Sharjah'),
  ('20000000-0000-4000-8000-000000000010', 'NGO A User', '+971501000010', 'AE', 'Sharjah')
on conflict (id) do update
set display_name = excluded.display_name,
    phone = excluded.phone,
    country_code = excluded.country_code,
    city = excluded.city,
    updated_at = now();

insert into public.user_platform_roles (user_id, role, assigned_by, revoked_at)
values
  ('10000000-0000-4000-8000-000000000001', 'founder', '10000000-0000-4000-8000-000000000001', null),
  ('10000000-0000-4000-8000-000000000002', 'platform_admin', '10000000-0000-4000-8000-000000000001', null),
  ('10000000-0000-4000-8000-000000000003', 'reviewer', '10000000-0000-4000-8000-000000000001', null),
  ('10000000-0000-4000-8000-000000000004', 'pilot_coordinator', '10000000-0000-4000-8000-000000000001', null)
on conflict (user_id, role) do update
set assigned_by = excluded.assigned_by,
    revoked_at = null,
    assigned_at = now();

insert into public.organizations (id, name, slug, description, country_code, city, created_by)
values
  ('30000000-0000-4000-8000-000000000001', 'Restaurant A', 'restaurant-a', 'Controlled UAE pilot restaurant for prepared food and surplus inventory workflows.', 'AE', 'Dubai', '20000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000002', 'Restaurant B', 'restaurant-b', 'Controlled UAE pilot restaurant for branch-level listing and request validation.', 'AE', 'Dubai', '20000000-0000-4000-8000-000000000003'),
  ('30000000-0000-4000-8000-000000000003', 'Hotel A', 'hotel-a', 'Controlled UAE pilot hotel for furniture, fixtures, and hospitality surplus workflows.', 'AE', 'Abu Dhabi', '20000000-0000-4000-8000-000000000005'),
  ('30000000-0000-4000-8000-000000000004', 'Warehouse A', 'warehouse-a', 'Controlled UAE pilot warehouse for pallets, packaging, and logistics material workflows.', 'AE', 'Dubai', '20000000-0000-4000-8000-000000000007'),
  ('30000000-0000-4000-8000-000000000005', 'NGO A', 'ngo-a', 'Controlled UAE pilot NGO for recipient request, transfer completion, and certificate validation.', 'AE', 'Sharjah', '20000000-0000-4000-8000-000000000009')
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    country_code = excluded.country_code,
    city = excluded.city,
    updated_at = now();

insert into public.organization_members (organization_id, user_id, role)
values
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'organization_admin'),
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'organization_user'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000003', 'organization_admin'),
  ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000004', 'organization_user'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', 'organization_admin'),
  ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000006', 'organization_user'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000007', 'organization_admin'),
  ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000008', 'organization_user'),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000009', 'organization_admin'),
  ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000010', 'organization_user')
on conflict (organization_id, user_id) do update
set role = excluded.role;

insert into public.audit_events (actor_id, event_type, entity_type, entity_id, details)
values (
  '10000000-0000-4000-8000-000000000001',
  'staging_pilot.seeded',
  'pilot_seed',
  null,
  jsonb_build_object(
    'organizations', array['Restaurant A', 'Restaurant B', 'Hotel A', 'Warehouse A', 'NGO A'],
    'platform_roles', array['founder', 'platform_admin', 'reviewer', 'pilot_coordinator'],
    'membership_model', 'organization_admin and organization_user per pilot organization'
  )
);
