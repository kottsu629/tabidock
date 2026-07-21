import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import TripDetailPresentation from "./presentation";

type Props = {
  tripId: string;
};

export default async function TripDetailContainer({ tripId }: Props) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: userData },
    { data: trip },
    { data: participants },
    { data: expenses },
    { data: members },
  ] = await Promise.all([
    supabase.from("users").select("name").eq("id", user.id).single(),
    supabase.from("trips").select("*").eq("id", tripId).single(),
    supabase
      .from("participants")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at"),
    supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId)
      .order("category"),
    supabase
      .from("trip_members")
      .select("*, users(name, email)")
      .eq("trip_id", tripId)
      .order("created_at"),
  ]);

  if (!trip) redirect("/dashboard");

  return (
    <TripDetailPresentation
      tripId={tripId}
      userId={user.id}
      initialUserName={userData?.name ?? ""}
      initialTrip={trip}
      initialParticipants={participants ?? []}
      initialExpenses={expenses ?? []}
      initialMembers={members ?? []}
    />
  );
}
