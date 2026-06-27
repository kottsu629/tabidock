-- trips ⇄ trip_members のRLSが互いを参照し合い無限再帰していたため、
-- security definer関数でRLSを経由せずにメンバー判定する
create or replace function is_trip_member(p_trip_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from trip_members
    where trip_id = p_trip_id and user_id = auth.uid()
  );
$$;

drop policy "メンバーは閲覧可" on trips;
drop policy "メンバーは更新可" on trips;

create policy "メンバーは閲覧可" on trips
  for select using (is_trip_member(trips.id));

create policy "メンバーは更新可" on trips
  for update using (is_trip_member(trips.id));
