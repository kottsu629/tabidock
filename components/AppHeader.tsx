"use client";

import Link from "next/link";

type Props = {
  userName?: string;
  onLogout?: () => void;
};

export default function AppHeader({ userName, onLogout }: Props) {
  return (
    <header
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.25rem" }}>✈️</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              TripLog
            </span>
          </div>
        </Link>

        {userName && onLogout && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              {userName}さん
            </span>
            <button
              onClick={onLogout}
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                padding: "6px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                cursor: "pointer",
              }}
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
