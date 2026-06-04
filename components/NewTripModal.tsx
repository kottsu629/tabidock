"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "./Modal";

type Props = {
  userId: string;
  onClose: () => void;
  onCreated: () => void;
};

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function NewTripModal({ userId, onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    area: "",
    start_date: "",
    end_date: "",
    num_people: 1,
    is_public: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (form.start_date > form.end_date) {
      setError("終了日は開始日以降にしてください");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("trips").insert({
      ...form,
      user_id: userId,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    onCreated();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100">
        <div>
          <h2
            style={{ color: "#111827", fontSize: "1.25rem", fontWeight: 700 }}
          >
            旅行を追加
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.8rem", marginTop: "2px" }}>
            旅行の基本情報を入力してください
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          style={{ color: "#9ca3af", fontSize: "1.25rem" }}
        >
          ✕
        </button>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className={labelClass}>タイトル</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass}
            placeholder="例：沖縄旅行2026"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>目的地</label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={(e) => set("destination", e.target.value)}
              className={inputClass}
              placeholder="例：那覇市"
            />
          </div>
          <div>
            <label className={labelClass}>エリア</label>
            <input
              type="text"
              required
              value={form.area}
              onChange={(e) => set("area", e.target.value)}
              className={inputClass}
              placeholder="例：沖縄県"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>開始日</label>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>終了日</label>
            <input
              type="date"
              required
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>人数</label>
          <input
            type="number"
            required
            min={1}
            value={form.num_people}
            onChange={(e) => set("num_people", Number(e.target.value))}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id="is_public"
            checked={form.is_public}
            onChange={(e) => set("is_public", e.target.checked)}
            className="w-4 h-4 rounded accent-blue-500"
          />
          <label
            htmlFor="is_public"
            style={{ color: "#374151", fontSize: "0.875rem" }}
          >
            この旅行を公開する
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <p style={{ color: "#dc2626", fontSize: "0.8rem" }}>{error}</p>
          </div>
        )}

        {/* フッター */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            style={{ color: "#374151" }}
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl transition disabled:opacity-50"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            {loading ? "保存中..." : "+ 追加する"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
