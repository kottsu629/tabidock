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
      aria-label="公開旅行の絞り込み"
      className="bg-[#fffdf8] rounded-2xl border border-slate-200 p-4 sm:p-5 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <NumberFilterField
          id="min-budget"
          name="min_budget"
          label="予算（下限）"
          min={0}
          step={1000}
          defaultValue={filters.minBudget}
          placeholder="¥0"
        />
        <NumberFilterField
          id="max-budget"
          name="max_budget"
          label="予算（上限）"
          min={0}
          step={1000}
          defaultValue={filters.maxBudget}
          placeholder="上限なし"
        />
        <NumberFilterField
          id="num-people"
          name="num_people"
          label="人数"
          min={1}
          step={1}
          defaultValue={filters.numPeople}
          placeholder="例：2"
        />
        <SelectFilterField
          id="theme"
          name="theme"
          label="テーマ"
          defaultValue={filters.theme}
          options={themeOptions}
        />
        <SelectFilterField
          id="travel-style"
          name="travel_style"
          label="旅行スタイル"
          defaultValue={filters.travelStyle}
          options={travelStyleOptions}
        />
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

function NumberFilterField({
  id,
  name,
  label,
  min,
  step,
  defaultValue,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  min: number;
  step: number;
  defaultValue: number | null;
  placeholder: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="number"
        min={min}
        step={step}
        defaultValue={defaultValue ?? ""}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectFilterField({
  id,
  name,
  label,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={inputClass}
      >
        <option value="">すべて</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
