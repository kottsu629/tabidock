import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import AuthButton from "@/components/AuthButton";

const inputClass =
  "w-full py-3 px-4 border border-white/15 rounded-xl bg-white/[0.08] text-white text-[0.9rem] outline-none box-border";
const labelClass =
  "block text-[0.75rem] font-semibold text-slate-400 mb-1.5 uppercase tracking-[0.05em]";

type Props = {
  name: string;
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export default function SignupPresentation({
  name,
  email,
  password,
  error,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
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
            onChange={(e) => onNameChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>メールアドレス</label>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>パスワード</label>
          <input
            type="password"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
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
        onClick={onSubmit}
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
