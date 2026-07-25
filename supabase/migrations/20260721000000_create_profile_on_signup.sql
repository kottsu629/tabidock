-- Authユーザーと公開プロフィールを同じトランザクションで作成する。
-- プロフィール作成に失敗した場合はAuthユーザー作成もロールバックされるため、
-- 片方だけが存在する状態を防げる。
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'ユーザー'
    ),
    new.email
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 以前の2段階登録でプロフィールだけ作成されなかったユーザーを補完する。
insert into public.users (id, name, email)
select
  auth_user.id,
  coalesce(
    nullif(btrim(auth_user.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(auth_user.email, ''), '@', 1), ''),
    'ユーザー'
  ),
  auth_user.email
from auth.users as auth_user
where not exists (
  select 1
  from public.users as profile
  where profile.id = auth_user.id
);
