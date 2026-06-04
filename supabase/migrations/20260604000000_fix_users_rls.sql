-- users の RLS ポリシーを操作別に分離
-- for all は SELECT も含むため、意図しない他ユーザーの閲覧を防ぐために明示的に分ける

drop policy if exists "自分のプロフィールのみ編集可" on users;

create policy "自分のプロフィールのみ閲覧可" on users
  for select using (auth.uid() = id);

create policy "自分のプロフィールのみ作成可" on users
  for insert with check (auth.uid() = id);

create policy "自分のプロフィールのみ更新可" on users
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "自分のプロフィールのみ削除可" on users
  for delete using (auth.uid() = id);
