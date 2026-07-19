import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen harbor-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 装飾円（右上） */}
      <div className="absolute -top-[180px] -right-[120px] w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none" />
      {/* 装飾円（左下） */}
      <div className="absolute -bottom-[160px] -left-[120px] w-[400px] h-[400px] rounded-full border border-[#d96f4c]/30 pointer-events-none" />

      {/* ロゴ */}
      <Link href="/" className="no-underline mb-10 flex items-center">
        <span className="font-extrabold text-[1.25rem] text-white tracking-[-0.03em]">
          TabiDock
        </span>
      </Link>

      {/* ガラスカード */}
      <div className="w-full max-w-[400px] bg-[#fffdf8] border border-[#e8dfd1] rounded-[20px] p-9 shadow-[0_24px_70px_rgba(4,30,27,0.28)] relative text-slate-900">
        {children}
      </div>
    </div>
  );
}
