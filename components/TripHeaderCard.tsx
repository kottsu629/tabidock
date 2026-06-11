type Trip = {
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  num_people: number;
  total_cost: number;
};

type Props = {
  trip: Trip;
};

export default function TripHeaderCard({ trip }: Props) {
  const perPerson = Math.round(trip.total_cost / trip.num_people);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-5">
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500" />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
          {trip.title}
        </h1>
        <p className="text-sm text-slate-500 mb-5">
          📍 {trip.destination}（{trip.area}）　📅 {trip.start_date} 〜{" "}
          {trip.end_date}　👥 {trip.num_people}人
        </p>

        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-[0.75rem] text-slate-400 mb-1 font-semibold uppercase tracking-[0.05em]">
              合計金額
            </p>
            <p className="text-[1.75rem] font-bold text-slate-900">
              ¥{trip.total_cost.toLocaleString()}
            </p>
          </div>
          <div className="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-[0.75rem] text-slate-400 mb-1 font-semibold uppercase tracking-[0.05em]">
              1人あたり
            </p>
            <p className="text-[1.75rem] font-bold text-indigo-500">
              ¥{perPerson.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
