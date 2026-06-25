import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardContainer from "./container";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userData }, { data: trips }] = await Promise.all([
    supabase.from("users").select("name").eq("id", user.id).single(),
    supabase
      .from("trips")
      .select("*, participants(count)")
      .eq("user_id", user.id)
      .order("start_date", { ascending: false }),
  ]);

  return (
    <DashboardContainer
      userId={user.id}
      initialUserName={userData?.name ?? ""}
      initialTrips={trips ?? []}
    />
  );
}
