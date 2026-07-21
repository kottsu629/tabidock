import type { Metadata } from "next";
import {
  parseExploreFilters,
  type ExploreSearchParams,
} from "@/lib/explore";
import ExploreContainer from "./containers/container";

export const metadata: Metadata = {
  title: "Explore | TabiDock",
  description: "TabiDockで公開されている旅行を探して、旅のアイデアを見つけよう。",
};

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<ExploreSearchParams>;
}) {
  const filters = parseExploreFilters(await searchParams);
  return <ExploreContainer filters={filters} />;
}
