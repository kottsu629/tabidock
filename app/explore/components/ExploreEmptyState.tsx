import SiteIcon from "@/components/SiteIcon";

type Props = {
  hasActiveFilters: boolean;
};

export default function ExploreEmptyState({ hasActiveFilters }: Props) {
  return (
    <section
      aria-labelledby="explore-empty-heading"
      className="text-center py-16 sm:py-20 px-5 bg-[#fffdf8] rounded-2xl border border-slate-200"
    >
      <SiteIcon name="globe" className="size-10 mx-auto mb-4 text-indigo-500" />
      <h2
        id="explore-empty-heading"
        className="text-base text-slate-700 font-semibold mb-1.5"
      >
        {hasActiveFilters
          ? "条件に合う旅行が見つかりませんでした。"
          : "まだ公開されている旅行がありません。"}
      </h2>
      <p className="text-sm text-slate-400">
        {hasActiveFilters
          ? "条件を変更して、もう一度探してみてください。"
          : "あなたの旅行を最初に公開してみませんか？"}
      </p>
    </section>
  );
}
