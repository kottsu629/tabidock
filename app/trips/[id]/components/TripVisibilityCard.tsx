"use client";

import SiteIcon from "@/components/SiteIcon";
import { getCoverImageStyle, type TripCoverImage } from "@/lib/trip-cover";

type Props = {
  isPublic: boolean;
  coverImages: TripCoverImage[];
  travelStyle: string | null;
  themes: string[];
  onEdit: () => void;
};

export default function TripVisibilityCard({
  isPublic,
  coverImages,
  travelStyle,
  themes,
  onEdit,
}: Props) {
  const primaryImage = coverImages[0];
  const hasExploreDetails = Boolean(
    primaryImage || travelStyle || themes.length > 0,
  );

  return (
    <section
      aria-labelledby="explore-visibility-heading"
      className="bg-[#fffdf8] rounded-2xl border border-slate-200 p-5 sm:p-6 mb-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600">
            <SiteIcon name="globe" className="size-4.5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="explore-visibility-heading"
                className="text-[0.9rem] font-bold text-slate-900"
              >
                旅行の公開設定
              </h2>
              <span
                className={`rounded-[6px] px-2 py-0.5 text-[0.65rem] font-semibold ${
                  isPublic
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {isPublic ? "公開中" : "非公開"}
              </span>
            </div>
            <p className="text-[0.78rem] leading-relaxed text-slate-500 mt-1">
              公開範囲・掲載写真・旅行スタイル・テーマを設定できます
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          <SiteIcon name="edit" className="size-4" />
          公開設定を編集
        </button>
      </div>

      {hasExploreDetails && (
        <section
          aria-labelledby="current-explore-content-heading"
          className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100"
        >
          <div className="size-14 shrink-0 overflow-hidden rounded-[10px] bg-slate-100">
            {primaryImage ? (
              // URLはアップロード先プロジェクトごとに異なるためNext Imageを使用しない。
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={primaryImage.image_url}
                alt="現在の表紙写真"
                className="size-full object-cover"
                style={getCoverImageStyle(primaryImage)}
              />
            ) : (
              <div className="harbor-surface flex size-full items-center justify-center">
                <SiteIcon name="map" className="size-5 text-white/65" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              id="current-explore-content-heading"
              className="text-[0.68rem] font-semibold uppercase tracking-wide text-slate-400 mb-1.5"
            >
              現在の掲載内容
              {coverImages.length > 0 && `・写真${coverImages.length}枚`}
            </h3>
            {travelStyle || themes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {travelStyle && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[0.7rem] font-semibold text-indigo-600">
                    {travelStyle}
                  </span>
                )}
                {themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.7rem] font-medium text-slate-600"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[0.75rem] text-slate-400">
                旅行スタイル・テーマは未設定です
              </p>
            )}
          </div>
        </section>
      )}
    </section>
  );
}
