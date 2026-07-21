import Link from "next/link";
import SiteIcon from "@/components/SiteIcon";

export default function ExploreTripNotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section
        aria-labelledby="explore-not-found-heading"
        className="w-full max-w-[520px] text-center py-14 px-5 bg-[#fffdf8] rounded-2xl border border-slate-200"
      >
        <SiteIcon name="map" className="size-10 mx-auto mb-4 text-indigo-500" />
        <h1
          id="explore-not-found-heading"
          className="text-xl font-bold text-slate-900 mb-2"
        >
          旅行が見つかりませんでした
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          この旅行は非公開になったか、削除された可能性があります。
        </p>
        <Link
          href="/explore"
          className="inline-flex rounded-[10px] bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors"
        >
          Exploreへ戻る
        </Link>
      </section>
    </main>
  );
}
