import Link from "next/link";
import SiteIcon from "@/components/SiteIcon";

type Trip = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
  cover_image_url: string | null;
  cover_image_fit: "cover" | "contain";
  cover_image_zoom: number;
  cover_image_position_x: number;
  cover_image_position_y: number;
  cover_images: unknown;
  participants: { count: number }[];
};

type Props = {
  trip: Trip;
  userId: string;
  onDelete: (trip: Trip) => void;
};

export default function TripCard({ trip, userId, onDelete }: Props) {
  const isOwner = trip.user_id === userId;

  return (
    <div className="bg-[#fffdf8] rounded-2xl border border-slate-200 overflow-hidden transition-[box-shadow,transform] duration-150 hover:shadow-[0_10px_24px_rgba(24,50,46,0.09)] hover:-translate-y-0.5">
      <Link href={`/trips/${trip.id}`} className="no-underline block">
        <div className="h-1 bg-indigo-500" />
        <div className="p-5">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
            <span>{trip.title}</span>
            <span
              className={`shrink-0 text-[0.65rem] font-semibold rounded-[6px] px-1.5 py-0.5 ${
                trip.is_public
                  ? "text-indigo-600 bg-indigo-50"
                  : "text-slate-500 bg-slate-100"
              }`}
            >
              {trip.is_public ? "公開" : "非公開"}
            </span>
            {!isOwner && (
              <span className="shrink-0 text-[0.65rem] font-semibold text-violet-600 bg-orange-50 rounded-[6px] px-1.5 py-0.5">
                共有中
              </span>
            )}
          </h2>
          <p className="text-[0.8rem] text-slate-500 mb-3 flex items-center gap-1.5">
            <SiteIcon name="pin" className="size-3.5 text-indigo-500" />
            {trip.destination}・{trip.area}
          </p>
          <div className="flex items-center gap-1.5 text-[0.78rem] text-slate-400 mb-4">
            <SiteIcon name="calendar" className="size-3.5" />
            <span>
              {trip.start_date} 〜 {trip.end_date}
            </span>
            <span className="ml-auto bg-slate-100 rounded-[6px] px-2 py-0.5 text-slate-500">
              <span className="inline-flex items-center gap-1">
                <SiteIcon name="users" className="size-3.5" />
                {trip.participants[0]?.count ?? 0}人
              </span>
            </span>
          </div>
          <div className="border-t border-slate-100 pt-[14px] flex justify-between items-baseline">
            <span className="text-[0.75rem] text-slate-400">合計金額</span>
            <span className="text-xl font-bold text-slate-900">
              ¥{trip.total_cost.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
      {isOwner && (
        <div className="px-5 pb-4 flex justify-end">
          <button
            onClick={() => onDelete(trip)}
            className="text-xs text-slate-400 border-none bg-transparent cursor-pointer px-2 py-1 rounded-[6px] hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="inline-flex items-center gap-1">
              <SiteIcon name="trash" className="size-3.5" /> 削除
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
