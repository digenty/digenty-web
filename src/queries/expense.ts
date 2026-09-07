import type { RecurringInterval } from "@/api/expense";

export const expenseKeys = {
  all: ["expenses"] as const,
  search: (
    branchId?: number,
    categoryId?: number,
    termId?: number,
    search?: string,
    startDate?: string,
    endDate?: string,
    page?: number,
    size?: number,
  ) => ["expenses", "search", branchId, categoryId, termId, search, startDate, endDate, page, size] as const,
  summary: (branchId?: number, categoryId?: number, termId?: number) => ["expenses", "summary", branchId, categoryId, termId] as const,
  detail: (id: number) => ["expenses", "detail", id] as const,

  categories: (page?: number, size?: number) => ["expenseCategories", page, size] as const,
  categoryDetail: (id: number) => ["expenseCategories", "detail", id] as const,

  createExpense: ["createExpense"] as const,
  editExpense: ["editExpense"] as const,
  deleteExpense: ["deleteExpense"] as const,

  createCategory: ["createExpenseCategory"] as const,
  editCategory: ["editExpenseCategory"] as const,
  deleteCategory: ["deleteExpenseCategory"] as const,
};

export const RECURRING_INTERVAL_CONFIG: Record<RecurringInterval, { label: string; everyLabel: string }> = {
  DAILY: { label: "Daily", everyLabel: "day" },
  WEEKLY: { label: "Weekly", everyLabel: "week" },
  MONTHLY: { label: "Monthly", everyLabel: "month" },
  QUARTERLY: { label: "Quarterly", everyLabel: "quarter" },
  YEARLY: { label: "Yearly", everyLabel: "year" },
};

export const EXPENSE_PERIOD_CONFIG = {
  THIS_MONTH: { label: "This Month" },
  LAST_MONTH: { label: "Last Month" },
  THIS_TERM: { label: "This Term" },
  THIS_SESSION: { label: "This Session" },
  CUSTOM: { label: "Custom Range" },
} as const;

export type ExpensePeriod = keyof typeof EXPENSE_PERIOD_CONFIG;
