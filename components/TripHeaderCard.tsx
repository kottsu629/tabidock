type Trip = {
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
};

type Expense = {
  amount: number;
  participant_id: string | null;
};

type Props = {
  trip: Trip;
  participants: Participant[];
  expenses: Expense[];
};

export default function TripHeaderCard({ trip, participants, expenses }: Props) {
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
          {trip.title}
        </h1>
        <p className="text-sm text-slate-500 mb-5">
          📍 {trip.destination}（{trip.area}）　📅 {trip.start_date} 〜{" "}
          {trip.end_date}　👥 {participants.length}人
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

        {totals.length > 0 && (
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
