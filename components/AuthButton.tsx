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
      style={{
        width: "100%",
        marginTop: "20px",
        padding: "13px",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        border: "none",
        borderRadius: "12px",
        color: "#ffffff",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
      }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
