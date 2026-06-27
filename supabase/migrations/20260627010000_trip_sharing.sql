-- ユーザーのemailを保存（共有時にメールで検索するため）
alter table users add column email text;

-- ユーザー検索（共有相手をメールで探す）のため認証済みユーザー全員に参照を許可
create policy "認証済みユーザーは全員参照可" on users
  for select using (auth.role() = 'authenticated');

-- 旅行の共有メンバー
create table trip_members (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (trip_id, user_id)
);

alter table trip_members enable row level security;

create policy "オーナーまたはメンバーは閲覧可" on trip_members
  for select using (
    exists (select 1 from trips where trips.id = trip_members.trip_id and trips.user_id = auth.uid())
    or user_id = auth.uid()
  );

create policy "オーナーのみ招待可" on trip_members
  for insert with check (
    exists (select 1 from trips where trips.id = trip_members.trip_id and trips.user_id = auth.uid())
  );

create policy "オーナーのみ解除可" on trip_members
  for delete using (
    exists (select 1 from trips where trips.id = trip_members.trip_id and trips.user_id = auth.uid())
  );

-- trips: メンバーも閲覧・更新（expenses合計トリガー用）できるように
drop policy "自分の旅行は全操作可" on trips;

create policy "オーナーは全操作可" on trips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "メンバーは閲覧可" on trips
  for select using (
    exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid())
  );

create policy "メンバーは更新可" on trips
  for update using (
    exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid())
  );

-- expenses: オーナーまたはメンバーが操作可
drop policy "自分の旅行の費用は全操作可" on expenses;

create policy "オーナーまたはメンバーは費用を操作可" on expenses
  for all using (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and (
        trips.user_id = auth.uid()
        or exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid())
      )
    )
  );

-- participants: オーナーまたはメンバーが操作可
drop policy "自分の旅行の参加者は全操作可" on participants;

create policy "オーナーまたはメンバーは参加者を操作可" on participants
  for all using (
    exists (
      select 1 from trips
      where trips.id = participants.trip_id
      and (
        trips.user_id = auth.uid()
        or exists (select 1 from trip_members where trip_members.trip_id = trips.id and trip_members.user_id = auth.uid())
      )
    )
  );

-- リアルタイムで変更を配信
alter publication supabase_realtime add table trips;
alter publication supabase_realtime add table expenses;
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table trip_members;
