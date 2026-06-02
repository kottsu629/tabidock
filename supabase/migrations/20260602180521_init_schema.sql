-- カテゴリのenum
create type expense_category as enum (
  '交通費',
  '宿泊',
  '食費',
  '観光',
  'その他'
);

-- ユーザー（Supabase Authと連動）
create table users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- 旅行
create table trips (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  title text not null,
  destination text not null,
  area text not null,
  start_date date not null,
  end_date date not null,
  num_people integer not null check (num_people > 0),
  total_cost integer not null default 0,
  is_public boolean not null default true,
  created_at timestamptz default now()
);

-- 費用
create table expenses (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid references trips(id) on delete cascade not null,
  category expense_category not null,
  title text not null,
  amount integer not null check (amount >= 0)
);

-- expensesの変更時にtotal_costを自動更新するトリガー
create or replace function update_total_cost()
returns trigger as $$
begin
  update trips
  set total_cost = (
    select coalesce(sum(amount), 0)
    from expenses
    where trip_id = coalesce(new.trip_id, old.trip_id)
  )
  where id = coalesce(new.trip_id, old.trip_id);
  return new;
end;
$$ language plpgsql;

create trigger sync_total_cost
after insert or update or delete on expenses
for each row execute function update_total_cost();

-- RLS有効化
alter table users enable row level security;
alter table trips enable row level security;
alter table expenses enable row level security;

-- usersのRLSポリシー
create policy "自分のプロフィールのみ編集可" on users
  for all using (auth.uid() = id);

-- tripsのRLSポリシー
create policy "公開旅行は誰でも閲覧可" on trips
  for select using (is_public = true);

create policy "自分の旅行は全操作可" on trips
  for all using (auth.uid() = user_id);

-- expensesのRLSポリシー
create policy "自分の旅行の費用は全操作可" on expenses
  for all using (
    exists (
      select 1 from trips
      where trips.id = expenses.trip_id
      and trips.user_id = auth.uid()
    )
  );