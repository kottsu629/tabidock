import { notFound } from "next/navigation";
import { normalizePublicTrips } from "@/lib/explore";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ExploreTripDetailPresentation from "./presentation";

type Props = {
  tripId: string;
};

export default async function ExploreTripDetailContainer({ tripId }: Props) {
  const supabase = await createSupabaseServerClient();
  const [{ data: authData }, { data, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("get_public_trip", { p_trip_id: tripId }),
  ]);

  if (error) {
    console.error("Failed to load public trip", error);
    throw new Error("公開旅行の読み込みに失敗しました");
  }

  const trips = normalizePublicTrips((data ?? []) as Parameters<
    typeof normalizePublicTrips
  >[0]);
  const trip = trips[0];
  if (!trip) notFound();

  return (
    <ExploreTripDetailPresentation
      isAuthenticated={Boolean(authData.user)}
      trip={trip}
    />
  );
}
