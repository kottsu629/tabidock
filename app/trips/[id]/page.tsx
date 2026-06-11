"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
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
  num_people: number;
  total_cost: number;
  is_public: boolean;
};

type Expense = {
  id: string;
  category: string;
  title: string;
  amount: number;
};

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", id)
      .order("category");
    setExpenses(data ?? []);
  };

  const fetchTrip = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();
    return data as Trip | null;
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      if (userData) setUserName(userData.name);

      const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()]);
      if (!tripData) {
        router.push("/dashboard");
        return;
      }
      setTrip(tripData);
      setLoading(false);
    };
    init();
  }, [id]);

  const refresh = async () => {
    const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()]);
    if (tripData) setTrip(tripData);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await supabase.from("expenses").delete().eq("id", expenseId);
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400">読み込み中...</p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 no-underline mb-6"
        >
          ← 旅行一覧へ戻る
        </Link>

        <TripHeaderCard trip={trip} />
        <ExpenseForm tripId={id} onAdded={refresh} />
        <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
      </main>
    </div>
  );
}
