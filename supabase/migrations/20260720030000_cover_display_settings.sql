-- カバー画像の表示方法を旅行ごとに保存する。
alter table public.trips
  add column if not exists cover_image_fit text not null default 'cover'
    check (cover_image_fit in ('cover', 'contain')),
  add column if not exists cover_image_zoom numeric(3, 2) not null default 1.00
    check (cover_image_zoom between 1.00 and 2.00),
  add column if not exists cover_image_position_x integer not null default 50
    check (cover_image_position_x between 0 and 100),
  add column if not exists cover_image_position_y integer not null default 50
    check (cover_image_position_y between 0 and 100);

-- 共有メンバーには旅行の更新権限があるため、Explore掲載内容の変更は
-- 公開状態と同様にオーナーだけへ限定する。
drop trigger if exists enforce_trip_visibility_owner on public.trips;
drop function if exists public.enforce_trip_visibility_owner();

create function public.enforce_trip_explore_settings_owner()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (
    new.is_public is distinct from old.is_public
    or new.cover_image_url is distinct from old.cover_image_url
    or new.cover_image_fit is distinct from old.cover_image_fit
    or new.cover_image_zoom is distinct from old.cover_image_zoom
    or new.cover_image_position_x is distinct from old.cover_image_position_x
    or new.cover_image_position_y is distinct from old.cover_image_position_y
    or new.travel_style is distinct from old.travel_style
    or new.themes is distinct from old.themes
  )
    and auth.uid() is distinct from old.user_id
    and current_user not in ('postgres', 'supabase_admin', 'service_role') then
    raise exception 'Only the trip owner can change Explore settings.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger enforce_trip_explore_settings_owner
before update of
  is_public,
  cover_image_url,
  cover_image_fit,
  cover_image_zoom,
  cover_image_position_x,
  cover_image_position_y,
  travel_style,
  themes
on public.trips
for each row execute function public.enforce_trip_explore_settings_owner();

revoke all on function public.enforce_trip_explore_settings_owner() from public;

-- 戻り値へ表示設定を追加するため、公開旅行RPCを再作成する。
drop function if exists public.get_public_trips(integer, integer, integer, text, text);
drop function if exists public.get_public_trip(uuid);

create function public.get_public_trips(
  p_min_budget integer default null,
  p_max_budget integer default null,
  p_num_people integer default null,
  p_theme text default null,
  p_travel_style text default null
)
returns table (
  id uuid,
  title text,
  destination text,
  area text,
  start_date date,
  end_date date,
  total_cost integer,
  cover_image_url text,
  cover_image_fit text,
  cover_image_zoom numeric,
  cover_image_position_x integer,
  cover_image_position_y integer,
  travel_style text,
  themes text[],
  participant_count integer,
  author_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    t.id,
    t.title,
    t.destination,
    t.area,
    t.start_date,
    t.end_date,
    t.total_cost,
    t.cover_image_url,
    t.cover_image_fit,
    t.cover_image_zoom,
    t.cover_image_position_x,
    t.cover_image_position_y,
    t.travel_style,
    t.themes,
    participant_totals.participant_count,
    u.name as author_name
  from public.trips t
  join public.users u on u.id = t.user_id
  cross join lateral (
    select count(*)::integer as participant_count
    from public.participants p
    where p.trip_id = t.id
  ) participant_totals
  where t.is_public = true
    and (p_min_budget is null or t.total_cost >= p_min_budget)
    and (p_max_budget is null or t.total_cost <= p_max_budget)
    and (p_num_people is null or participant_totals.participant_count = p_num_people)
    and (p_theme is null or p_theme = any(t.themes))
    and (p_travel_style is null or t.travel_style = p_travel_style)
  order by t.created_at desc nulls last;
$$;

create function public.get_public_trip(p_trip_id uuid)
returns table (
  id uuid,
  title text,
  destination text,
  area text,
  start_date date,
  end_date date,
  total_cost integer,
  cover_image_url text,
  cover_image_fit text,
  cover_image_zoom numeric,
  cover_image_position_x integer,
  cover_image_position_y integer,
  travel_style text,
  themes text[],
  participant_count integer,
  author_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    t.id,
    t.title,
    t.destination,
    t.area,
    t.start_date,
    t.end_date,
    t.total_cost,
    t.cover_image_url,
    t.cover_image_fit,
    t.cover_image_zoom,
    t.cover_image_position_x,
    t.cover_image_position_y,
    t.travel_style,
    t.themes,
    (
      select count(*)::integer
      from public.participants p
      where p.trip_id = t.id
    ) as participant_count,
    u.name as author_name
  from public.trips t
  join public.users u on u.id = t.user_id
  where t.id = p_trip_id
    and t.is_public = true;
$$;

revoke all on function public.get_public_trips(integer, integer, integer, text, text) from public;
revoke all on function public.get_public_trip(uuid) from public;

grant execute on function public.get_public_trips(integer, integer, integer, text, text) to anon, authenticated;
grant execute on function public.get_public_trip(uuid) to anon, authenticated;
