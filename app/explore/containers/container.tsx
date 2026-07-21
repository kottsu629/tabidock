import {
  hasActiveExploreFilters,
  normalizePublicTrips,
  type ExploreFilters,
} from "@/lib/explore";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import ExplorePresentation from "./presentation";

type Props = {
  filters: ExploreFilters;
};

export default async function ExploreContainer({ filters }: Props) {
  const supabase = await createSupabaseServerClient();
  const [{ data: authData }, { data, error }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.rpc("get_public_trips", {
      p_min_budget: filters.minBudget,
      p_max_budget: filters.maxBudget,
      p_num_people: filters.numPeople,
      p_theme: filters.theme || null,
      p_travel_style: filters.travelStyle || null,
    }),
  ]);

  if (error) {
    console.error("Failed to load public trips", error);
    throw new Error("公開旅行の読み込みに失敗しました");
  }

  const trips = normalizePublicTrips((data ?? []) as Parameters<
    typeof normalizePublicTrips
  >[0]);

  return (
    <ExplorePresentation
      isAuthenticated={Boolean(authData.user)}
      filters={filters}
      hasActiveFilters={hasActiveExploreFilters(filters)}
      trips={trips}
    />
  );
}
