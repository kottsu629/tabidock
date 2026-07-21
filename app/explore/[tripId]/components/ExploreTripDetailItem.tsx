import SiteIcon from "@/components/SiteIcon";

type Props = {
  icon: "pin" | "calendar" | "wallet" | "users";
  label: string;
  children: React.ReactNode;
};

export default function ExploreTripDetailItem({
  icon,
  label,
  children,
}: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <dt className="flex items-center gap-1.5 text-[0.72rem] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
        <SiteIcon name={icon} className="size-3.5" />
        {label}
      </dt>
      <dd className="text-sm sm:text-base font-semibold text-slate-800">
        {children}
      </dd>
    </div>
  );
}
