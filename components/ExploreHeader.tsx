import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

type Props = {
  isAuthenticated: boolean;
};

export default function ExploreHeader({ isAuthenticated }: Props) {
  return (
    <SiteHeader
      brandHref="/"
      sticky
      publicTripsActive
      showPublicTripsOnMobile
      actions={
        isAuthenticated ? (
          <Link
            href="/dashboard"
            className="rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-600 sm:px-4 sm:text-sm"
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
        )
      }
    />
  );
}
