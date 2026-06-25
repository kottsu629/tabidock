import { CATEGORIES, CATEGORY_META, ExpenseCategory } from "@/lib/categories";

type Expense = {
  id: string;
  category: string;
  title: string;
  amount: number;
  participant_id: string | null;
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
};

type Props = {
  expenses: Expense[];
  participants: Participant[];
  onDelete: (id: string) => void;
};

export default function ExpenseList({ expenses, participants, onDelete }: Props) {
  const grouped = CATEGORIES.reduce<Record<string, Expense[]>>((acc, cat) => {
    acc[cat] = expenses.filter((e) => e.category === cat);
    return acc;
  }, {});

  const participantName = (id: string | null) =>
    id ? participants.find((p) => p.id === id)?.name ?? "?" : "共有";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-[0.9rem] font-bold text-slate-900 m-0">
          費用一覧
          <span className="ml-2 text-[0.8rem] text-slate-400 font-normal">
            {expenses.length}件
          </span>
        </h2>
      </div>

      {expenses.length === 0 ? (
        <div className="py-12 px-6 text-center">
          <div className="text-[2rem] mb-3">💰</div>
          <p className="text-slate-400 text-sm">費用がまだ登録されていません</p>
        </div>
      ) : (
        <div>
          {CATEGORIES.filter((cat) => grouped[cat].length > 0).map(
            (cat, i) => (
              <div key={cat}>
                <div
                  className={`px-6 py-2 bg-slate-50 flex items-center gap-2 ${i > 0 ? "border-t border-slate-200" : ""}`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_META[cat as ExpenseCategory].color }}
                  />
                  <span className="text-[0.78rem] font-semibold text-slate-500">
                    {CATEGORY_META[cat as ExpenseCategory].emoji} {cat}
                  </span>
                  <span className="ml-auto text-[0.78rem] font-semibold text-slate-500">
                    ¥{grouped[cat].reduce((s, e) => s + e.amount, 0).toLocaleString()}
                  </span>
                </div>

                {grouped[cat].map((exp) => (
                  <div
                    key={exp.id}
                    className="px-6 py-3 flex items-center justify-between border-b border-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{exp.title}</span>
                      <span className="text-[0.7rem] text-slate-400 bg-slate-100 rounded-[6px] px-1.5 py-0.5">
                        {exp.participant_id ? "👤" : "🤝"} {participantName(exp.participant_id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-900">
                        ¥{exp.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onDelete(exp.id)}
                        className="text-xs text-slate-400 border-none bg-transparent cursor-pointer px-2 py-1 rounded-[6px] hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
