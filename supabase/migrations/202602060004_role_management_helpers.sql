-- Role management helpers for production operations

begin;

create or replace function public.set_user_role_by_email(target_email text, target_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user_id uuid;
  target_role_id uuid;
begin
  if target_role not in ('admin', 'editor', 'viewer') then
    raise exception 'Invalid role: %', target_role;
  end if;

  select id into target_user_id
  from auth.users
  where email = target_email
  limit 1;

  if target_user_id is null then
    raise exception 'User with email % not found in auth.users', target_email;
  end if;

  select id into target_role_id
  from public.roles
  where name = target_role
  limit 1;

  update public.profiles
  set role_id = target_role_id
  where id = target_user_id;

  if not found then
    insert into public.profiles (id, role_id)
    values (target_user_id, target_role_id)
    on conflict (id) do update set role_id = excluded.role_id;
  end if;
end;
$$;

comment on function public.set_user_role_by_email(text, text)
is 'Assign admin/editor/viewer role to a Supabase auth user by email.';

commit;
