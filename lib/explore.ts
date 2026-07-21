import {
  normalizeTripCoverImages,
  type TripCoverImage,
} from "./trip-cover";

export { getSafeCoverImageUrl } from "./trip-cover";

export type PublicTrip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  cover_image_url: string | null;
  cover_image_fit: "cover" | "contain";
  cover_image_zoom: number;
  cover_image_position_x: number;
  cover_image_position_y: number;
  cover_images: TripCoverImage[];
  travel_style: string | null;
  themes: string[];
  participant_count: number;
  author_name: string;
};

export type ExploreTripSettings = Pick<
  PublicTrip,
  | "cover_image_url"
  | "cover_image_fit"
  | "cover_image_zoom"
  | "cover_image_position_x"
  | "cover_image_position_y"
  | "cover_images"
  | "travel_style"
  | "themes"
> & {
  is_public: boolean;
};

type PublicTripRow = Omit<
  PublicTrip,
  "participant_count" | "themes" | "cover_image_zoom" | "cover_images"
> & {
  participant_count: number | string;
  themes: string[] | null;
  cover_image_zoom: number | string;
  cover_images: unknown;
};

export type ExploreFilters = {
  minBudget: number | null;
  maxBudget: number | null;
  numPeople: number | null;
  theme: string;
  travelStyle: string;
};

export type ExploreSearchParams = Record<
  string,
  string | string[] | undefined
>;

const getSingleValue = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

const parsePositiveInteger = (
  value: string | string[] | undefined,
  allowZero: boolean,
) => {
  const rawValue = getSingleValue(value);
  if (!/^\d+$/.test(rawValue)) return null;

  const parsedValue = Number(rawValue);
  const minimum = allowZero ? 0 : 1;
  return Number.isSafeInteger(parsedValue) && parsedValue >= minimum
    ? parsedValue
    : null;
};

export function parseExploreFilters(
  searchParams: ExploreSearchParams,
): ExploreFilters {
  return {
    minBudget: parsePositiveInteger(searchParams.min_budget, true),
    maxBudget: parsePositiveInteger(searchParams.max_budget, true),
    numPeople: parsePositiveInteger(searchParams.num_people, false),
    theme: getSingleValue(searchParams.theme),
    travelStyle: getSingleValue(searchParams.travel_style),
  };
}

export function hasActiveExploreFilters(filters: ExploreFilters) {
  return (
    filters.minBudget !== null ||
    filters.maxBudget !== null ||
    filters.numPeople !== null ||
    filters.theme !== "" ||
    filters.travelStyle !== ""
  );
}

export function normalizePublicTrips(rows: PublicTripRow[]): PublicTrip[] {
  return rows.map((row) => {
    const coverImageZoom = Number(row.cover_image_zoom);

    return {
      ...row,
      themes: row.themes ?? [],
      participant_count: Number(row.participant_count),
      cover_image_zoom: coverImageZoom,
      cover_images: normalizeTripCoverImages(row.cover_images, {
        image_url: row.cover_image_url ?? "",
        cover_image_fit: row.cover_image_fit,
        cover_image_zoom: coverImageZoom,
        cover_image_position_x: row.cover_image_position_x,
        cover_image_position_y: row.cover_image_position_y,
      }),
    };
  });
}

export function formatTripDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  return `${year}年${month}月${day}日`;
}
