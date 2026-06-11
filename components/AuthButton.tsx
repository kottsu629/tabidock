type Props = {
  onClick: () => void;
  loading: boolean;
  label: string;
  loadingLabel: string;
};

export default function AuthButton({
  onClick,
  loading,
  label,
  loadingLabel,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full mt-5 py-[13px] bg-gradient-to-br from-indigo-500 to-violet-500 border-none rounded-xl text-white text-[0.95rem] font-bold shadow-[0_4px_20px_rgba(99,102,241,0.4)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
