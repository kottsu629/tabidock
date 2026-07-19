import Link from "next/link";
import Image from "next/image";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f172a_0%,#1e1b4b_40%,#312e81_70%,#4c1d95_100%)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 装飾円（右上） */}
      <div className="absolute -top-[100px] -right-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25)_0%,transparent_70%)] pointer-events-none" />
      {/* 装飾円（左下） */}
      <div className="absolute -bottom-[80px] -left-[80px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)] pointer-events-none" />

      {/* ロゴ */}
      <Link href="/" className="no-underline mb-10 flex items-center gap-2">
        <Image src="/icon.png" alt="" width={28} height={28} />
        <span className="font-extrabold text-[1.25rem] text-white tracking-[-0.03em]">
          TripLog
        </span>
      </Link>

      {/* ガラスカード */}
      <div className="w-full max-w-[400px] bg-white/[0.07] border border-white/[0.12] rounded-[20px] p-9 backdrop-blur-[20px] relative">
        {children}
      </div>
    </div>
  );
}
