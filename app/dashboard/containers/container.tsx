import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { DASHBOARD_TRIP_SELECT } from "../types";
import DashboardPresentation from "./presentation";

export default async function DashboardContainer() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userData }, { data: memberRows }] = await Promise.all([
    supabase.from("users").select("name").eq("id", user.id).single(),
    supabase.from("trip_members").select("trip_id").eq("user_id", user.id),
  ]);

  const memberTripIds = (memberRows ?? []).map((row) => row.trip_id);
  const tripsQuery = supabase
    .from("trips")
    .select(DASHBOARD_TRIP_SELECT)
    .order("start_date", { ascending: false });

  const { data: trips } =
    memberTripIds.length > 0
      ? await tripsQuery.or(
          `user_id.eq.${user.id},id.in.(${memberTripIds.join(",")})`,
        )
      : await tripsQuery.eq("user_id", user.id);

  return (
    <DashboardPresentation
      userId={user.id}
      initialUserName={userData?.name ?? ""}
      initialTrips={trips ?? []}
    />
  );
}
