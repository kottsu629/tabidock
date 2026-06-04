"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AppHeader from "@/components/AppHeader";

type Trip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  num_people: number;
  total_cost: number;
  is_public: boolean;
};

type Expense = {
  id: string;
  category: string;
  title: string;
  amount: number;
};

type ExpenseCategory = "交通費" | "宿泊" | "食費" | "観光" | "その他";

const CATEGORIES: ExpenseCategory[] = [
  "交通費",
  "宿泊",
  "食費",
  "観光",
  "その他",
];

const CATEGORY_META: Record<ExpenseCategory, { color: string; emoji: string }> =
  {
    交通費: { color: "#3b82f6", emoji: "🚃" },
    宿泊: { color: "#8b5cf6", emoji: "🏨" },
    食費: { color: "#f59e0b", emoji: "🍜" },
    観光: { color: "#10b981", emoji: "🗺️" },
    その他: { color: "#94a3b8", emoji: "📦" },
  };

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    category: "交通費",
    title: "",
    amount: "",
  });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", id)
      .order("category");
    setExpenses(data ?? []);
  };

  const fetchTrip = async () => {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();
    return data as Trip | null;
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      if (userData) setUserName(userData.name);

      const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()]);
      if (!tripData) {
        router.push("/dashboard");
        return;
      }
      setTrip(tripData);
      setLoading(false);
    };
    init();
  }, [id]);

  const refresh = async () => {
    const [tripData] = await Promise.all([fetchTrip(), fetchExpenses()]);
    if (tripData) setTrip(tripData);
  };

  const handleAddExpense = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase.from("expenses").insert({
      trip_id: id,
      category: form.category,
      title: form.title,
      amount: Number(form.amount),
    });
    setAdding(false);
    if (error) {
      setError(error.message);
      return;
    }
    setForm((prev) => ({ ...prev, title: "", amount: "" }));
    await refresh();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await supabase.from("expenses").delete().eq("id", expenseId);
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <p style={{ color: "#94a3b8" }}>読み込み中...</p>
      </div>
    );
  }

  if (!trip) return null;

  const perPerson = Math.round(trip.total_cost / trip.num_people);
  const grouped = CATEGORIES.reduce<Record<string, Expense[]>>(
    (acc, cat) => {
      acc[cat] = expenses.filter((e) => e.category === cat);
      return acc;
    },
    {} as Record<string, Expense[]>,
  );

  const inputStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "9px 14px",
    fontSize: "0.875rem",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <AppHeader userName={userName} onLogout={handleLogout} />

      <main
        style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}
      >
        {/* 戻るリンク */}
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.875rem",
            color: "#64748b",
            textDecoration: "none",
            marginBottom: "24px",
          }}
        >
          ← 旅行一覧へ戻る
        </Link>

        {/* 旅行ヘッダーカード */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              height: "6px",
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
            }}
          />
          <div style={{ padding: "24px" }}>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "6px",
              }}
            >
              {trip.title}
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginBottom: "20px",
              }}
            >
              📍 {trip.destination}（{trip.area}）　📅 {trip.start_date} 〜{" "}
              {trip.end_date}　👥 {trip.num_people}人
            </p>

            {/* 金額サマリ */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: "120px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    marginBottom: "4px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  合計金額
                </p>
                <p
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  ¥{trip.total_cost.toLocaleString()}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: "120px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    marginBottom: "4px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  1人あたり
                </p>
                <p
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#6366f1",
                  }}
                >
                  ¥{perPerson.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 費用追加フォーム */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "16px",
            }}
          >
            費用を追加
          </h2>
          <form onSubmit={handleAddExpense}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <label
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  カテゴリ
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  style={inputStyle}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>
                      {CATEGORY_META[c].emoji} {c}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  flex: 1,
                  minWidth: "140px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  内容
                </label>
                <input
                  type="text"
                  placeholder="例：航空券"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  width: "110px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  金額（円）
                </label>
                <input
                  type="number"
                  placeholder="0"
                  required
                  min={0}
                  value={form.amount}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, amount: e.target.value }))
                  }
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                style={{
                  backgroundColor: "#6366f1",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "9px 20px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  opacity: adding ? 0.6 : 1,
                }}
              >
                {adding ? "追加中..." : "+ 追加"}
              </button>
            </div>
            {error && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#ef4444",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}
          </form>
        </div>

        {/* 費用一覧 */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <div
            style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}
          >
            <h2
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
              }}
            >
              費用一覧
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "0.8rem",
                  color: "#94a3b8",
                  fontWeight: 400,
                }}
              >
                {expenses.length}件
              </span>
            </h2>
          </div>

          {expenses.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "12px" }}>💰</div>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                費用がまだ登録されていません
              </p>
            </div>
          ) : (
            <div>
              {CATEGORIES.filter((cat) => grouped[cat].length > 0).map(
                (cat, i) => (
                  <div key={cat}>
                    {/* カテゴリ行 */}
                    <div
                      style={{
                        padding: "8px 24px",
                        backgroundColor: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderTop: i > 0 ? "1px solid #e2e8f0" : undefined,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: CATEGORY_META[cat].color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color: "#64748b",
                        }}
                      >
                        {CATEGORY_META[cat].emoji} {cat}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.78rem",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        ¥
                        {grouped[cat]
                          .reduce((s, e) => s + e.amount, 0)
                          .toLocaleString()}
                      </span>
                    </div>

                    {/* 明細行 */}
                    {grouped[cat].map((exp) => (
                      <div
                        key={exp.id}
                        style={{
                          padding: "12px 24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #f8fafc",
                        }}
                      >
                        <span
                          style={{ fontSize: "0.875rem", color: "#374151" }}
                        >
                          {exp.title}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              color: "#0f172a",
                            }}
                          >
                            ¥{exp.amount.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              padding: "4px 8px",
                              borderRadius: "6px",
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#ef4444";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "#fef2f2";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "#94a3b8";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor = "transparent";
                            }}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
