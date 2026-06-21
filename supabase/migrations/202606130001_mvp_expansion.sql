create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  country_code text,
  city text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.saved_listings (
  user_id uuid not null references auth.users(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  filters jsonb not null default '{}'::jsonb,
  notify boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_request_id uuid not null unique references public.listing_requests(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id),
  entity_type text not null,
  entity_id uuid not null,
  reason text not null check (char_length(reason) between 3 and 120),
  details text check (char_length(details) <= 2000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx on public.listing_images (listing_id, sort_order);
create index if not exists groups_category_location_idx on public.groups (category_id, country_code, city);
create index if not exists group_members_user_idx on public.group_members (user_id);
create index if not exists saved_searches_user_idx on public.saved_searches (user_id);
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists notifications_user_idx on public.notifications (user_id, read_at, created_at desc);
create index if not exists reports_status_idx on public.reports (status, created_at);

create or replace function public.create_conversation_for_listing_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.conversations (listing_request_id)
  values (new.id)
  on conflict (listing_request_id) do nothing;

  return new;
end;
$$;

create trigger create_conversation_after_listing_request
  after insert on public.listing_requests
  for each row execute function public.create_conversation_for_listing_request();

create or replace function public.publish_listing(target_listing_id uuid)
returns public.listings
language plpgsql
security definer
set search_path = public
as $$
declare
  target_listing public.listings;
begin
  select *
  into target_listing
  from public.listings
  where id = target_listing_id
  for update;

  if target_listing.id is null then
    raise exception 'Listing not found';
  end if;

  if not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  if target_listing.quantity_available <= 0 then
    raise exception 'Listing has no available quantity';
  end if;

  update public.listings
  set status = 'published',
      published_at = coalesce(published_at, now()),
      updated_at = now()
  where id = target_listing.id
  returning * into target_listing;

  insert into public.audit_events (actor_id, event_type, entity_type, entity_id)
  values (auth.uid(), 'listing.published', 'listing', target_listing.id);

  return target_listing;
end;
$$;

create or replace function public.pause_listing(target_listing_id uuid)
returns public.listings
language plpgsql
security definer
set search_path = public
as $$
declare
  target_listing public.listings;
begin
  select *
  into target_listing
  from public.listings
  where id = target_listing_id
  for update;

  if target_listing.id is null then
    raise exception 'Listing not found';
  end if;

  if not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  update public.listings
  set status = 'paused',
      updated_at = now()
  where id = target_listing.id
  returning * into target_listing;

  insert into public.audit_events (actor_id, event_type, entity_type, entity_id)
  values (auth.uid(), 'listing.paused', 'listing', target_listing.id);

  return target_listing;
end;
$$;

create or replace function public.decline_listing_request(target_request_id uuid)
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
  where id = target_request.listing_id;

  if not public.is_organization_member(target_listing.organization_id) then
    raise exception 'Not authorized';
  end if;

  if target_request.status <> 'pending' then
    raise exception 'Only pending requests can be declined';
  end if;

  update public.listing_requests
  set status = 'declined',
      updated_at = now()
  where id = target_request.id
  returning * into target_request;

  insert into public.audit_events (actor_id, event_type, entity_type, entity_id)
  values (auth.uid(), 'listing_request.declined', 'listing_request', target_request.id);

  return target_request;
end;
$$;

create or replace function public.cancel_listing_request(target_request_id uuid)
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

  if target_request.requester_id <> auth.uid() then
    raise exception 'Not authorized';
  end if;

  if target_request.status not in ('pending', 'accepted') then
    raise exception 'Request cannot be cancelled';
  end if;

  if target_request.status = 'accepted' then
    select *
    into target_listing
    from public.listings
    where id = target_request.listing_id
    for update;

    update public.listings
    set quantity_available = quantity_available + target_request.requested_quantity,
        status = case when status = 'paused' then 'published'::public.listing_status else status end,
        updated_at = now()
    where id = target_listing.id;
  end if;

  update public.listing_requests
  set status = 'cancelled',
      updated_at = now()
  where id = target_request.id
  returning * into target_request;

  insert into public.audit_events (actor_id, event_type, entity_type, entity_id)
  values (auth.uid(), 'listing_request.cancelled', 'listing_request', target_request.id);

  return target_request;
end;
$$;

alter table public.listing_images enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.saved_listings enable row level security;
alter table public.saved_searches enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

create policy "published listing images are visible"
  on public.listing_images for select
  using (
    exists (
      select 1 from public.listings
      where listings.id = listing_id
        and (listings.status = 'published' or public.is_organization_member(listings.organization_id))
    )
  );

create policy "organization members manage listing images"
  on public.listing_images for all
  to authenticated
  using (
    exists (
      select 1 from public.listings
      where listings.id = listing_id
        and public.is_organization_member(listings.organization_id)
    )
  )
  with check (
    exists (
      select 1 from public.listings
      where listings.id = listing_id
        and public.is_organization_member(listings.organization_id)
    )
  );

create policy "groups are publicly visible"
  on public.groups for select
  using (true);

create policy "signed-in users create groups"
  on public.groups for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "users manage their group memberships"
  on public.group_members for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users manage saved listings"
  on public.saved_listings for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "users manage saved searches"
  on public.saved_searches for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "participants view conversations"
  on public.conversations for select
  to authenticated
  using (
    exists (
      select 1
      from public.listing_requests lr
      join public.listings l on l.id = lr.listing_id
      where lr.id = listing_request_id
        and (lr.requester_id = auth.uid() or public.is_organization_member(l.organization_id))
    )
  );

create policy "participants view messages"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1
      from public.conversations c
      join public.listing_requests lr on lr.id = c.listing_request_id
      join public.listings l on l.id = lr.listing_id
      where c.id = conversation_id
        and (lr.requester_id = auth.uid() or public.is_organization_member(l.organization_id))
    )
  );

create policy "participants send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.conversations c
      join public.listing_requests lr on lr.id = c.listing_request_id
      join public.listings l on l.id = lr.listing_id
      where c.id = conversation_id
        and (lr.requester_id = auth.uid() or public.is_organization_member(l.organization_id))
    )
  );

create policy "users manage their notifications"
  on public.notifications for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "signed-in users create reports"
  on public.reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "reporters view their reports"
  on public.reports for select
  to authenticated
  using (reporter_id = auth.uid());

revoke all on function public.publish_listing(uuid) from public;
grant execute on function public.publish_listing(uuid) to authenticated;
revoke all on function public.pause_listing(uuid) from public;
grant execute on function public.pause_listing(uuid) to authenticated;
revoke all on function public.decline_listing_request(uuid) from public;
grant execute on function public.decline_listing_request(uuid) to authenticated;
revoke all on function public.cancel_listing_request(uuid) from public;
grant execute on function public.cancel_listing_request(uuid) to authenticated;
