import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import type { PaymentMethod } from "./invoice";

export type RecurringInterval = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface CreateExpenseDto {
  title: string;
  description?: string;
  amount: number;
  date: string;
  categoryId?: number;
  branchId?: number;
  paymentMethod: PaymentMethod;
  receiptPath?: string;
  recurring?: boolean;
  recurringInterval?: RecurringInterval;
}

export interface EditExpenseDto extends Partial<CreateExpenseDto> {
  expenseId: number;
}

export interface CreateExpenseCategoryDto {
  name: string;
}

export interface EditExpenseCategoryDto {
  expenseCategoryId: number;
  name?: string;
}

export interface SearchExpensesParams {
  branchId?: number;
  categoryId?: number;
  termId?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export interface ExpenseSummaryParams {
  branchId?: number;
  categoryId?: number;
  termId?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const searchExpenses = async ({
  branchId,
  categoryId,
  termId,
  search = "",
  startDate,
  endDate,
  page = 0,
  size = 15,
}: SearchExpensesParams) => {
  try {
    const { data } = await api.get(`/expenses${buildQuery({ branchId, categoryId, termId, search, startDate, endDate, page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getExpenseSummary = async ({ branchId, categoryId, termId }: ExpenseSummaryParams = {}) => {
  try {
    const { data } = await api.get(`/expenses/summary${buildQuery({ branchId, categoryId, termId })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getExpenseById = async (id: number) => {
  try {
    const { data } = await api.get(`/expenses/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createExpense = async (payload: CreateExpenseDto) => {
  try {
    const { data } = await api.post("/expenses", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editExpense = async (payload: EditExpenseDto) => {
  try {
    const { data } = await api.put("/expenses", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteExpense = async (expenseId: number) => {
  try {
    const { data } = await api.delete(`/expenses/${expenseId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAllExpenseCategories = async ({ page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/expense/category${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getExpenseCategoryById = async (id: number) => {
  try {
    const { data } = await api.get(`/expense/category/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createExpenseCategory = async (payload: CreateExpenseCategoryDto) => {
  try {
    const { data } = await api.post("/expense/category", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editExpenseCategory = async (payload: EditExpenseCategoryDto) => {
  try {
    const { data } = await api.put("/expense/category", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteExpenseCategory = async (expenseCategoryId: number) => {
  try {
    const { data } = await api.delete(`/expense/category/${expenseCategoryId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
