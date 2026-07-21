import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import brandIcon from "@/app/icon.png";

type Props = {
  brandHref: string;
  actions?: ReactNode;
  publicTripsActive?: boolean;
  showPublicTripsOnMobile?: boolean;
  sticky?: boolean;
  maxWidthClassName?: string;
};

export default function SiteHeader({
  brandHref,
  actions,
  publicTripsActive = false,
  showPublicTripsOnMobile = false,
  sticky = false,
  maxWidthClassName = "max-w-[1200px]",
}: Props) {
  const mobileVisibility = showPublicTripsOnMobile
    ? "flex"
    : "hidden sm:flex";

  return (
    <header
      className={`${
        sticky
          ? "sticky top-0 z-50 bg-[#fffdf8]/95 backdrop-blur-md"
          : "bg-[#fffdf8]"
      } border-b border-slate-200`}
    >
      <div
        className={`${maxWidthClassName} mx-auto flex h-[60px] items-center justify-between px-4 sm:px-6`}
      >
        <div className="flex min-w-0 items-center">
          <Link
            href={brandHref}
            className="flex shrink-0 items-center gap-2 no-underline"
          >
            <Image
              src={brandIcon}
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-[1.05rem] font-bold tracking-[-0.02em] text-slate-900 sm:text-[1.1rem]">
              TabiDock
            </span>
          </Link>

          <span
            aria-hidden="true"
            className={`${
              showPublicTripsOnMobile ? "mx-3 sm:mx-5" : "mx-5 hidden sm:block"
            } h-5 w-px shrink-0 bg-slate-200`}
          />

          <nav
            aria-label="メインナビゲーション"
            className={mobileVisibility}
          >
            <Link
              href="/explore"
              aria-current={publicTripsActive ? "page" : undefined}
              className={`inline-flex whitespace-nowrap rounded-lg px-2.5 py-2 text-xs no-underline transition-colors sm:px-3 sm:text-sm ${
                publicTripsActive
                  ? "bg-indigo-50 font-semibold text-indigo-600"
                  : "font-medium text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              みんなの旅
            </Link>
          </nav>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
