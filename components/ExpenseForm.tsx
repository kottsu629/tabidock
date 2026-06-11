"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, CATEGORY_META } from "@/lib/categories";

type Props = {
  tripId: string;
  onAdded: () => void;
};

const inputClass =
  "border border-slate-200 rounded-[10px] px-[14px] py-[9px] text-sm text-slate-900 bg-slate-50 outline-none";
const labelClass =
  "text-[0.7rem] font-semibold text-slate-400 uppercase tracking-[0.05em]";

export default function ExpenseForm({ tripId, onAdded }: Props) {
  const [form, setForm] = useState({ category: "交通費", title: "", amount: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase.from("expenses").insert({
      trip_id: tripId,
      category: form.category,
      title: form.title,
      amount: Number(form.amount),
    });
    setAdding(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm((prev) => ({ ...prev, title: "", amount: "" }));
    onAdded();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <h2 className="text-[0.9rem] font-bold text-slate-900 mb-4">費用を追加</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-[10px] flex-wrap items-end">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>カテゴリ</label>
            <select
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>
                  {CATEGORY_META[c].emoji} {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            <label className={labelClass}>内容</label>
            <input
              type="text"
              placeholder="例：航空券"
              required
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className={`${inputClass} w-full`}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-[110px]">
            <label className={labelClass}>金額（円）</label>
            <input
              type="number"
              placeholder="0"
              required
              min={0}
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              className={`${inputClass} w-full`}
            />
          </div>

          <button
            type="submit"
            disabled={adding}
            className="bg-indigo-500 text-white border-none rounded-[10px] py-[9px] px-5 text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {adding ? "追加中..." : "+ 追加"}
          </button>
        </div>
        {error && (
          <p className="text-[0.8rem] text-red-500 mt-[10px]">{error}</p>
        )}
      </form>
    </div>
  );
}
