-- Exploreで利用する公開旅行のメタデータ
alter table public.trips
  add column if not exists cover_image_url text,
  add column if not exists travel_style text,
  add column if not exists themes text[] not null default '{}';

-- 公開旅行は新着順で取得し、絞り込みはDB側で完結させる
create index if not exists trips_public_created_at_idx
  on public.trips (created_at desc)
  where is_public = true;

create index if not exists trips_public_total_cost_idx
  on public.trips (total_cost)
  where is_public = true;

create index if not exists trips_public_travel_style_idx
  on public.trips (travel_style)
  where is_public = true and travel_style is not null;

create index if not exists trips_themes_idx
  on public.trips using gin (themes);

-- usersにはメールも含まれるため、テーブルのSELECT権限は広げない。
-- 匿名ユーザーにはExploreに必要な安全な列だけをsecurity definer関数で返す。
create or replace function public.get_public_trips(
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

create or replace function public.get_public_trip(p_trip_id uuid)
returns table (
  id uuid,
  title text,
  destination text,
  area text,
  start_date date,
  end_date date,
  total_cost integer,
  cover_image_url text,
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
