import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import TripHeaderCard from "@/components/TripHeaderCard";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";

type Trip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
};

type Expense = {
  id: string;
  category: string;
  title: string;
  amount: number;
  participant_id: string | null;
};

type Props = {
  tripId: string;
  userName: string;
  trip: Trip;
  participants: Participant[];
  expenses: Expense[];
  onLogout: () => void;
  onExpenseAdded: () => void;
  onDeleteExpense: (expenseId: string) => void;
};

export default function TripDetailPresentation({
  tripId,
  userName,
  trip,
  participants,
  expenses,
  onLogout,
  onExpenseAdded,
  onDeleteExpense,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} onLogout={onLogout} />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 no-underline mb-6"
        >
          ← 旅行一覧へ戻る
        </Link>

        <TripHeaderCard trip={trip} participants={participants} expenses={expenses} />
        <ExpenseForm tripId={tripId} participants={participants} onAdded={onExpenseAdded} />
        <ExpenseList
          expenses={expenses}
          participants={participants}
          onDelete={onDeleteExpense}
        />
      </main>
    </div>
  );
}
