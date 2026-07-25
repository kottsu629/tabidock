import {
  normalizeCoverImageFit,
  normalizeTripCoverImages,
  type TripCoverImage,
} from "./trip-cover";
import type { Database } from "@/types/database";

export { getSafeCoverImageUrl } from "./trip-cover";

type PublicTripRow =
  Database["public"]["Functions"]["get_public_trips"]["Returns"][number];

export type PublicTrip = Omit<
  PublicTripRow,
  | "cover_image_url"
  | "cover_image_fit"
  | "cover_images"
  | "travel_style"
> & {
  cover_image_url: string | null;
  cover_image_fit: "cover" | "contain";
  cover_images: TripCoverImage[];
  travel_style: string | null;
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
    const coverImageFit = normalizeCoverImageFit(row.cover_image_fit);

    return {
      ...row,
      cover_image_url: row.cover_image_url ?? null,
      cover_image_fit: coverImageFit,
      travel_style: row.travel_style ?? null,
      cover_images: normalizeTripCoverImages(row.cover_images, {
        image_url: row.cover_image_url ?? "",
        cover_image_fit: coverImageFit,
        cover_image_zoom: row.cover_image_zoom,
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
