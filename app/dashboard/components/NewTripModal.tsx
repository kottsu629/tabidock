"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Modal from "@/components/Modal";
import type { TablesInsert } from "@/types/database";

type Props = {
  userId: string;
  onClose: () => void;
  onCreated: () => void;
};

type TripForm = Required<
  Pick<
    TablesInsert<"trips">,
    | "title"
    | "destination"
    | "area"
    | "start_date"
    | "end_date"
    | "is_public"
  >
>;

const inputClass =
  "block w-full min-w-0 max-w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export default function NewTripModal({ userId, onClose, onCreated }: Props) {
  const [form, setForm] = useState<TripForm>({
    title: "",
    destination: "",
    area: "",
    start_date: "",
    end_date: "",
    is_public: false,
  });
  const [participantNames, setParticipantNames] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <Key extends keyof TripForm>(key: Key, value: TripForm[Key]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setParticipantName = (index: number, value: string) =>
    setParticipantNames((prev) =>
      prev.map((name, i) => (i === index ? value : name)),
    );

  const addParticipant = () => setParticipantNames((prev) => [...prev, ""]);

  const removeParticipant = (index: number) =>
    setParticipantNames((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (form.start_date > form.end_date) {
      setError("終了日は開始日以降にしてください");
      return;
    }
    const names = participantNames.map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) {
      setError("参加者を1人以上入力してください");
      return;
    }
    setLoading(true);
    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        ...form,
        user_id: userId,
      })
      .select("id")
      .single();
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }
    const { error: participantsError } = await supabase
      .from("participants")
      .insert(names.map((name) => ({ trip_id: trip.id, name })));
    setLoading(false);
    if (participantsError) {
      setError(participantsError.message);
      return;
    }
    onCreated();
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-gray-900 text-xl font-bold">旅行を追加</h2>
          <p className="text-gray-500 text-[0.8rem] mt-0.5">
            旅行の基本情報を入力してください
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 text-xl"
        >
          ✕
        </button>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="min-w-0 px-4 sm:px-6 py-5 space-y-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
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
          <div className="min-w-0">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="min-w-0">
            <label className={labelClass}>開始日</label>
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="min-w-0">
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
          <label className={labelClass}>参加者</label>
          <div className="space-y-2">
            {participantNames.map((name, i) => (
              <div key={i} className="flex min-w-0 gap-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setParticipantName(i, e.target.value)}
                  className={inputClass}
                  placeholder={`参加者${i + 1}`}
                />
                {participantNames.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(i)}
                    className="shrink-0 px-3 text-gray-400 hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParticipant}
            className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-700 transition"
          >
            + 参加者を追加
          </button>
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 cursor-pointer">
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-800">
              「みんなの旅」に公開する
            </span>
            <span className="block text-[0.75rem] leading-relaxed text-slate-500 mt-0.5">
              未ログインのユーザーを含む、すべての人が閲覧できます
            </span>
            <span className="block text-[0.7rem] leading-relaxed text-slate-400 mt-1">
              カバー画像やテーマは作成後の旅行詳細から設定できます
            </span>
          </span>
          <span className="relative shrink-0">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => set("is_public", e.target.checked)}
              className="peer sr-only"
            />
            <span className="block h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-300 peer-focus-visible:ring-offset-2" />
            <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
          </span>
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
            <p className="text-red-600 text-[0.8rem]">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "保存中..." : "+ 追加する"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
