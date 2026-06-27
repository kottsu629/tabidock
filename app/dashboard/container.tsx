"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardPresentation from "./presentation";

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
  participants: { count: number }[];
};

type Props = {
  userId: string;
  initialUserName: string;
  initialTrips: Trip[];
};

export default function DashboardContainer({
  userId,
  initialUserName,
  initialTrips,
}: Props) {
  const router = useRouter();
  const [userName] = useState(initialUserName);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async () => {
    const { data: memberRows } = await supabase
      .from("trip_members")
      .select("trip_id")
      .eq("user_id", userId);
    const memberTripIds = (memberRows ?? []).map((r) => r.trip_id);

    const tripsQuery = supabase
      .from("trips")
      .select("*, participants(count)")
      .order("start_date", { ascending: false });

    const { data } =
      memberTripIds.length > 0
        ? await tripsQuery.or(`user_id.eq.${userId},id.in.(${memberTripIds.join(",")})`)
        : await tripsQuery.eq("user_id", userId);
    if (data) setTrips(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("trips").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await fetchTrips();
  };

  return (
    <DashboardPresentation
      userId={userId}
      userName={userName}
      trips={trips}
      showNewModal={showNewModal}
      deleteTarget={deleteTarget}
      deleting={deleting}
      onLogout={handleLogout}
      onAddClick={() => setShowNewModal(true)}
      onCloseNewModal={() => setShowNewModal(false)}
      onTripCreated={fetchTrips}
      onDeleteClick={setDeleteTarget}
      onCancelDelete={() => setDeleteTarget(null)}
      onConfirmDelete={handleConfirmDelete}
    />
  );
}
