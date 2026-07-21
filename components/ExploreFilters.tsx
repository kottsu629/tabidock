import Link from "next/link";
import type { ExploreFilters as ExploreFilterValues } from "@/lib/explore";
import {
  THEME_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
} from "@/lib/explore-options";

type Props = {
  filters: ExploreFilterValues;
  hasActiveFilters: boolean;
};

const labelClass =
  "block text-[0.72rem] font-semibold text-slate-500 uppercase tracking-wide mb-1.5";
const inputClass =
  "w-full min-w-0 rounded-[10px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export default function ExploreFilters({
  filters,
  hasActiveFilters,
}: Props) {
  const themeOptions = Array.from(
    new Set([...THEME_OPTIONS, filters.theme].filter(Boolean)),
  );
  const travelStyleOptions = Array.from(
    new Set([...TRAVEL_STYLE_OPTIONS, filters.travelStyle].filter(Boolean)),
  );

  return (
    <form
      action="/explore"
      className="bg-[#fffdf8] rounded-2xl border border-slate-200 p-4 sm:p-5 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="min-w-0">
          <label htmlFor="min-budget" className={labelClass}>
            予算（下限）
          </label>
          <input
            id="min-budget"
            name="min_budget"
            type="number"
            min="0"
            step="1000"
            defaultValue={filters.minBudget ?? ""}
            className={inputClass}
            placeholder="¥0"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="max-budget" className={labelClass}>
            予算（上限）
          </label>
          <input
            id="max-budget"
            name="max_budget"
            type="number"
            min="0"
            step="1000"
            defaultValue={filters.maxBudget ?? ""}
            className={inputClass}
            placeholder="上限なし"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="num-people" className={labelClass}>
            人数
          </label>
          <input
            id="num-people"
            name="num_people"
            type="number"
            min="1"
            step="1"
            defaultValue={filters.numPeople ?? ""}
            className={inputClass}
            placeholder="例：2"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="theme" className={labelClass}>
            テーマ
          </label>
          <select
            id="theme"
            name="theme"
            defaultValue={filters.theme}
            className={inputClass}
          >
            <option value="">すべて</option>
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label htmlFor="travel-style" className={labelClass}>
            旅行スタイル
          </label>
          <select
            id="travel-style"
            name="travel_style"
            defaultValue={filters.travelStyle}
            className={inputClass}
          >
            <option value="">すべて</option>
            {travelStyleOptions.map((travelStyle) => (
              <option key={travelStyle} value={travelStyle}>
                {travelStyle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-4">
        {hasActiveFilters && (
          <Link
            href="/explore"
            className="inline-flex justify-center rounded-[10px] border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            条件をクリア
          </Link>
        )}
        <button
          type="submit"
          className="rounded-[10px] border-none bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white cursor-pointer hover:bg-indigo-600 transition-colors"
        >
          絞り込む
        </button>
      </div>
    </form>
  );
}
