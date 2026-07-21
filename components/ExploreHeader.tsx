import Image from "next/image";
import Link from "next/link";
import brandIcon from "@/app/icon.png";

type Props = {
  isAuthenticated: boolean;
};

export default function ExploreHeader({ isAuthenticated }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-[#fffdf8]/95 border-b border-slate-200 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-5 sm:gap-7">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image
              src={brandIcon}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="font-bold text-[1.05rem] sm:text-[1.1rem] text-slate-900 tracking-[-0.02em]">
              TabiDock
            </span>
          </Link>
          <Link
            href="/explore"
            className="text-sm font-semibold text-indigo-600 no-underline"
          >
            Explore
          </Link>
        </div>

        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-semibold text-white py-2 px-3 sm:px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors"
          >
            マイページ
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-slate-600 py-2 px-3 sm:px-4 border border-slate-200 rounded-lg bg-white"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="hidden sm:inline-flex text-sm font-semibold text-white py-2 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors"
            >
              無料で始める
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

