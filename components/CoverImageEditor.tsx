"use client";

import { useRef, useState } from "react";
import {
  DEFAULT_COVER_IMAGE_DISPLAY,
  getCoverImageStyle,
  type CoverImageDisplaySettings,
} from "@/lib/trip-cover";

type Props = {
  imageUrl: string;
  settings: CoverImageDisplaySettings;
  disabled?: boolean;
  onChange: (settings: CoverImageDisplaySettings) => void;
};

export default function CoverImageEditor({
  imageUrl,
  settings,
  disabled = false,
  onChange,
}: Props) {
  const dragStartRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    positionX: number;
    positionY: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const canAdjustPosition = settings.cover_image_fit === "cover" && !disabled;

  const updateSettings = (updates: Partial<CoverImageDisplaySettings>) => {
    onChange({ ...settings, ...updates });
  };

  const reset = () => onChange({ ...DEFAULT_COVER_IMAGE_DISPLAY });

  const handleShowWholeImageChange = (showWholeImage: boolean) => {
    onChange({
      ...DEFAULT_COVER_IMAGE_DISPLAY,
      cover_image_fit: showWholeImage ? "contain" : "cover",
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canAdjustPosition || !event.isPrimary) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      positionX: settings.cover_image_position_x,
      positionY: settings.cover_image_position_y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== event.pointerId) return;

    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const deltaX = ((event.clientX - dragStart.clientX) / bounds.width) * 100;
    const deltaY = ((event.clientY - dragStart.clientY) / bounds.height) * 100;

    updateSettings({
      cover_image_position_x: Math.round(
        clamp(dragStart.positionX - deltaX, 0, 100),
      ),
      cover_image_position_y: Math.round(
        clamp(dragStart.positionY - deltaY, 0, 100),
      ),
    });
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStartRef.current = null;
    setIsDragging(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canAdjustPosition) return;

    const adjustment = event.shiftKey ? 5 : 2;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      updateSettings({
        cover_image_position_x: clamp(
          settings.cover_image_position_x +
            (event.key === "ArrowLeft" ? -adjustment : adjustment),
          0,
          100,
        ),
      });
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      updateSettings({
        cover_image_position_y: clamp(
          settings.cover_image_position_y +
            (event.key === "ArrowUp" ? -adjustment : adjustment),
          0,
          100,
        ),
      });
    }
  };

  return (
    <div>
      <div
        role="group"
        tabIndex={canAdjustPosition ? 0 : -1}
        aria-label={
          canAdjustPosition
            ? "写真をドラッグまたは矢印キーで表示位置を調整できます"
            : "写真の表示プレビュー"
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onKeyDown={handleKeyDown}
        className={`relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
          canAdjustPosition
            ? `touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`
            : ""
        }`}
      >
        {/* URLはユーザーごとに異なるためNext Imageの固定ホスト制約を適用しない。 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="選択中の写真のプレビュー"
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-cover"
          style={getCoverImageStyle(settings)}
        />
        {settings.cover_image_fit === "cover" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
            <span className="rounded-full bg-slate-950/70 px-3 py-1.5 text-[0.7rem] font-semibold text-white shadow-sm backdrop-blur-sm">
              {isDragging
                ? "そのまま動かしてください"
                : "ドラッグして表示位置を調整"}
            </span>
          </div>
        )}
      </div>

      <section
        aria-labelledby="cover-image-adjustment-heading"
        className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h4
              id="cover-image-adjustment-heading"
              className="text-sm font-bold text-slate-800"
            >
              写真の表示調整
            </h4>
            <p className="mt-0.5 text-[0.72rem] text-slate-400">
              Exploreと同じ16:9で確認できます
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            disabled={disabled}
            className="shrink-0 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600 disabled:opacity-50"
          >
            リセット
          </button>
        </div>

        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[10px] border border-slate-200 bg-white px-3.5 py-3">
          <span>
            <span className="block text-xs font-semibold text-slate-700">
              画像全体を表示
            </span>
            <span className="mt-0.5 block text-[0.68rem] leading-relaxed text-slate-400">
              画像を切り取らずに表示します
            </span>
          </span>
          <span className="relative shrink-0">
            <input
              type="checkbox"
              checked={settings.cover_image_fit === "contain"}
              disabled={disabled}
              onChange={(event) =>
                handleShowWholeImageChange(event.target.checked)
              }
              className="peer sr-only"
            />
            <span className="block h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300 peer-focus-visible:ring-offset-2" />
            <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </span>
        </label>

        {settings.cover_image_fit === "cover" ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="cover-image-zoom"
                className="text-xs font-semibold text-slate-600"
              >
                拡大率
              </label>
              <span className="text-[0.7rem] tabular-nums text-slate-400">
                {Math.round(settings.cover_image_zoom * 100)}%
              </span>
            </div>
            <input
              id="cover-image-zoom"
              type="range"
              value={settings.cover_image_zoom}
              min={1}
              max={2}
              step={0.05}
              disabled={disabled}
              onChange={(event) =>
                updateSettings({
                  cover_image_zoom: Number(event.target.value),
                })
              }
              className="w-full accent-indigo-500 disabled:opacity-50"
            />
            <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-slate-500">
              写真を指またはマウスで動かして、表示位置を決めてください
            </p>
          </div>
        ) : (
          <p className="mt-3 text-center text-[0.7rem] leading-relaxed text-slate-500">
            画像全体を中央に表示します
          </p>
        )}
      </section>
    </div>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
