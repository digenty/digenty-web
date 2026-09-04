import type { RecurringInterval } from "@/api/expense";
import type { PaymentMethod } from "@/api/invoice";

export type ExpenseCategoryItem = {
  id: number;
  name: string;
  expenseCount?: number;
  totalExpenses?: number;
  totalAmount?: number;
};

export type ExpenseListItem = {
  id: number;
  title?: string;
  name?: string;
  description?: string;
  amount?: number;
  date?: string;
  categoryId?: number;
  categoryName?: string;
  category?: { id?: number; name?: string } | null;
  branchId?: number;
  branchName?: string;
  branch?: { id?: number; name?: string } | null;
  paymentMethod?: PaymentMethod;
  receiptPath?: string;
  receiptName?: string;
  receiptSize?: number;
  addedByName?: string;
  addedByImagePath?: string;
  addedBy?: { id?: number; name?: string; imagePath?: string } | null;
  recurring?: boolean;
  recurringInterval?: RecurringInterval;
  createdAt?: string;
};

export type ExpenseSummary = {
  totalAmount?: number;
  totalExpenses?: number;
  expenseCount?: number;
  totalCount?: number;
  topCategoryName?: string;
  topCategoryAmount?: number;
  percentageChange?: number;
};

/** Server responses arrive either bare or wrapped in `data`, and paged either as `content` or a plain array. */
export const extractExpenseList = <T>(resp: unknown): { items: T[]; total: number } => {
  if (!resp || typeof resp !== "object") return { items: [], total: 0 };
  const r = resp as { content?: T[]; totalElements?: number; data?: { content?: T[]; totalElements?: number } | T[] };
  if (Array.isArray(r.content)) return { items: r.content, total: r.totalElements ?? r.content.length };
  const data = r.data as { content?: T[]; totalElements?: number } | T[] | undefined;
  if (Array.isArray((data as { content?: T[] })?.content)) {
    const wrapped = data as { content: T[]; totalElements?: number };
    return { items: wrapped.content, total: wrapped.totalElements ?? wrapped.content.length };
  }
  if (Array.isArray(data)) return { items: data as T[], total: (data as T[]).length };
  return { items: [], total: 0 };
};

export const extractExpenseRecord = <T extends { id?: number }>(resp: unknown): T | null => {
  if (!resp || typeof resp !== "object") return null;
  const r = resp as { data?: T } & T;
  if (r.data && typeof r.data === "object" && "id" in r.data) return r.data;
  if ("id" in r) return r;
  return null;
};

export const expenseTitleOf = (expense?: ExpenseListItem | null) => expense?.title ?? expense?.name ?? "";

export const expenseCategoryNameOf = (expense?: ExpenseListItem | null) => expense?.categoryName ?? expense?.category?.name ?? "";

export const expenseBranchNameOf = (expense?: ExpenseListItem | null) => expense?.branchName ?? expense?.branch?.name ?? "";

export const expenseAddedByOf = (expense?: ExpenseListItem | null) => ({
  name: expense?.addedByName ?? expense?.addedBy?.name ?? "",
  imagePath: expense?.addedByImagePath ?? expense?.addedBy?.imagePath,
});

export const formatNaira = (amount?: number | string | null) => `₦${Number(amount ?? 0).toLocaleString()}`;

/** Dates come back ISO (`2024-10-22`) but the design shows `22/10/2024` everywhere. */
export const formatExpenseDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
