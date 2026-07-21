import type { Metadata } from "next";
import {
  parseExploreFilters,
  type ExploreSearchParams,
} from "@/lib/explore";
import ExploreContainer from "./containers/container";

export const metadata: Metadata = {
  title: "みんなの公開旅行を探す",
  description:
    "TabiDock（タビドック）で公開されている旅行を探して、次の旅のアイデアを見つけましょう。",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/explore",
    siteName: "TabiDock（タビドック）",
    title: "みんなの公開旅行を探す｜TabiDock（タビドック）",
    description:
      "公開されている旅行から、行き先・日程・予算・テーマを参考に次の旅を探せます。",
  },
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>;
}) {
  const filters = parseExploreFilters(await searchParams);
  return <ExploreContainer filters={filters} />;
}
