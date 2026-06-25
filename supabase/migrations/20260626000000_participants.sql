-- 開発用データのリセット(num_peopleのみで参加者名を持たないため)
delete from trips;

-- 参加者テーブル
create table participants (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  name text not null,
  created_at timestamptz default now()
);

alter table participants enable row level security;

create policy "自分の旅行の参加者は全操作可" on participants
  for all using (
    exists (
      select 1 from trips
      where trips.id = participants.trip_id
      and trips.user_id = auth.uid()
    )
  );

-- expensesに参加者を紐づける。NULL = 共有費(全員で割る)
alter table expenses add column participant_id uuid references participants(id) on delete set null;

-- num_peopleはparticipantsの件数で代替するため削除
alter table trips drop column num_people;
