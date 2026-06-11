"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import AuthButton from "@/components/AuthButton";

const inputClass =
  "w-full py-3 px-4 border border-white/15 rounded-xl bg-white/[0.08] text-white text-[0.9rem] outline-none box-border";
const labelClass =
  "block text-[0.75rem] font-semibold text-slate-400 mb-1.5 uppercase tracking-[0.05em]";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "エラーが発生しました");
      setLoading(false);
      return;
    }
    const { error: insertError } = await supabase
      .from("users")
      .insert({ id: data.user.id, name });
    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/35 rounded-full py-1 px-3 text-[0.75rem] text-indigo-300 font-medium mb-4">
        ✨ 登録無料
      </div>

      <h1 className="text-2xl font-extrabold text-white mb-1.5 tracking-[-0.03em]">
        アカウントを作成
      </h1>
      <p className="text-sm text-slate-400 mb-7">
        TripLog で旅の記録をはじめよう
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>ニックネーム</label>
          <input
            type="text"
            placeholder="例：たろう"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>メールアドレス</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>パスワード</label>
          <input
            type="password"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 px-[14px] py-[10px] bg-red-500/15 border border-red-500/30 rounded-[10px]">
          <p className="text-[0.8rem] text-red-300 m-0">{error}</p>
        </div>
      )}

      <AuthButton
        onClick={handleSignup}
        loading={loading}
        label="無料ではじめる →"
        loadingLabel="登録中..."
      />

      <p className="text-center mt-5 text-[0.85rem] text-slate-500">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-indigo-300 no-underline font-semibold">
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
