# TabiDock - CLAUDE.md

## プロジェクト概要

旅行費用を記録・共有するWebアプリ

## 技術スタック

- Frontend: Next.js（App Router）
- Backend/DB: Supabase
- 認証: Supabase Auth

## ディレクトリ構成

src/
app/ # App Router pages
lib/
supabase.ts # Supabaseクライアント（必ずここからimport）

## 開発ルール

- App Router前提（pages/は使わない）
- Supabaseクライアントは必ず @/lib/supabase からimport
- total_costはexpensesの合計を自動計算してtripsに反映
- Server ComponentとClient Componentを意識して分ける

## UIルール

- 旅行追加はモーダル形式（ページ遷移なし）

## DBスキーマ

（テーブル定義をそのまま書く）

## MVPスコープ外（実装しない）

- 写真添付
- AIレシート読み取り
- いいね・ブックマーク
  ...

## 現在の進捗

- [ ] Supabaseセットアップ
- [ ] 認証
- [ ] ダッシュボード
      ...
