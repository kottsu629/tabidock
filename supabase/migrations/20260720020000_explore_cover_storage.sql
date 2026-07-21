-- Exploreのカバー画像。公開旅行は未ログインでも表示するため公開バケットとし、
-- 書き込みは旅行オーナー自身の user_id/trip_id 配下だけに制限する。
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'trip-covers',
  'trip-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 公開バケットのオブジェクト取得にSELECTポリシーは不要。
-- 一覧取得まで許可しないよう、storage.objectsの公開SELECTポリシーは作成しない。
drop policy if exists "旅行カバー画像は誰でも閲覧可" on storage.objects;

drop policy if exists "オーナーは旅行カバー画像を追加可" on storage.objects;
create policy "オーナーは旅行カバー画像を追加可"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trip-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.trips t
    where t.id::text = (storage.foldername(name))[2]
      and t.user_id = (select auth.uid())
  )
);

drop policy if exists "オーナーは旅行カバー画像を更新可" on storage.objects;
create policy "オーナーは旅行カバー画像を更新可"
on storage.objects for update
to authenticated
using (
  bucket_id = 'trip-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'trip-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.trips t
    where t.id::text = (storage.foldername(name))[2]
      and t.user_id = (select auth.uid())
  )
);

drop policy if exists "オーナーは旅行カバー画像を削除可" on storage.objects;
create policy "オーナーは旅行カバー画像を削除可"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'trip-covers'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
