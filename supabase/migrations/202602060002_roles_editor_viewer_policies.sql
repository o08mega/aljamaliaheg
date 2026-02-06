-- Extend RBAC with editor role permissions and stronger access checks

create or replace function public.user_role(check_user_id uuid default auth.uid())
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.name
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = check_user_id
  limit 1;
$$;

create or replace function public.is_editor_or_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.user_role(check_user_id) in ('admin', 'editor');
$$;

-- NEWS: editors can create/update, only admin can delete

drop policy if exists "Editor or admin write news" on public.news;
create policy "Editor or admin write news"
on public.news
for insert
to authenticated
with check (public.is_editor_or_admin());

drop policy if exists "Editor or admin update news" on public.news;
create policy "Editor or admin update news"
on public.news
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "Admin delete news" on public.news;
create policy "Admin delete news"
on public.news
for delete
to authenticated
using (public.is_admin());

-- SERVICES: editors can manage content records except delete

drop policy if exists "Editor or admin write services" on public.services;
create policy "Editor or admin write services"
on public.services
for insert
to authenticated
with check (public.is_editor_or_admin());

drop policy if exists "Editor or admin update services" on public.services;
create policy "Editor or admin update services"
on public.services
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "Admin delete services" on public.services;
create policy "Admin delete services"
on public.services
for delete
to authenticated
using (public.is_admin());

-- HEALTH SERVICES

drop policy if exists "Editor or admin write health services" on public.health_services;
create policy "Editor or admin write health services"
on public.health_services
for insert
to authenticated
with check (public.is_editor_or_admin());

drop policy if exists "Editor or admin update health services" on public.health_services;
create policy "Editor or admin update health services"
on public.health_services
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "Admin delete health services" on public.health_services;
create policy "Admin delete health services"
on public.health_services
for delete
to authenticated
using (public.is_admin());

-- BUSINESSES

drop policy if exists "Editor or admin write businesses" on public.businesses;
create policy "Editor or admin write businesses"
on public.businesses
for insert
to authenticated
with check (public.is_editor_or_admin());

drop policy if exists "Editor or admin update businesses" on public.businesses;
create policy "Editor or admin update businesses"
on public.businesses
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "Admin delete businesses" on public.businesses;
create policy "Admin delete businesses"
on public.businesses
for delete
to authenticated
using (public.is_admin());

-- ADS: editors can manage active status and title, delete reserved for admins

drop policy if exists "Editor or admin write ads" on public.ads;
create policy "Editor or admin write ads"
on public.ads
for insert
to authenticated
with check (public.is_editor_or_admin());

drop policy if exists "Editor or admin update ads" on public.ads;
create policy "Editor or admin update ads"
on public.ads
for update
to authenticated
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

drop policy if exists "Admin delete ads" on public.ads;
create policy "Admin delete ads"
on public.ads
for delete
to authenticated
using (public.is_admin());

-- SETTINGS and ROLES remain admin-only via prior migration.
