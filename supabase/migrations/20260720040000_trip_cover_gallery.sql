-- 最大5枚のカバー写真と、写真ごとの表示位置を順序付きJSONとして保持する。
-- 既存の単一カバー列は1枚目との後方互換用として残す。
alter table public.trips
  add column if not exists cover_images jsonb not null default '[]'::jsonb;

update public.trips t
set cover_images = jsonb_build_array(
  jsonb_build_object(
    'image_url', t.cover_image_url,
    'cover_image_fit', t.cover_image_fit,
    'cover_image_zoom', t.cover_image_zoom,
    'cover_image_position_x', t.cover_image_position_x,
    'cover_image_position_y', t.cover_image_position_y
  )
)
where t.cover_image_url is not null
  and t.cover_image_url ~* '^https?://'
  and t.cover_images = '[]'::jsonb;

create or replace function public.is_valid_trip_cover_images(value jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  image jsonb;
  zoom numeric;
  position_x integer;
  position_y integer;
begin
  if jsonb_typeof(value) is distinct from 'array' then
    return false;
  end if;

  if jsonb_array_length(value) > 5 then
    return false;
  end if;

  for image in select item from jsonb_array_elements(value) as items(item)
  loop
    if jsonb_typeof(image) is distinct from 'object'
      or jsonb_typeof(image -> 'image_url') is distinct from 'string'
      or length(image ->> 'image_url') > 2048
      or (image ->> 'image_url') !~* '^https?://'
      or (image ->> 'cover_image_fit') not in ('cover', 'contain')
      or coalesce(image ->> 'cover_image_zoom', '') !~ '^[0-9]+(\.[0-9]+)?$'
      or coalesce(image ->> 'cover_image_position_x', '') !~ '^[0-9]+$'
      or coalesce(image ->> 'cover_image_position_y', '') !~ '^[0-9]+$' then
      return false;
    end if;

    begin
      zoom := (image ->> 'cover_image_zoom')::numeric;
      position_x := (image ->> 'cover_image_position_x')::integer;
      position_y := (image ->> 'cover_image_position_y')::integer;
    exception when others then
      return false;
    end;

    if zoom not between 1.00 and 2.00
      or position_x not between 0 and 100
      or position_y not between 0 and 100 then
      return false;
    end if;
  end loop;

  return true;
end;
$$;

alter table public.trips
  drop constraint if exists trips_cover_images_valid;

alter table public.trips
  add constraint trips_cover_images_valid
  check (public.is_valid_trip_cover_images(cover_images));

revoke all on function public.is_valid_trip_cover_images(jsonb) from public;
grant execute on function public.is_valid_trip_cover_images(jsonb) to authenticated;

-- 共有メンバーがギャラリーを変更できないよう、既存のオーナー制約へ追加する。
create or replace function public.enforce_trip_explore_settings_owner()
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
    or new.cover_images is distinct from old.cover_images
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

drop trigger if exists enforce_trip_explore_settings_owner on public.trips;
create trigger enforce_trip_explore_settings_owner
before update of
  is_public,
  cover_image_url,
  cover_image_fit,
  cover_image_zoom,
  cover_image_position_x,
  cover_image_position_y,
  cover_images,
  travel_style,
  themes
on public.trips
for each row execute function public.enforce_trip_explore_settings_owner();

-- 公開RPCへギャラリーを追加する。取得カラムはExplore表示に必要なものだけに限定する。
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
  cover_images jsonb,
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
    t.cover_images,
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
  cover_images jsonb,
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
    t.cover_images,
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
