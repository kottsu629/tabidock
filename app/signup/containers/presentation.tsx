"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import AuthButton from "@/components/AuthButton";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full py-3 px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-[0.9rem] outline-none box-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-100";
const labelClass =
  "block text-[0.75rem] font-semibold text-slate-500 mb-1.5 uppercase tracking-[0.05em]";
const fieldErrorClass = "mt-1.5 text-[0.75rem] text-red-600";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<
  Record<"name" | "email" | "password", string>
>;

export default function SignupPresentation() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const validationErrors: FieldErrors = {};

    setError(null);

    if (!trimmedName) {
      validationErrors.name = "ニックネームを入力してください";
    }

    if (!trimmedEmail) {
      validationErrors.email = "メールアドレスを入力してください";
    } else if (!emailPattern.test(trimmedEmail)) {
      validationErrors.email = "正しい形式のメールアドレスを入力してください";
    }

    if (!password) {
      validationErrors.password = "パスワードを入力してください";
    } else if (password.length < 8) {
      validationErrors.password = "パスワードは8文字以上で入力してください";
    }

    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: trimmedName,
        },
      },
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "エラーが発生しました");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthLayout>
      <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full py-1 px-3 text-[0.75rem] text-indigo-700 font-medium mb-4">
        登録無料
      </div>

      <h1 className="text-2xl font-extrabold text-slate-900 mb-1.5 tracking-[-0.03em]">
        アカウントを作成
      </h1>
      <p className="text-sm text-slate-400 mb-7">
        TabiDock で旅の記録をはじめよう
      </p>

      <div className="flex flex-col gap-3">
        <div>
          <label htmlFor="signup-name" className={labelClass}>
            ニックネーム
          </label>
          <input
            id="signup-name"
            type="text"
            placeholder="例：たろう"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            autoComplete="nickname"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "signup-name-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.name && (
            <p id="signup-name-error" className={fieldErrorClass}>
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="signup-email" className={labelClass}>
            メールアドレス
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <p id="signup-email-error" className={fieldErrorClass}>
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="signup-password" className={labelClass}>
            パスワード
          </label>
          <input
            id="signup-password"
            type="password"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            autoComplete="new-password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "signup-password-error" : undefined
            }
            className={inputClass}
          />
          {fieldErrors.password && (
            <p id="signup-password-error" className={fieldErrorClass}>
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
        onClick={handleSignup}
        loading={loading}
        label="無料ではじめる →"
        loadingLabel="登録中..."
      />

      <p className="text-center mt-5 text-[0.85rem] text-slate-500">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href="/login"
          className="text-indigo-600 no-underline font-semibold"
        >
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
}
