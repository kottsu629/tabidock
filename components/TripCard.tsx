import Link from "next/link";

type Trip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
  participants: { count: number }[];
};

type Props = {
  trip: Trip;
  onDelete: (trip: Trip) => void;
};

export default function TripCard({ trip, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-[box-shadow,transform] duration-150 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5">
      <Link href={`/trips/${trip.id}`} className="no-underline block">
        <div className="h-1 bg-indigo-500" />
        <div className="p-5">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            {trip.title}
          </h2>
          <p className="text-[0.8rem] text-slate-500 mb-3">
            📍 {trip.destination}・{trip.area}
          </p>
          <div className="flex items-center gap-1.5 text-[0.78rem] text-slate-400 mb-4">
            <span>📅</span>
            <span>
              {trip.start_date} 〜 {trip.end_date}
            </span>
            <span className="ml-auto bg-slate-100 rounded-[6px] px-2 py-0.5 text-slate-500">
              👥 {trip.participants[0]?.count ?? 0}人
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
      <div className="px-5 pb-4 flex justify-end">
        <button
          onClick={() => onDelete(trip)}
          className="text-xs text-slate-400 border-none bg-transparent cursor-pointer px-2 py-1 rounded-[6px] hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          🗑 削除
        </button>
      </div>
    </div>
  );
}
