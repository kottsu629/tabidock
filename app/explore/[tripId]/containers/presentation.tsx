import Link from "next/link";
import ExploreHeader from "@/components/ExploreHeader";
import SiteIcon from "@/components/SiteIcon";
import TripCoverCarousel from "@/components/TripCoverCarousel";
import { formatTripDate, type PublicTrip } from "@/lib/explore";
import ExploreTripDetailItem from "../components/ExploreTripDetailItem";

type Props = {
  isAuthenticated: boolean;
  trip: PublicTrip;
};

export default function ExploreTripDetailPresentation({
  isAuthenticated,
  trip,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <ExploreHeader isAuthenticated={isAuthenticated} />

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-7 sm:py-9">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 no-underline mb-5 hover:text-indigo-600 transition-colors"
        >
          ← 公開旅行一覧へ戻る
        </Link>

        <article className="bg-[#fffdf8] rounded-2xl border border-slate-200 overflow-hidden">
          <TripCoverCarousel
            images={trip.cover_images}
            alt={`${trip.title}の写真`}
            eager
          />

          <div className="p-5 sm:p-8">
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {trip.title}
                </h1>
                <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                  <SiteIcon name="user" className="size-4 text-slate-400" />
                  {trip.author_name}
                </p>
              </div>
              {(trip.travel_style || trip.themes.length > 0) && (
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  {trip.travel_style && (
                    <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                      {trip.travel_style}
                    </span>
                  )}
                  {trip.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <section aria-labelledby="trip-details-heading">
              <h2 id="trip-details-heading" className="sr-only">
                旅行情報
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <ExploreTripDetailItem icon="pin" label="行き先">
                  {trip.destination}・{trip.area}
                </ExploreTripDetailItem>
                <ExploreTripDetailItem icon="calendar" label="日程">
                  {formatTripDate(trip.start_date)} 〜{" "}
                  {formatTripDate(trip.end_date)}
                </ExploreTripDetailItem>
                <ExploreTripDetailItem icon="wallet" label="合計予算">
                  ¥{trip.total_cost.toLocaleString("ja-JP")}
                </ExploreTripDetailItem>
                <ExploreTripDetailItem icon="users" label="人数">
                  {trip.participant_count}人
                </ExploreTripDetailItem>
              </dl>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
