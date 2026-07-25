"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import AuthButton from "@/components/AuthButton";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-[0.9rem] outline-none box-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-100";
const fieldErrorClass = "mt-1.5 text-[0.75rem] text-red-600";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<"email" | "password", string>>;

export default function LoginPresentation() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const validationErrors: FieldErrors = {};

    setError(null);

    if (!trimmedEmail) {
      validationErrors.email = "メールアドレスを入力してください";
    } else if (!emailPattern.test(trimmedEmail)) {
      validationErrors.email = "正しい形式のメールアドレスを入力してください";
    }

    if (!password) {
      validationErrors.password = "パスワードを入力してください";
    }

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    if (error) {
      setError(
        error.code === "invalid_credentials"
          ? "メールアドレスまたはパスワードが正しくありません"
          : "ログインに失敗しました。時間をおいてもう一度お試しください",
      );
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1.5 tracking-[-0.03em]">
        おかえりなさい
      </h1>
      <p className="text-sm text-slate-400 mb-7">TabiDock にログインする</p>

      <div className="flex flex-col gap-3">
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            autoComplete="email"
            aria-label="メールアドレス"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <p id="login-email-error" className={fieldErrorClass}>
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
            aria-label="パスワード"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            className={inputClass}
          />
          {fieldErrors.password && (
            <p id="login-password-error" className={fieldErrorClass}>
              {fieldErrors.password}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 px-[14px] py-[10px] bg-red-500/15 border border-red-500/30 rounded-[10px]">
          <p className="text-[0.8rem] text-red-600 m-0">{error}</p>
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
        <Link href="/signup" className="text-indigo-600 no-underline font-semibold">
          新規登録
        </Link>
      </p>
    </AuthLayout>
  );
}
