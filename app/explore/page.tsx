import type { Metadata } from "next";
import ExploreFilters from "@/components/ExploreFilters";
import ExploreHeader from "@/components/ExploreHeader";
import ExploreTripCard from "@/components/ExploreTripCard";
import SiteIcon from "@/components/SiteIcon";
import {
  hasActiveExploreFilters,
  normalizePublicTrips,
  parseExploreFilters,
  type ExploreSearchParams,
  type PublicTrip,
} from "@/lib/explore";
import { createSupabaseServerClient } from "@/lib/supabase-server";

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
  const hasActiveFilters = hasActiveExploreFilters(filters);
  const supabase = await createSupabaseServerClient();

  const [{ data: authData }, { data, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("get_public_trips", {
      p_min_budget: filters.minBudget,
      p_max_budget: filters.maxBudget,
      p_num_people: filters.numPeople,
      p_theme: filters.theme || null,
      p_travel_style: filters.travelStyle || null,
    }),
  ]);

  if (error) {
    console.error("Failed to load public trips", error);
    throw new Error("公開旅行の読み込みに失敗しました");
  }

  const trips = normalizePublicTrips((data ?? []) as Parameters<
    typeof normalizePublicTrips
  >[0]);

  return (
    <div className="min-h-screen bg-slate-50">
      <ExploreHeader isAuthenticated={Boolean(authData.user)} />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section aria-labelledby="explore-page-title" className="mb-7">
          <p className="text-[0.75rem] font-bold text-indigo-500 tracking-[0.16em] uppercase mb-2">
            Explore
          </p>
          <h1
            id="explore-page-title"
            className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
          >
            みんなの旅行を探す
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-2">
            公開されている旅行から、次の旅のアイデアを見つけましょう。
          </p>
        </section>

        <ExploreFilters
          filters={filters}
          hasActiveFilters={hasActiveFilters}
        />

        {trips.length === 0 ? (
          <EmptyState hasActiveFilters={hasActiveFilters} />
        ) : (
          <section aria-labelledby="explore-results-heading">
            <div className="flex items-center justify-between mb-4">
              <h2
                id="explore-results-heading"
                className="text-sm font-normal text-slate-500"
              >
                {trips.length}件の公開旅行
              </h2>
              <p className="text-xs font-medium text-slate-400">新着順</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {trips.map((trip: PublicTrip) => (
                <ExploreTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function EmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  return (
    <section
      aria-labelledby="explore-empty-heading"
      className="text-center py-16 sm:py-20 px-5 bg-[#fffdf8] rounded-2xl border border-slate-200"
    >
      <SiteIcon name="globe" className="size-10 mx-auto mb-4 text-indigo-500" />
      {hasActiveFilters ? (
        <>
          <h2
            id="explore-empty-heading"
            className="text-base text-slate-700 font-semibold mb-1.5"
          >
            条件に合う旅行が見つかりませんでした。
          </h2>
          <p className="text-sm text-slate-400">
            条件を変更して、もう一度探してみてください。
          </p>
        </>
      ) : (
        <>
          <h2
            id="explore-empty-heading"
            className="text-base text-slate-700 font-semibold mb-1.5"
          >
            まだ公開されている旅行がありません。
          </h2>
          <p className="text-sm text-slate-400">
            あなたの旅行を最初に公開してみませんか？
          </p>
        </>
      )}
    </section>
  );
}
