-- Supabase baseline schema + RBAC + RLS
create extension if not exists pgcrypto;

-- ROLES
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

insert into public.roles (name)
values ('admin'), ('editor'), ('viewer')
on conflict (name) do nothing;

-- USERS PROFILE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role_id uuid references public.roles(id),
  created_at timestamptz default now()
);

-- NEWS
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text,
  content_ar text not null,
  content_en text,
  published boolean default true,
  created_at timestamptz default now()
);

-- SERVICES
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category text,
  name_ar text not null,
  name_en text,
  description_ar text,
  description_en text,
  phone text,
  created_at timestamptz default now()
);

-- HEALTH SERVICES
create table if not exists public.health_services (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  type text,
  address text,
  phone text,
  created_at timestamptz default now()
);

-- BUSINESSES
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  category text,
  phone text,
  created_at timestamptz default now()
);

-- ADS
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  title_ar text,
  title_en text,
  active boolean default true,
  created_at timestamptz default now()
);

-- CONTACT MESSAGES
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz default now()
);

-- SETTINGS
create table if not exists public.settings (
  key text primary key,
  value text
);

-- helper to check admin role
create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.roles r on r.id = p.role_id
    where p.id = check_user_id and r.name = 'admin'
  );
$$;

-- Trigger: assign new users viewer role by default
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role_id)
  values (
    new.id,
    (select id from public.roles where name = 'viewer' limit 1)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.services enable row level security;
alter table public.health_services enable row level security;
alter table public.businesses enable row level security;
alter table public.ads enable row level security;
alter table public.contact_messages enable row level security;
alter table public.settings enable row level security;

-- Profiles policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Admin manage profiles" on public.profiles;
create policy "Admin manage profiles"
on public.profiles for all
using (public.is_admin())
with check (public.is_admin());

-- Shared pattern for admin-managed tables
-- NEWS
drop policy if exists "Public read published news" on public.news;
create policy "Public read published news"
on public.news for select
using (published = true or public.is_admin());

drop policy if exists "Admin manage news" on public.news;
create policy "Admin manage news"
on public.news for all
using (public.is_admin())
with check (public.is_admin());

-- SERVICES
drop policy if exists "Public read services" on public.services;
create policy "Public read services"
on public.services for select
using (true);

drop policy if exists "Admin manage services" on public.services;
create policy "Admin manage services"
on public.services for all
using (public.is_admin())
with check (public.is_admin());

-- HEALTH SERVICES
drop policy if exists "Public read health services" on public.health_services;
create policy "Public read health services"
on public.health_services for select
using (true);

drop policy if exists "Admin manage health services" on public.health_services;
create policy "Admin manage health services"
on public.health_services for all
using (public.is_admin())
with check (public.is_admin());

-- BUSINESSES
drop policy if exists "Public read businesses" on public.businesses;
create policy "Public read businesses"
on public.businesses for select
using (true);

drop policy if exists "Admin manage businesses" on public.businesses;
create policy "Admin manage businesses"
on public.businesses for all
using (public.is_admin())
with check (public.is_admin());

-- ADS
drop policy if exists "Public read active ads" on public.ads;
create policy "Public read active ads"
on public.ads for select
using (active = true or public.is_admin());

drop policy if exists "Admin manage ads" on public.ads;
create policy "Admin manage ads"
on public.ads for all
using (public.is_admin())
with check (public.is_admin());

-- CONTACT MESSAGES
drop policy if exists "Public create contact messages" on public.contact_messages;
create policy "Public create contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (true);

drop policy if exists "Admin read contact messages" on public.contact_messages;
create policy "Admin read contact messages"
on public.contact_messages for select
using (public.is_admin());

drop policy if exists "Admin manage contact messages" on public.contact_messages;
create policy "Admin manage contact messages"
on public.contact_messages for all
using (public.is_admin())
with check (public.is_admin());

-- SETTINGS
drop policy if exists "Public read settings" on public.settings;
create policy "Public read settings"
on public.settings for select
using (true);

drop policy if exists "Admin manage settings" on public.settings;
create policy "Admin manage settings"
on public.settings for all
using (public.is_admin())
with check (public.is_admin());

-- Dummy data
insert into public.news (title_ar, content_ar)
values ('خبر تجريبي', 'هذا خبر تجريبي لبوابة مدينة الجمالية');
