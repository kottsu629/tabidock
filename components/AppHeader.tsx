"use client";

import SiteHeader from "@/components/SiteHeader";

type Props = {
  userName?: string;
  onLogout?: () => void;
};

export default function AppHeader({ userName, onLogout }: Props) {
  return (
    <SiteHeader
      brandHref="/dashboard"
      actions={
        userName && onLogout ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{userName}さん</span>
            <button
              onClick={onLogout}
              className="text-[0.8rem] text-slate-500 py-1.5 px-[14px] border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
              ログアウト
            </button>
          </div>
        ) : null
      }
    />
  );
}
