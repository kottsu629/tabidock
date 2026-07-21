import Link from "next/link";
import Image from "next/image";
import SiteIcon, { type SiteIconName } from "@/components/SiteIcon";
import brandIcon from "../../icon.png";

const navLinkClass =
  "whitespace-nowrap text-xs sm:text-sm font-medium text-gray-700 py-2 px-3 sm:px-4 border border-slate-200 rounded-lg bg-white";
const navCtaClass =
  "whitespace-nowrap text-xs sm:text-sm font-semibold text-white py-2 px-3 sm:px-4 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors";
const sectionLabelClass =
  "text-[0.8rem] font-bold text-indigo-500 tracking-widest uppercase mb-3";
const sectionTitleClass =
  "text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-slate-900 tracking-tight";

export default function LandingPresentation() {
  return (
    <div className="h-dvh overflow-y-auto overscroll-y-none bg-[#fffdf8]">
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-[100] bg-[#fffdf8]/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto h-[60px] flex items-center justify-between">
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Image src={brandIcon} alt="" width={22} height={22} />
            <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              TabiDock
            </span>
          </div>
          <div className="flex gap-2 sm:gap-2.5 items-center">
            <Link
              href="/explore"
              className="hidden sm:inline-flex whitespace-nowrap text-sm font-medium text-slate-600 py-2 px-2"
            >
              Explore
            </Link>
            <Link href="/login" className={navLinkClass}>
              ログイン
            </Link>
            <Link href="/signup" className={navCtaClass}>
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="harbor-surface pt-12 sm:pt-[100px] pb-14 sm:pb-[120px] px-5 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute -top-52 -right-32 w-[430px] h-[430px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-52 -left-24 w-[360px] h-[360px] rounded-full border border-[#d96f4c]/40 pointer-events-none" />

        <div className="max-w-[960px] mx-auto relative">
          <div className="inline-flex items-center gap-1.5 bg-white/8 border border-white/15 rounded-full py-1.5 px-3.5 sm:px-4 text-[0.72rem] sm:text-[0.8rem] text-[#d9e8e2] font-medium mb-7">
            <SiteIcon name="sparkles" className="size-3.5" />{" "}
            <span className="sm:hidden">旅のお金を、もっとシンプルに</span>
            <span className="hidden sm:inline">旅行費用の管理をもっとシンプルに</span>
          </div>

          <h1 className="font-extrabold leading-[1.18] tracking-[-0.045em] mb-6">
            <span className="block sm:hidden text-[2.15rem] text-white">
              旅の予定とお金を
              <span className="block mt-1.5 text-[2.3rem] text-[#f0a07e]">まとめて管理</span>
            </span>
            <span className="hidden sm:block">
              <span className="block text-[clamp(2rem,5vw,3.4rem)] text-white whitespace-nowrap">旅行計画・旅程・旅行費用を</span>
              <span className="block mt-2 text-[clamp(2.15rem,5.3vw,3.6rem)] text-[#f0a07e]">まとめて管理</span>
            </span>
          </h1>

          <p className="text-[0.92rem] sm:text-[1.1rem] text-[#bfd1cb] leading-[1.85] max-w-[560px] mx-auto mb-8 sm:mb-11">
            <span className="sm:hidden">行き先・日程・費用を、<br />ひとつの場所でシンプルに記録。</span>
            <span className="hidden sm:inline">
              行き先・日程・費用をまとめて記録。<br />
              カテゴリ別の内訳から1人あたりの金額まで、<br />
              旅のお金を一目で把握できます。
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex w-full max-w-[280px] sm:w-auto items-center justify-center gap-2 py-3.5 px-8 bg-[#d96f4c] hover:bg-[#bd593b] text-white font-bold text-base rounded-xl shadow-[0_5px_0_#8f3e2a] transition"
            >
              無料ではじめる →
            </Link>
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center gap-2 py-3.5 px-8 bg-white/10 border border-white/20 text-slate-200 font-semibold text-base rounded-xl"
            >
              ログイン
            </Link>
          </div>

          <p className="mt-5 text-[0.75rem] sm:text-[0.8rem] text-[#91aaa2]">
            登録無料・クレジットカード不要
          </p>
        </div>

        {/* ダッシュボードプレビュー（スマホ非表示） */}
        <div className="hidden sm:block max-w-[680px] mt-16 mx-auto [perspective:1000px]">
          <div className="bg-[#fffdf8] border border-[#e7ddcf] rounded-[20px] p-6 shadow-[0_24px_60px_rgba(4,30,27,0.35)]">
            <div className="flex gap-3 mb-4">
              {[
                {
                  title: "沖縄旅行",
                  dest: "那覇市・沖縄県",
                  amount: "¥148,000",
                  color: "#197866",
                },
                {
                  title: "京都旅行",
                  dest: "京都市・京都府",
                  amount: "¥62,500",
                  color: "#d96f4c",
                },
                {
                  title: "北海道旅行",
                  dest: "札幌市・北海道",
                  amount: "¥210,000",
                  color: "#d1a64b",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex-1 bg-slate-50 rounded-xl p-3.5 border border-slate-200"
                >
                  <div
                    className="h-[3px] rounded-sm mb-2.5"
                    style={{ backgroundColor: card.color }}
                  />
                  <p className="text-[0.8rem] font-bold text-slate-900 mb-1">
                    {card.title}
                  </p>
                  <p className="text-[0.65rem] text-slate-500 mb-2 flex items-center gap-1">
                    <SiteIcon name="pin" className="size-3" />
                    {card.dest}
                  </p>
                  <p className="text-base font-bold text-slate-900">
                    {card.amount}
                  </p>
                </div>
              ))}
            </div>
            <div className="h-2 bg-slate-100 rounded" />
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-24 px-6 bg-[#fffdf8]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-[60px]">
            <p className={sectionLabelClass}>Features</p>
            <h2 className={`${sectionTitleClass} mb-4`}>
              シンプルなお金管理の最適解
            </h2>
            <p className="text-base text-slate-500 max-w-[480px] mx-auto leading-[1.7]">
              複雑な設定は不要。旅行を登録して、費用を追加するだけ。
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {[
              {
                icon: "plane",
                title: "旅行を一元管理",
                desc: "行き先・日程・人数をまとめて記録。複数の旅行もすっきり整理できます。",
                color: "#edf7f4",
              },
              {
                icon: "wallet",
                title: "カテゴリ別に記録",
                desc: "交通費・宿泊・食費・観光など、費用をカテゴリ別に分類して把握。",
                color: "#fbf0e9",
              },
              {
                icon: "users",
                title: "1人あたりを自動計算",
                desc: "人数を入力するだけで1人あたりの金額を自動計算。割り勘もすぐわかる。",
                color: "#f2eee3",
              },
              {
                icon: "clipboard",
                title: "旅行履歴を振り返り",
                desc: "過去の旅行費用がいつでも確認できます。次の旅の予算計画にも役立てられます。",
                color: "#edf7f4",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#fffdf8] border border-slate-200 rounded-2xl p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(24,50,46,0.08)]"
              >
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-[18px] text-indigo-600"
                  style={{ backgroundColor: f.color }}
                >
                  <SiteIcon name={f.icon as SiteIconName} className="size-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-[1.7] m-0">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-[800px] mx-auto text-center">
          <p className={sectionLabelClass}>How it works</p>
          <h2 className={`${sectionTitleClass} mb-14`}>
            3ステップではじめられる
          </h2>

          <div className="flex flex-col max-w-[480px] mx-auto">
            {[
              {
                step: "01",
                title: "アカウントを作成",
                desc: "メールアドレスとパスワードで無料登録。30秒で完了します。",
                icon: "clipboard",
              },
              {
                step: "02",
                title: "旅行を登録する",
                desc: "タイトル・行き先・日程・人数を入力して旅行を作成。",
                icon: "map",
              },
              {
                step: "03",
                title: "費用を記録する",
                desc: "カテゴリを選んで金額を追加するだけ。合計は自動で計算されます。",
                icon: "card",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start text-left">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-extrabold text-white shadow-[0_3px_0_#104f44]">
                    {item.step}
                  </div>
                  {i < 2 && <div className="w-0.5 h-12 bg-slate-200 my-1" />}
                </div>
                <div className={`pt-2.5 ${i < 2 ? "pb-10" : ""}`}>
                  <SiteIcon
                    name={item.icon as SiteIconName}
                    className="size-5 mb-2 text-indigo-600"
                  />
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-[1.7] m-0">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-24 px-6 harbor-surface text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/8 pointer-events-none" />
        <div className="max-w-[560px] mx-auto relative">
          <SiteIcon
            name="globe"
            className="size-11 mx-auto mb-5 text-[#f0a07e]"
          />
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-white tracking-tighter mb-4">
            さあ、旅の準備を
            <br />
            はじめよう。
          </h2>
          <p className="text-base text-slate-400 mb-10 leading-[1.7]">
            TabiDock（タビドック）で旅行費用の管理をシンプルに。
            <br />
            無料で使えるので、まずは試してみてください。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 py-4 px-10 bg-[#d96f4c] hover:bg-[#bd593b] text-white font-bold text-[1.05rem] rounded-[14px] shadow-[0_5px_0_#8f3e2a] transition"
          >
            無料ではじめる →
          </Link>
          <p className="mt-4 text-[0.8rem] text-slate-600">
            登録無料・クレジットカード不要
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center bg-[#fffdf8]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Image src={brandIcon} alt="" width={22} height={22} />
          <span className="font-bold text-slate-900 text-[0.95rem]">
            TabiDock
          </span>
        </div>
        <p className="text-[0.8rem] text-slate-400 m-0">
          © 2026 TabiDock. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
