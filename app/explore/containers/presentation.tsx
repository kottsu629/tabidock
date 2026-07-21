import ExploreHeader from "@/components/ExploreHeader";
import type { ExploreFilters as ExploreFilterValues, PublicTrip } from "@/lib/explore";
import ExploreEmptyState from "../components/ExploreEmptyState";
import ExploreFilters from "../components/ExploreFilters";
import ExploreTripCard from "../components/ExploreTripCard";

type Props = {
  isAuthenticated: boolean;
  filters: ExploreFilterValues;
  hasActiveFilters: boolean;
  trips: PublicTrip[];
};

export default function ExplorePresentation({
  isAuthenticated,
  filters,
  hasActiveFilters,
  trips,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ExploreHeader isAuthenticated={isAuthenticated} />

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
          <ExploreEmptyState hasActiveFilters={hasActiveFilters} />
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
              {trips.map((trip) => (
                <ExploreTripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
