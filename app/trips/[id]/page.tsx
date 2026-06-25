import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import TripDetailContainer from "./container";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userData }, { data: trip }, { data: participants }, { data: expenses }] =
    await Promise.all([
      supabase.from("users").select("name").eq("id", user.id).single(),
      supabase.from("trips").select("*").eq("id", id).single(),
      supabase
        .from("participants")
        .select("*")
        .eq("trip_id", id)
        .order("created_at"),
      supabase.from("expenses").select("*").eq("trip_id", id).order("category"),
    ]);

  if (!trip) redirect("/dashboard");

  return (
    <TripDetailContainer
      tripId={id}
      initialUserName={userData?.name ?? ""}
      initialTrip={trip}
      initialParticipants={participants ?? []}
      initialExpenses={expenses ?? []}
    />
  );
}
