import Link from "next/link";
import SiteIcon from "@/components/SiteIcon";
import { formatTripDate, type PublicTrip } from "@/lib/explore";
import TripCoverCarousel from "@/components/TripCoverCarousel";

type Props = {
  trip: PublicTrip;
};

export default function ExploreTripCard({ trip }: Props) {
  return (
    <article className="flex h-full flex-col bg-[#fffdf8] rounded-2xl border border-slate-200 overflow-hidden transition-[box-shadow,transform] duration-150 hover:shadow-[0_10px_24px_rgba(24,50,46,0.09)] hover:-translate-y-0.5">
      <TripCoverCarousel
        images={trip.cover_images}
        alt={`${trip.title}の詳細を表示`}
        href={`/explore/${trip.id}`}
      />
      <Link
        href={`/explore/${trip.id}`}
        className="flex flex-1 flex-col no-underline"
      >
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-lg font-bold text-slate-900 mb-1.5 line-clamp-2">
            {trip.title}
          </h2>
          <p className="text-[0.8rem] text-slate-500 mb-3 flex items-start gap-1.5">
            <SiteIcon
              name="pin"
              className="size-3.5 mt-0.5 shrink-0 text-indigo-500"
            />
            <span>
              {trip.destination}・{trip.area}
            </span>
          </p>

          <div className="space-y-2 text-[0.78rem] text-slate-500 mb-4">
            <p className="flex items-center gap-1.5">
              <SiteIcon name="calendar" className="size-3.5 text-slate-400" />
              <span>
                {formatTripDate(trip.start_date)} 〜 {formatTripDate(trip.end_date)}
              </span>
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 min-w-0">
                <SiteIcon name="user" className="size-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{trip.author_name}</span>
              </p>
              <p className="flex shrink-0 items-center gap-1 rounded-[6px] bg-slate-100 px-2 py-0.5">
                <SiteIcon name="users" className="size-3.5" />
                {trip.participant_count}人
              </p>
            </div>
          </div>

          {(trip.travel_style || trip.themes.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {trip.travel_style && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[0.7rem] font-semibold text-indigo-600">
                  {trip.travel_style}
                </span>
              )}
              {trip.themes.map((theme) => (
                <span
                  key={theme}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-medium text-slate-600"
                >
                  {theme}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto border-t border-slate-100 pt-3.5 flex justify-between items-baseline">
            <span className="text-[0.75rem] text-slate-400">合計予算</span>
            <span className="text-xl font-bold text-slate-900">
              ¥{trip.total_cost.toLocaleString("ja-JP")}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
