"use client";

import { useEffect, useState } from "react";
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
  user_id: string;
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

type Member = {
  id: string;
  user_id: string;
  users: { name: string; email: string | null } | null;
};

type Props = {
  tripId: string;
  userId: string;
  initialUserName: string;
  initialTrip: Trip;
  initialParticipants: Participant[];
  initialExpenses: Expense[];
  initialMembers: Member[];
};

export default function TripDetailContainer({
  tripId,
  userId,
  initialUserName,
  initialTrip,
  initialParticipants,
  initialExpenses,
  initialMembers,
}: Props) {
  const router = useRouter();
  const [userName] = useState(initialUserName);
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [shareError, setShareError] = useState("");

  const isOwner = trip.user_id === userId;

  const refresh = async () => {
    const [{ data: tripData }, { data: expensesData }, { data: participantsData }, { data: membersData }] =
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
        supabase
          .from("trip_members")
          .select("*, users(name, email)")
          .eq("trip_id", tripId)
          .order("created_at"),
      ]);
    if (tripData) setTrip(tripData);
    setExpenses(expensesData ?? []);
    setParticipants(participantsData ?? []);
    setMembers(membersData ?? []);
  };

  useEffect(() => {
    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses", filter: `trip_id=eq.${tripId}` },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants", filter: `trip_id=eq.${tripId}` },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips", filter: `id=eq.${tripId}` },
        refresh,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trip_members", filter: `trip_id=eq.${tripId}` },
        refresh,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleDeleteExpense = async (expenseId: string) => {
    await supabase.from("expenses").delete().eq("id", expenseId);
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleShare = async (email: string) => {
    setShareError("");
    const { data: targetUser, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (lookupError) {
      setShareError(lookupError.message);
      return;
    }
    if (!targetUser) {
      setShareError("このメールアドレスのユーザーが見つかりません");
      return;
    }
    if (targetUser.id === userId) {
      setShareError("自分自身は追加できません");
      return;
    }
    const { error: insertError } = await supabase
      .from("trip_members")
      .insert({ trip_id: tripId, user_id: targetUser.id });
    if (insertError) {
      setShareError(
        insertError.code === "23505" ? "すでに共有されています" : insertError.message,
      );
      return;
    }
    await refresh();
  };

  const handleRemoveMember = async (memberId: string) => {
    await supabase.from("trip_members").delete().eq("id", memberId);
    await refresh();
  };

  return (
    <TripDetailPresentation
      tripId={tripId}
      userName={userName}
      trip={trip}
      participants={participants}
      expenses={expenses}
      members={members}
      isOwner={isOwner}
      shareError={shareError}
      onLogout={handleLogout}
      onExpenseAdded={refresh}
      onDeleteExpense={handleDeleteExpense}
      onShare={handleShare}
      onRemoveMember={handleRemoveMember}
    />
  );
}
