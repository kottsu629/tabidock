import type { Tables } from "@/types/database";

export const DASHBOARD_TRIP_SELECT =
  "id, user_id, title, destination, area, start_date, end_date, total_cost, is_public, cover_image_url, cover_image_fit, cover_image_zoom, cover_image_position_x, cover_image_position_y, cover_images, participants(count)" as const;

export type DashboardTrip = Pick<
  Tables<"trips">,
  | "id"
  | "user_id"
  | "title"
  | "destination"
  | "area"
  | "start_date"
  | "end_date"
  | "total_cost"
  | "is_public"
  | "cover_image_url"
  | "cover_image_fit"
  | "cover_image_zoom"
  | "cover_image_position_x"
  | "cover_image_position_y"
  | "cover_images"
> & {
  participants: { count: number }[];
};
