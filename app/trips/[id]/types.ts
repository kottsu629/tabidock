import {
  normalizeCoverImageFit,
  normalizeTripCoverImages,
  type TripCoverImage,
} from "@/lib/trip-cover";
import type { Json, Tables } from "@/types/database";

export const TRIP_DETAIL_SELECT =
  "id, title, destination, area, start_date, end_date, total_cost, is_public, user_id, cover_image_url, cover_image_fit, cover_image_zoom, cover_image_position_x, cover_image_position_y, cover_images, travel_style, themes" as const;
export const TRIP_PARTICIPANT_SELECT = "id, trip_id, name" as const;
export const TRIP_EXPENSE_SELECT =
  "id, category, title, amount, participant_id" as const;
export const TRIP_MEMBER_SELECT =
  "id, user_id, users(name, email)" as const;

type TripDetailBase = Pick<
  Tables<"trips">,
  | "id"
  | "title"
  | "destination"
  | "area"
  | "start_date"
  | "end_date"
  | "total_cost"
  | "is_public"
  | "user_id"
  | "cover_image_url"
  | "cover_image_zoom"
  | "cover_image_position_x"
  | "cover_image_position_y"
  | "travel_style"
  | "themes"
>;

export type TripDetailRow = TripDetailBase & {
  cover_image_fit: string;
  cover_images: Json;
};

export type TripDetailTrip = TripDetailBase & {
  cover_image_fit: "cover" | "contain";
  cover_images: TripCoverImage[];
};

export type TripParticipant = Pick<
  Tables<"participants">,
  "id" | "trip_id" | "name"
>;

export type TripExpense = Pick<
  Tables<"expenses">,
  "id" | "category" | "title" | "amount" | "participant_id"
>;

export type TripMember = Pick<
  Tables<"trip_members">,
  "id" | "user_id"
> & {
  users: Pick<Tables<"users">, "name" | "email"> | null;
};

export function normalizeTripDetail(row: TripDetailRow): TripDetailTrip {
  const coverImageFit = normalizeCoverImageFit(row.cover_image_fit);

  return {
    ...row,
    cover_image_fit: coverImageFit,
    cover_images: normalizeTripCoverImages(row.cover_images, {
      image_url: row.cover_image_url ?? "",
      cover_image_fit: coverImageFit,
      cover_image_zoom: row.cover_image_zoom,
      cover_image_position_x: row.cover_image_position_x,
      cover_image_position_y: row.cover_image_position_y,
    }),
  };
}
