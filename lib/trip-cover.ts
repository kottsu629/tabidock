import type { CSSProperties } from "react";

export const TRIP_COVER_BUCKET = "trip-covers";
export const MAX_COVER_FILE_SIZE = 5 * 1024 * 1024;
export const COVER_FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type CoverImageDisplaySettings = {
  cover_image_fit: "cover" | "contain";
  cover_image_zoom: number;
  cover_image_position_x: number;
  cover_image_position_y: number;
};

export type TripCoverImage = CoverImageDisplaySettings & {
  image_url: string;
};

export const DEFAULT_COVER_IMAGE_DISPLAY: CoverImageDisplaySettings = {
  cover_image_fit: "cover",
  cover_image_zoom: 1,
  cover_image_position_x: 50,
  cover_image_position_y: 50,
};

export const MAX_TRIP_COVER_IMAGES = 5;

export function getSafeCoverImageUrl(url: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:"
      ? parsedUrl.toString()
      : null;
  } catch {
    return null;
  }
}

export function normalizeTripCoverImages(
  value: unknown,
  fallback?: TripCoverImage | null,
): TripCoverImage[] {
  const images = Array.isArray(value)
    ? value.flatMap((item): TripCoverImage[] => {
        if (!item || typeof item !== "object") return [];

        const candidate = item as Record<string, unknown>;
        const imageUrl = getSafeCoverImageUrl(
          typeof candidate.image_url === "string"
            ? candidate.image_url
            : null,
        );
        if (!imageUrl) return [];

        const fit = candidate.cover_image_fit;
        const zoom = Number(candidate.cover_image_zoom);
        const positionX = Number(candidate.cover_image_position_x);
        const positionY = Number(candidate.cover_image_position_y);

        return [
          {
            image_url: imageUrl,
            cover_image_fit: fit === "contain" ? "contain" : "cover",
            cover_image_zoom: Number.isFinite(zoom)
              ? Math.min(2, Math.max(1, zoom))
              : DEFAULT_COVER_IMAGE_DISPLAY.cover_image_zoom,
            cover_image_position_x: Number.isFinite(positionX)
              ? Math.round(Math.min(100, Math.max(0, positionX)))
              : DEFAULT_COVER_IMAGE_DISPLAY.cover_image_position_x,
            cover_image_position_y: Number.isFinite(positionY)
              ? Math.round(Math.min(100, Math.max(0, positionY)))
              : DEFAULT_COVER_IMAGE_DISPLAY.cover_image_position_y,
          },
        ];
      })
    : [];

  if (images.length > 0) return images.slice(0, MAX_TRIP_COVER_IMAGES);

  const fallbackUrl = getSafeCoverImageUrl(fallback?.image_url ?? null);
  return fallbackUrl && fallback
    ? [{ ...fallback, image_url: fallbackUrl }]
    : [];
}

export function getCoverImageStyle({
  cover_image_fit,
  cover_image_zoom,
  cover_image_position_x,
  cover_image_position_y,
}: CoverImageDisplaySettings): CSSProperties {
  const showWholeImage = cover_image_fit === "contain";
  const zoom = showWholeImage
    ? DEFAULT_COVER_IMAGE_DISPLAY.cover_image_zoom
    : Math.min(2, Math.max(1, cover_image_zoom));
  const positionX = showWholeImage
    ? DEFAULT_COVER_IMAGE_DISPLAY.cover_image_position_x
    : Math.min(100, Math.max(0, cover_image_position_x));
  const positionY = showWholeImage
    ? DEFAULT_COVER_IMAGE_DISPLAY.cover_image_position_y
    : Math.min(100, Math.max(0, cover_image_position_y));

  return {
    objectFit: cover_image_fit,
    objectPosition: `${positionX}% ${positionY}%`,
    transform: `scale(${zoom})`,
    transformOrigin: `${positionX}% ${positionY}%`,
  };
}

export function getOwnedTripCoverStoragePath(
  coverImageUrl: string | null,
  userId: string,
  tripId: string,
) {
  const safeUrl = getSafeCoverImageUrl(coverImageUrl);
  if (!safeUrl) return null;

  try {
    const pathMarker = `/storage/v1/object/public/${TRIP_COVER_BUCKET}/`;
    const pathname = new URL(safeUrl).pathname;
    const markerIndex = pathname.indexOf(pathMarker);
    if (markerIndex === -1) return null;

    const storagePath = decodeURIComponent(
      pathname.slice(markerIndex + pathMarker.length),
    );
    return storagePath.startsWith(`${userId}/${tripId}/`)
      ? storagePath
      : null;
  } catch {
    return null;
  }
}
