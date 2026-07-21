import type { Enums } from "@/types/database";

export type ExpenseCategory = Enums<"expense_category">;

export const CATEGORIES = [
  "交通費",
  "宿泊",
  "食費",
  "観光",
  "その他",
] as const satisfies readonly ExpenseCategory[];

export const CATEGORY_META: Record<
  ExpenseCategory,
  { color: string; emoji: string }
> = {
  交通費: { color: "#3b82f6", emoji: "🚃" },
  宿泊: { color: "#8b5cf6", emoji: "🏨" },
  食費: { color: "#f59e0b", emoji: "🍜" },
  観光: { color: "#10b981", emoji: "🗺️" },
  その他: { color: "#94a3b8", emoji: "📦" },
};
