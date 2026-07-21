-- 既存UIでは公開が固定されていたため、同意なくExploreへ掲載されないよう
-- 既存旅行はいったん非公開に戻す。
update public.trips
set is_public = false
where is_public = true;

-- 新規旅行も、明示的に公開を選ぶまでは非公開にする
alter table public.trips
  alter column is_public set default false;

-- trip_membersには旅行の更新権限があるため、公開状態の変更だけは
-- UIを迂回した場合もオーナーに限定する。
create or replace function public.enforce_trip_visibility_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.is_public is distinct from old.is_public
    and auth.uid() is distinct from old.user_id
    and current_user not in ('postgres', 'supabase_admin', 'service_role') then
    raise exception 'Only the trip owner can change its public visibility.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_trip_visibility_owner on public.trips;

create trigger enforce_trip_visibility_owner
before update of is_public on public.trips
for each row execute function public.enforce_trip_visibility_owner();

revoke all on function public.enforce_trip_visibility_owner() from public;
