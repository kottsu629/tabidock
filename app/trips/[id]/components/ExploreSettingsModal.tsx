"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  MAX_TRIP_THEMES,
  THEME_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
} from "@/lib/explore-options";
import type { ExploreTripSettings } from "@/lib/explore";
import {
  COVER_FILE_EXTENSIONS,
  DEFAULT_COVER_IMAGE_DISPLAY,
  getCoverImageStyle,
  getOwnedTripCoverStoragePath,
  MAX_COVER_FILE_SIZE,
  MAX_TRIP_COVER_IMAGES,
  normalizeTripCoverImages,
  TRIP_COVER_BUCKET,
  type CoverImageDisplaySettings,
  type TripCoverImage,
} from "@/lib/trip-cover";
import CoverImageEditor from "./CoverImageEditor";
import Modal from "@/components/Modal";
import SiteIcon from "@/components/SiteIcon";

type Props = {
  tripId: string;
  userId: string;
  initialSettings: ExploreTripSettings;
  onClose: () => void;
  onSaved: (settings: ExploreTripSettings) => void;
};

type EditableCoverImage = {
  key: string;
  originalUrl: string | null;
  previewUrl: string;
  file: File | null;
  settings: CoverImageDisplaySettings;
};

export default function ExploreSettingsModal({
  tripId,
  userId,
  initialSettings,
  onClose,
  onSaved,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorSectionRef = useRef<HTMLElement>(null);
  const localObjectUrlsRef = useRef<string[]>([]);
  const [coverImages, setCoverImages] = useState<EditableCoverImage[]>(() =>
    getInitialEditableImages(initialSettings),
  );
  const [selectedImageKey, setSelectedImageKey] = useState(
    () => coverImages[0]?.key ?? "",
  );
  const [revealEditor, setRevealEditor] = useState(false);
  const [travelStyle, setTravelStyle] = useState(
    initialSettings.travel_style ?? "",
  );
  const [themes, setThemes] = useState(initialSettings.themes);
  const [isPublic, setIsPublic] = useState(initialSettings.is_public);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      localObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!revealEditor || !selectedImageKey) return;

    const frameId = window.requestAnimationFrame(() => {
      if (window.matchMedia("(max-width: 639px)").matches) {
        editorSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      setRevealEditor(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [revealEditor, selectedImageKey]);

  const selectedImageIndex = coverImages.findIndex(
    (image) => image.key === selectedImageKey,
  );
  const selectedImage =
    selectedImageIndex >= 0 ? coverImages[selectedImageIndex] : null;
  const travelStyleOptions = Array.from(
    new Set(
      [initialSettings.travel_style, ...TRAVEL_STYLE_OPTIONS].filter(
        (option): option is string => Boolean(option),
      ),
    ),
  );
  const themeOptions = Array.from(
    new Set([...THEME_OPTIONS, ...initialSettings.themes]),
  );

  const handleCoverFilesChange = (fileList: FileList | null) => {
    setError("");
    const files = Array.from(fileList ?? []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (files.length === 0) return;

    if (coverImages.length + files.length > MAX_TRIP_COVER_IMAGES) {
      setError(`写真は最大${MAX_TRIP_COVER_IMAGES}枚まで追加できます。`);
      return;
    }

    const invalidType = files.some((file) => !COVER_FILE_EXTENSIONS[file.type]);
    if (invalidType) {
      setError("JPEG、PNG、WebP形式の写真を選択してください。");
      return;
    }

    const oversizedFile = files.some((file) => file.size > MAX_COVER_FILE_SIZE);
    if (oversizedFile) {
      setError("写真は1枚につき5MB以下にしてください。");
      return;
    }

    const additions = files.map((file): EditableCoverImage => {
      const previewUrl = URL.createObjectURL(file);
      localObjectUrlsRef.current.push(previewUrl);
      return {
        key: crypto.randomUUID(),
        originalUrl: null,
        previewUrl,
        file,
        settings: { ...DEFAULT_COVER_IMAGE_DISPLAY },
      };
    });

    setCoverImages((currentImages) => [...currentImages, ...additions]);
    setSelectedImageKey(additions[0].key);
    setRevealEditor(true);
  };

  const updateSelectedImageSettings = (
    settings: CoverImageDisplaySettings,
  ) => {
    setCoverImages((currentImages) =>
      currentImages.map((image) =>
        image.key === selectedImageKey ? { ...image, settings } : image,
      ),
    );
  };

  const handleRemoveSelectedImage = () => {
    if (!selectedImage) return;

    if (selectedImage.file) {
      URL.revokeObjectURL(selectedImage.previewUrl);
      localObjectUrlsRef.current = localObjectUrlsRef.current.filter(
        (url) => url !== selectedImage.previewUrl,
      );
    }

    const nextImages = coverImages.filter(
      (image) => image.key !== selectedImage.key,
    );
    const nextSelectedImage =
      nextImages[selectedImageIndex] ?? nextImages[selectedImageIndex - 1];
    setCoverImages(nextImages);
    setSelectedImageKey(nextSelectedImage?.key ?? "");
  };

  const handleMakePrimary = () => {
    if (!selectedImage || selectedImageIndex <= 0) return;
    setCoverImages((currentImages) => [
      selectedImage,
      ...currentImages.filter((image) => image.key !== selectedImage.key),
    ]);
  };

  const handleThemeChange = (theme: string) => {
    setError("");
    if (themes.includes(theme)) {
      setThemes((currentThemes) =>
        currentThemes.filter((currentTheme) => currentTheme !== theme),
      );
      return;
    }
    if (themes.length >= MAX_TRIP_THEMES) {
      setError(`テーマは${MAX_TRIP_THEMES}つまで選択できます。`);
      return;
    }
    setThemes((currentThemes) => [...currentThemes, theme]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    const pendingUploads = coverImages.flatMap((image) => {
      if (!image.file) return [];
      const extension = COVER_FILE_EXTENSIONS[image.file.type];
      return [
        {
          image,
          path: `${userId}/${tripId}/${crypto.randomUUID()}.${extension}`,
        },
      ];
    });
    const uploadedPaths: string[] = [];

    try {
      const uploadResults = await Promise.all(
        pendingUploads.map(async ({ image, path }) => {
          const { error: uploadError } = await supabase.storage
            .from(TRIP_COVER_BUCKET)
            .upload(path, image.file!, {
              cacheControl: "3600",
              contentType: image.file!.type,
              upsert: false,
            });
          if (!uploadError) uploadedPaths.push(path);
          return { imageKey: image.key, path, uploadError };
        }),
      );

      if (uploadResults.some((result) => result.uploadError)) {
        if (uploadedPaths.length > 0) {
          await supabase.storage
            .from(TRIP_COVER_BUCKET)
            .remove(uploadedPaths);
        }
        setSaving(false);
        setError("写真をアップロードできませんでした。");
        return;
      }

      const uploadedUrls = new Map(
        uploadResults.map(({ imageKey, path }) => [
          imageKey,
          supabase.storage.from(TRIP_COVER_BUCKET).getPublicUrl(path).data
            .publicUrl,
        ]),
      );
      const nextCoverImages: TripCoverImage[] = coverImages.flatMap((image) => {
        const imageUrl = image.file
          ? uploadedUrls.get(image.key)
          : image.originalUrl;
        return imageUrl
          ? [{ image_url: imageUrl, ...image.settings }]
          : [];
      });
      const primaryImage = nextCoverImages[0];
      const primarySettings = primaryImage ?? {
        image_url: null,
        ...DEFAULT_COVER_IMAGE_DISPLAY,
      };

      const { data: updatedTrip, error: updateError } = await supabase
        .from("trips")
        .update({
          cover_images: nextCoverImages,
          cover_image_url: primarySettings.image_url,
          cover_image_fit: primarySettings.cover_image_fit,
          cover_image_zoom: primarySettings.cover_image_zoom,
          cover_image_position_x: primarySettings.cover_image_position_x,
          cover_image_position_y: primarySettings.cover_image_position_y,
          travel_style: travelStyle || null,
          themes,
          is_public: isPublic,
        })
        .eq("id", tripId)
        .eq("user_id", userId)
        .select(
          "cover_images, cover_image_url, cover_image_fit, cover_image_zoom, cover_image_position_x, cover_image_position_y, travel_style, themes, is_public",
        )
        .single();

      if (updateError || !updatedTrip) {
        if (uploadedPaths.length > 0) {
          await supabase.storage
            .from(TRIP_COVER_BUCKET)
            .remove(uploadedPaths);
        }
        setSaving(false);
        setError("Explore掲載設定を保存できませんでした。");
        return;
      }

      const savedCoverImages = normalizeTripCoverImages(
        updatedTrip.cover_images,
        {
          image_url: updatedTrip.cover_image_url ?? "",
          cover_image_fit: updatedTrip.cover_image_fit,
          cover_image_zoom: Number(updatedTrip.cover_image_zoom),
          cover_image_position_x: updatedTrip.cover_image_position_x,
          cover_image_position_y: updatedTrip.cover_image_position_y,
        },
      );
      const retainedUrls = new Set(
        savedCoverImages.map((image) => image.image_url),
      );
      const removedStoragePaths = getInitialCoverImages(initialSettings)
        .filter((image) => !retainedUrls.has(image.image_url))
        .flatMap((image) => {
          const path = getOwnedTripCoverStoragePath(
            image.image_url,
            userId,
            tripId,
          );
          return path ? [path] : [];
        });
      if (removedStoragePaths.length > 0) {
        try {
          await supabase.storage
            .from(TRIP_COVER_BUCKET)
            .remove(Array.from(new Set(removedStoragePaths)));
        } catch {
          // DB保存後の古いファイル清掃失敗では、新しい掲載設定を巻き戻さない。
        }
      }

      setSaving(false);
      onSaved({
        cover_images: savedCoverImages,
        cover_image_url: updatedTrip.cover_image_url,
        cover_image_fit: updatedTrip.cover_image_fit,
        cover_image_zoom: Number(updatedTrip.cover_image_zoom),
        cover_image_position_x: updatedTrip.cover_image_position_x,
        cover_image_position_y: updatedTrip.cover_image_position_y,
        travel_style: updatedTrip.travel_style,
        themes: updatedTrip.themes ?? [],
        is_public: updatedTrip.is_public,
      });
      onClose();
    } catch {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(TRIP_COVER_BUCKET).remove(uploadedPaths);
      }
      setSaving(false);
      setError("Explore掲載設定を保存できませんでした。");
    }
  };

  return (
    <Modal onClose={saving ? () => undefined : onClose} size="lg">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div>
          <p className="mb-1 text-[0.7rem] font-bold uppercase tracking-widest text-indigo-500">
            Explore
          </p>
          <h2 className="text-xl font-bold text-slate-900">掲載内容を編集</h2>
          <p className="mt-1 text-[0.8rem] text-slate-500">
            公開する写真や旅行の特徴を設定します
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          aria-label="閉じる"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xl text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50"
        >
          ✕
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-5 sm:px-6">
        <section aria-labelledby="explore-photos-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3
                id="explore-photos-heading"
                className="text-sm font-bold text-slate-800"
              >
                掲載写真
              </h3>
              <p className="mt-0.5 text-[0.72rem] text-slate-400">
                1枚目がExploreの表紙になります
              </p>
            </div>
            <span className="text-xs font-semibold tabular-nums text-slate-500">
              {coverImages.length} / {MAX_TRIP_COVER_IMAGES}枚
            </span>
          </div>

          {coverImages.length > 0 && (
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {coverImages.map((image, index) => (
                <button
                  key={image.key}
                  type="button"
                  onClick={() => setSelectedImageKey(image.key)}
                  disabled={saving}
                  aria-label={`${index + 1}枚目の写真を編集`}
                  aria-pressed={image.key === selectedImageKey}
                  className={`relative aspect-video w-24 shrink-0 overflow-hidden rounded-[10px] border-2 bg-slate-100 transition-colors sm:w-28 ${
                    image.key === selectedImageKey
                      ? "border-indigo-500"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.previewUrl}
                    alt=""
                    className="size-full object-cover"
                    style={getCoverImageStyle(image.settings)}
                  />
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-slate-950/65 px-1.5 py-0.5 text-[0.62rem] font-semibold text-white">
                    {index === 0 ? "表紙" : index + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedImage ? (
            <section
              ref={editorSectionRef}
              aria-label="選択中の写真の編集"
              className="scroll-mt-4"
            >
              <CoverImageEditor
                imageUrl={selectedImage.previewUrl}
                settings={selectedImage.settings}
                disabled={saving}
                onChange={updateSelectedImageSettings}
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                {selectedImageIndex > 0 && (
                  <button
                    type="button"
                    onClick={handleMakePrimary}
                    disabled={saving}
                    className="rounded-[10px] border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 disabled:opacity-50"
                  >
                    表紙に設定
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRemoveSelectedImage}
                  disabled={saving}
                  className="rounded-[10px] border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  この写真を削除
                </button>
              </div>
            </section>
          ) : (
            <div className="harbor-surface flex aspect-video items-center justify-center rounded-xl border border-slate-200">
              <div className="text-center text-white/70">
                <SiteIcon name="map" className="mx-auto mb-2 size-10" />
                <p className="text-xs font-medium">写真が設定されていません</p>
              </div>
            </div>
          )}

          <label
            className={`mt-3 inline-flex w-full justify-center rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors sm:w-auto ${
              coverImages.length >= MAX_TRIP_COVER_IMAGES || saving
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : "cursor-pointer bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
          >
            {coverImages.length === 0 ? "写真を選択" : "写真を追加"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={
                saving || coverImages.length >= MAX_TRIP_COVER_IMAGES
              }
              onChange={(event) => handleCoverFilesChange(event.target.files)}
              className="sr-only"
            />
          </label>
          <p className="mt-2 text-[0.72rem] text-slate-400">
            最大{MAX_TRIP_COVER_IMAGES}枚・JPEG／PNG／WebP・1枚5MBまで
          </p>
        </section>

        <section aria-labelledby="explore-travel-style-heading">
          <h3
            id="explore-travel-style-heading"
            className="mb-2 text-sm font-bold text-slate-800"
          >
            旅行スタイル
          </h3>
          <select
            id="explore-travel-style"
            aria-labelledby="explore-travel-style-heading"
            value={travelStyle}
            onChange={(event) => setTravelStyle(event.target.value)}
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">設定しない</option>
            {travelStyleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <fieldset>
          <legend className="mb-1 text-sm font-bold text-slate-800">
            テーマ
          </legend>
          <p className="mb-3 text-[0.75rem] text-slate-400">
            {MAX_TRIP_THEMES}つまで選択できます
          </p>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((theme) => {
              const selected = themes.includes(theme);
              return (
                <label
                  key={theme}
                  className={`cursor-pointer rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={saving}
                    onChange={() => handleThemeChange(theme)}
                    className="sr-only"
                  />
                  {theme}
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Exploreに公開する
            </span>
            <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-slate-500">
              未ログインのユーザーを含む、すべての人が閲覧できます
            </span>
          </span>
          <span className="relative shrink-0">
            <input
              type="checkbox"
              checked={isPublic}
              disabled={saving}
              onChange={(event) => setIsPublic(event.target.checked)}
              className="peer sr-only"
            />
            <span className="block h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300 peer-focus-visible:ring-offset-2" />
            <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[0.8rem] text-red-600"
          >
            {error}
          </p>
        )}

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-600 disabled:opacity-60 sm:w-auto"
          >
            {saving ? "保存中..." : "設定を保存"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}

function getInitialCoverImages(settings: ExploreTripSettings) {
  return normalizeTripCoverImages(settings.cover_images, {
    image_url: settings.cover_image_url ?? "",
    cover_image_fit: settings.cover_image_fit,
    cover_image_zoom: settings.cover_image_zoom,
    cover_image_position_x: settings.cover_image_position_x,
    cover_image_position_y: settings.cover_image_position_y,
  });
}

function getInitialEditableImages(
  settings: ExploreTripSettings,
): EditableCoverImage[] {
  return getInitialCoverImages(settings).map((image, index) => ({
    key: `existing-${index}`,
    originalUrl: image.image_url,
    previewUrl: image.image_url,
    file: null,
    settings: {
      cover_image_fit: image.cover_image_fit,
      cover_image_zoom: image.cover_image_zoom,
      cover_image_position_x: image.cover_image_position_x,
      cover_image_position_y: image.cover_image_position_y,
    },
  }));
}
