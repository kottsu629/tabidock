"use client";

import Link from "next/link";
import Image from "next/image";
import brandIcon from "@/app/icon.png";

type Props = {
  userName?: string;
  onLogout?: () => void;
};

export default function AppHeader({ userName, onLogout }: Props) {
  return (
    <header className="bg-[#fffdf8] border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        <Link href="/dashboard" className="no-underline">
          <div className="flex items-center gap-2">
            <Image
              src={brandIcon}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="font-bold text-[1.1rem] text-slate-900 tracking-[-0.02em]">
              TabiDock
            </span>
          </div>
        </Link>

        {userName && onLogout && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{userName}さん</span>
            <button
              onClick={onLogout}
              className="text-[0.8rem] text-slate-500 py-1.5 px-[14px] border border-slate-200 rounded-lg bg-white cursor-pointer hover:bg-slate-50 transition-colors"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
