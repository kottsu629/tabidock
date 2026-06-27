"use client";

import { useState } from "react";

type Member = {
  id: string;
  user_id: string;
  users: { name: string; email: string | null } | null;
};

type Props = {
  members: Member[];
  isOwner: boolean;
  shareError: string;
  onShare: (email: string) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
};

export default function ShareTripCard({
  members,
  isOwner,
  shareError,
  onShare,
  onRemoveMember,
}: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOwner && members.length === 0) return null;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);
    await onShare(email);
    setSubmitting(false);
    setEmail("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <h2 className="text-[0.9rem] font-bold text-slate-900 mb-4">共有</h2>

      {members.length > 0 && (
        <div className="space-y-2 mb-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200"
            >
              <span className="text-sm text-slate-700">
                👤 {m.users?.name ?? m.users?.email ?? "不明なユーザー"}
              </span>
              {isOwner && (
                <button
                  onClick={() => onRemoveMember(m.id)}
                  className="text-xs text-slate-400 border-none bg-transparent cursor-pointer px-2 py-1 rounded-[6px] hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  解除
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            autoComplete="off"
            name="share-email"
            placeholder="メールアドレスで共有"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-slate-200 rounded-[10px] px-[14px] py-[9px] text-sm text-slate-900 bg-slate-50 outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-500 text-white border-none rounded-[10px] py-[9px] px-5 text-sm font-semibold cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {submitting ? "追加中..." : "+ 共有"}
          </button>
        </form>
      )}
      {shareError && <p className="text-[0.8rem] text-red-500 mt-[10px]">{shareError}</p>}
    </div>
  );
}
