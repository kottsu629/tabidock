"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import AuthButton from "@/components/AuthButton";

const inputClass =
  "w-full py-3 px-4 border border-white/15 rounded-xl bg-white/[0.08] text-white text-[0.9rem] outline-none box-border";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold text-white mb-1.5 tracking-[-0.03em]">
        おかえりなさい
      </h1>
      <p className="text-sm text-slate-400 mb-7">TripLog にログインする</p>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className={inputClass}
        />
      </div>

      {error && (
        <div className="mt-3 px-[14px] py-[10px] bg-red-500/15 border border-red-500/30 rounded-[10px]">
          <p className="text-[0.8rem] text-red-300 m-0">{error}</p>
        </div>
      )}

      <AuthButton
        onClick={handleLogin}
        loading={loading}
        label="ログイン"
        loadingLabel="ログイン中..."
      />

      <p className="text-center mt-5 text-[0.85rem] text-slate-500">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-indigo-300 no-underline font-semibold">
          新規登録
        </Link>
      </p>
    </AuthLayout>
  );
}
