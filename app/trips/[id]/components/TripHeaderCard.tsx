import SiteIcon from "@/components/SiteIcon";
import type {
  TripDetailTrip,
  TripExpense,
  TripParticipant,
} from "../types";

type Props = {
  trip: TripDetailTrip;
  participants: TripParticipant[];
  expenses: TripExpense[];
};

export default function TripHeaderCard({
  trip,
  participants,
  expenses,
}: Props) {
  const sharedTotal = expenses
    .filter((e) => e.participant_id === null)
    .reduce((s, e) => s + e.amount, 0);
  const perShare = participants.length ? sharedTotal / participants.length : 0;

  const totals = participants.map((p) => {
    const own = expenses
      .filter((e) => e.participant_id === p.id)
      .reduce((s, e) => s + e.amount, 0);
    return { ...p, total: own + perShare };
  });

  return (
    <div className="bg-[#fffdf8] rounded-2xl border border-slate-200 overflow-hidden mb-5">
      <div className="h-1.5 bg-indigo-500" />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
          {trip.title}
        </h1>
        <p className="text-sm text-slate-500 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5"><SiteIcon name="pin" className="size-4 text-indigo-500" />{trip.destination}（{trip.area}）</span>
          <span className="inline-flex items-center gap-1.5"><SiteIcon name="calendar" className="size-4" />{trip.start_date} 〜 {trip.end_date}</span>
          <span className="inline-flex items-center gap-1.5"><SiteIcon name="users" className="size-4" />{participants.length}人</span>
        </p>

        <div className="flex gap-4 flex-wrap mb-4">
          <div className="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-[0.75rem] text-slate-400 mb-1 font-semibold uppercase tracking-[0.05em]">
              合計金額
            </p>
            <p className="text-[1.75rem] font-bold text-slate-900">
              ¥{trip.total_cost.toLocaleString()}
            </p>
          </div>
        </div>

        {totals.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            {totals.map((p) => (
              <div
                key={p.id}
                className="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-4 border border-slate-200"
              >
                <p className="text-[0.75rem] text-slate-400 mb-1 font-semibold uppercase tracking-[0.05em]">
                  {p.name}
                </p>
                <p className="text-[1.3rem] font-bold text-indigo-500">
                  ¥{Math.round(p.total).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
