"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TripDetailPresentation from "./presentation";

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
  initialUserName: string;
  initialTrip: Trip;
  initialParticipants: Participant[];
  initialExpenses: Expense[];
};

export default function TripDetailContainer({
  tripId,
  initialUserName,
  initialTrip,
  initialParticipants,
  initialExpenses,
}: Props) {
  const router = useRouter();
  const [userName] = useState(initialUserName);
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  const refresh = async () => {
    const [{ data: tripData }, { data: expensesData }, { data: participantsData }] =
      await Promise.all([
        supabase.from("trips").select("*").eq("id", tripId).single(),
        supabase
          .from("expenses")
          .select("*")
          .eq("trip_id", tripId)
          .order("category"),
        supabase
          .from("participants")
          .select("*")
          .eq("trip_id", tripId)
          .order("created_at"),
      ]);
    if (tripData) setTrip(tripData);
    setExpenses(expensesData ?? []);
    setParticipants(participantsData ?? []);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await supabase.from("expenses").delete().eq("id", expenseId);
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <TripDetailPresentation
      tripId={tripId}
      userName={userName}
      trip={trip}
      participants={participants}
      expenses={expenses}
      onLogout={handleLogout}
      onExpenseAdded={refresh}
      onDeleteExpense={handleDeleteExpense}
    />
  );
}
