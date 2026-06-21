create extension if not exists pgcrypto;

create type public.organization_role as enum ('admin', 'member');
create type public.listing_reason as enum (
  'excess',
  'near_expiry',
  'slow_moving',
  'other'
);
create type public.offer_type as enum ('free', 'sale', 'exchange');
create type public.listing_status as enum (
  'draft',
  'published',
  'paused',
  'completed',
  'expired',
  'removed'
);
create type public.request_status as enum (
  'pending',
  'accepted',
  'declined',
  'cancelled',
  'completed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  phone text,
  country_code text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  country_code text,
  city text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  is_restricted boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  created_by uuid not null references auth.users(id),
  category_id uuid not null references public.categories(id),
  title text not null check (char_length(title) between 3 and 140),
  description text not null check (char_length(description) between 10 and 3000),
  reason public.listing_reason not null,
  offer_type public.offer_type not null,
  quantity_total numeric(14, 3) not null check (quantity_total > 0),
  quantity_available numeric(14, 3) not null check (quantity_available >= 0),
  unit text not null check (char_length(unit) between 1 and 40),
  unit_price numeric(14, 2) check (unit_price >= 0),
  currency char(3),
  expiry_date date,
  city text not null,
  country_code text not null,
  status public.listing_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (quantity_available <= quantity_total),
  check (
    (offer_type = 'sale' and unit_price is not null and currency is not null)
    or (offer_type <> 'sale')
  )
);

create table public.listing_requests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id),
  requester_id uuid not null references auth.users(id),
  requested_quantity numeric(14, 3) not null check (requested_quantity > 0),
  message text check (char_length(message) <= 1000),
  status public.request_status not null default 'pending',
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index listings_discovery_idx
  on public.listings (status, category_id, country_code, city, expiry_date);
create index listing_requests_owner_workflow_idx
  on public.listing_requests (listing_id, status, created_at);
create index organization_members_user_idx
  on public.organization_members (user_id, organization_id);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(new.email, '@', 1),
      'Redistribut member'
    )
  );

  return new;
end;
$$;

create trigger create_profile_after_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.add_organization_creator_as_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_members (organization_id, user_id, role)
  values (new.id, new.created_by, 'admin');

  return new;
end;
$$;

create trigger add_organization_admin_after_create
  after insert on public.organizations
  for each row execute function public.add_organization_creator_as_admin();

create or replace function public.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_organization_admin(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = target_organization_id
      and user_id = auth.uid()
      and role = 'admin'
  );
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
      'quantity', target_request.requested_quantity
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

  return target_request;
end;
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_requests enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles are visible to signed-in users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "users manage their own profile"
  on public.profiles for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "organizations are publicly visible"
  on public.organizations for select
  using (true);

create policy "signed-in users create organizations"
  on public.organizations for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "members update organizations"
  on public.organizations for update
  to authenticated
  using (public.is_organization_admin(id))
  with check (public.is_organization_admin(id));

create policy "members view their memberships"
  on public.organization_members for select
  to authenticated
  using (user_id = auth.uid() or public.is_organization_member(organization_id));

create policy "categories are publicly visible"
  on public.categories for select
  using (is_active = true);

create policy "published listings are publicly visible"
  on public.listings for select
  using (
    status = 'published'
    or public.is_organization_member(organization_id)
  );

create policy "organization members create listings"
  on public.listings for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and public.is_organization_member(organization_id)
    and not exists (
      select 1
      from public.categories
      where id = category_id and is_restricted = true
    )
  );

create policy "organization members update listings"
  on public.listings for update
  to authenticated
  using (public.is_organization_member(organization_id))
  with check (public.is_organization_member(organization_id));

create policy "requesters and listing owners view requests"
  on public.listing_requests for select
  to authenticated
  using (
    requester_id = auth.uid()
    or exists (
      select 1
      from public.listings
      where id = listing_id
        and public.is_organization_member(organization_id)
    )
  );

create policy "signed-in users request published listings"
  on public.listing_requests for insert
  to authenticated
  with check (
    requester_id = auth.uid()
    and exists (
      select 1
      from public.listings
      where id = listing_id
        and status = 'published'
        and quantity_available >= requested_quantity
        and not public.is_organization_member(organization_id)
    )
  );

create policy "requesters cancel their pending requests"
  on public.listing_requests for update
  to authenticated
  using (requester_id = auth.uid() and status = 'pending')
  with check (requester_id = auth.uid() and status = 'cancelled');

revoke all on function public.accept_listing_request(uuid) from public;
grant execute on function public.accept_listing_request(uuid) to authenticated;
revoke all on function public.complete_listing_request(uuid) from public;
grant execute on function public.complete_listing_request(uuid) to authenticated;

insert into public.categories (name, slug, is_restricted) values
  ('Food and Beverage', 'food-and-beverage', false),
  ('Office Supplies', 'office-supplies', false),
  ('Packaging Materials', 'packaging-materials', false),
  ('Furniture', 'furniture', false),
  ('Medical and Pharmaceutical', 'medical-and-pharmaceutical', true),
  ('Hazardous Materials', 'hazardous-materials', true);
