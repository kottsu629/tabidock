import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ナビゲーション */}
      <nav className="sticky top-0 z-[100] bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-6">
        <div className="max-w-[1100px] mx-auto h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[1.4rem]">✈️</span>
            <span className="font-extrabold text-[1.15rem] text-slate-900 tracking-[-0.03em]">
              TripLog
            </span>
          </div>
          <div className="flex gap-[10px] items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 no-underline py-2 px-[18px] border border-slate-200 rounded-[9px] bg-white"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold text-white no-underline py-2 px-[18px] rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-500"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="bg-[linear-gradient(160deg,#0f172a_0%,#1e1b4b_40%,#312e81_70%,#4c1d95_100%)] pt-[100px] pb-[120px] px-6 text-center relative overflow-hidden">
        {/* 背景の装飾円 */}
        <div className="absolute -top-[80px] -right-[80px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-[60px] -left-[60px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.25)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-[720px] mx-auto relative">
          {/* バッジ */}
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-full py-1.5 px-4 text-[0.8rem] text-indigo-300 font-medium mb-7">
            <span>✨</span> 旅行費用の管理をもっとシンプルに
          </div>

          {/* メインコピー */}
          <h1 className="text-[clamp(2.2rem,6vw,3.8rem)] font-extrabold text-white leading-[1.15] tracking-[-0.04em] mb-6">
            旅の思い出を、
            <br />
            <span className="bg-[linear-gradient(90deg,#818cf8,#c084fc)] bg-clip-text text-transparent">
              もっとスマートに。
            </span>
          </h1>

          <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-slate-400 leading-[1.75] max-w-[560px] mx-auto mb-11">
            行き先・日程・費用をまとめて記録。
            <br />
            カテゴリ別の内訳から1人あたりの金額まで、
            <br />
            旅のお金を一目で把握できます。
          </p>

          {/* CTAボタン */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 py-[14px] px-8 bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-base rounded-xl no-underline shadow-[0_8px_32px_rgba(99,102,241,0.4)]"
            >
              無料ではじめる →
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 py-[14px] px-8 bg-white/10 border border-white/20 text-slate-200 font-semibold text-base rounded-xl no-underline"
            >
              ログイン
            </Link>
          </div>

          {/* 小さな補足 */}
          <p className="mt-5 text-[0.8rem] text-slate-600">
            登録無料・クレジットカード不要
          </p>
        </div>

        {/* ダッシュボードのプレビューイメージ（スマホ非表示） */}
        <div className="hidden sm:block max-w-[680px] mt-16 mx-auto [perspective:1000px]">
          <div className="bg-white/5 border border-white/10 rounded-[20px] p-6 [transform:rotateX(4deg)] backdrop-blur-[10px]">
            {/* フェイクUI */}
            <div className="flex gap-3 mb-4">
              {[
                {
                  title: "沖縄旅行",
                  dest: "那覇市・沖縄県",
                  amount: "¥148,000",
                  color: "#6366f1",
                },
                {
                  title: "京都旅行",
                  dest: "京都市・京都府",
                  amount: "¥62,500",
                  color: "#8b5cf6",
                },
                {
                  title: "北海道旅行",
                  dest: "札幌市・北海道",
                  amount: "¥210,000",
                  color: "#06b6d4",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="flex-1 bg-white/[0.07] rounded-xl p-[14px] border border-white/10"
                >
                  <div
                    className="h-[3px] rounded-[2px] mb-[10px]"
                    style={{ backgroundColor: card.color }}
                  />
                  <p className="text-[0.8rem] font-bold text-slate-200 mb-1">
                    {card.title}
                  </p>
                  <p className="text-[0.65rem] text-slate-500 mb-2">
                    📍 {card.dest}
                  </p>
                  <p className="text-base font-bold text-white">
                    {card.amount}
                  </p>
                </div>
              ))}
            </div>
            <div className="h-2 bg-white/5 rounded" />
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-[60px]">
            <p className="text-[0.8rem] font-bold text-indigo-500 tracking-[0.1em] uppercase mb-3">
              Features
            </p>
            <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-slate-900 tracking-[-0.03em] mb-4">
              シンプルなお金管理の最適解
            </h2>
            <p className="text-base text-slate-500 max-w-[480px] mx-auto leading-[1.7]">
              複雑な設定は不要。旅行を登録して、費用を追加するだけ。
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {[
              {
                emoji: "✈️",
                title: "旅行を一元管理",
                desc: "行き先・日程・人数をまとめて記録。複数の旅行もすっきり整理できます。",
                color: "#eff6ff",
              },
              {
                emoji: "💰",
                title: "カテゴリ別に記録",
                desc: "交通費・宿泊・食費・観光など、費用をカテゴリ別に分類して把握。",
                color: "#fefce8",
              },
              {
                emoji: "👥",
                title: "1人あたりを自動計算",
                desc: "人数を入力するだけで1人あたりの金額を自動計算。割り勘もすぐわかる。",
                color: "#f0fdf4",
              },
              {
                emoji: "📋",
                title: "旅行履歴を振り返り",
                desc: "過去の旅行費用がいつでも確認できます。次の旅の予算計画にも役立てられます。",
                color: "#fdf4ff",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-slate-200 rounded-2xl p-7 transition-[transform,box-shadow] duration-200"
              >
                <div
                  className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[1.6rem] mb-[18px]"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.emoji}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-[1.7] m-0">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使い方セクション */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="text-[0.8rem] font-bold text-indigo-500 tracking-[0.1em] uppercase mb-3">
            How it works
          </p>
          <h2 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold text-slate-900 tracking-[-0.03em] mb-14">
            3ステップではじめられる
          </h2>

          <div className="flex flex-col max-w-[480px] mx-auto">
            {[
              {
                step: "01",
                title: "アカウントを作成",
                desc: "メールアドレスとパスワードで無料登録。30秒で完了します。",
                emoji: "📝",
              },
              {
                step: "02",
                title: "旅行を登録する",
                desc: "タイトル・行き先・日程・人数を入力して旅行を作成。",
                emoji: "🗺️",
              },
              {
                step: "03",
                title: "費用を記録する",
                desc: "カテゴリを選んで金額を追加するだけ。合計は自動で計算されます。",
                emoji: "💳",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start text-left">
                {/* ライン */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-xs font-extrabold text-white">
                    {item.step}
                  </div>
                  {i < 2 && <div className="w-0.5 h-12 bg-slate-200 my-1" />}
                </div>

                <div className={`pt-[10px] ${i < 2 ? "pb-10" : ""}`}>
                  <div className="text-[1.4rem] mb-1.5">{item.emoji}</div>
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
      <section className="py-24 px-6 bg-[linear-gradient(160deg,#0f172a_0%,#1e1b4b_50%,#312e81_100%)] text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.2)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[560px] mx-auto relative">
          <div className="text-5xl mb-5">🌏</div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-white tracking-[-0.04em] mb-4">
            さあ、旅の準備を
            <br />
            はじめよう。
          </h2>
          <p className="text-base text-slate-400 mb-10 leading-[1.7]">
            TripLogで旅行費用の管理をシンプルに。
            <br />
            無料で使えるので、まずは試してみてください。
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 py-4 px-10 bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-bold text-[1.05rem] rounded-[14px] no-underline shadow-[0_12px_40px_rgba(99,102,241,0.5)]"
          >
            無料ではじめる →
          </Link>
          <p className="mt-4 text-[0.8rem] text-slate-600">
            登録無料・クレジットカード不要
          </p>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[1.1rem]">✈️</span>
          <span className="font-bold text-slate-900 text-[0.95rem]">
            TripLog
          </span>
        </div>
        <p className="text-[0.8rem] text-slate-400 m-0">
          © 2026 TripLog. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
