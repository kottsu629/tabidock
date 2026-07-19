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
      className="w-full mt-5 py-[13px] bg-indigo-500 hover:bg-indigo-600 border-none rounded-xl text-white text-[0.95rem] font-bold shadow-[0_5px_0_#104f44] active:translate-y-0.5 active:shadow-[0_3px_0_#104f44] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
