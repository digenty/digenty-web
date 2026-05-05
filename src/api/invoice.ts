import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type CreateInvoicePayload = {
  studentIds: number[];
  invoiceNumber: string;
  termId: number;
  issuedDate: string;
  dueDate: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    required: boolean;
    stockItemId: number;
    feeId: number;
    feeGroupItemId: number;
  }[];
  subtotal: number;
  note: string;
  showAccountDetails: boolean;
  paymentStatus: "UNPAID" | "PAID" | "PARTIALLY_PAID";
  payment?: {
    method: string;
    terminalTransactionId: string | null;
    paidById: number;
    amount: number;
    transactionDate: string;
  };
};

export type UpdateInvoicePayload = {
  studentIds: number[];
  invoiceNumber: string;
  termId: number;
  issuedDate: string;
  dueDate: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
    required: boolean;
    stockItemId: number;
    feeId: number;
    feeGroupItemId: number;
  }[];
  subtotal: number;
  note: string;
  showAccountDetails: boolean;
  paymentStatus: "UNPAID" | "PAID" | "PARTIALLY_PAID";
};

export type InvoiceSettingsResponse = {
  schoolLogoUrl?: string;
  invoicePrefix?: string;
  numberFormat?: string;
  startingNumber?: number;
  padding?: number;
  nextInvoiceNumber?: string;
  defaultDueDate?: string;
  defaultNote?: string;
  remindBeforeDays?: number;
  remindAfterDays?: number;
  repeatReminders?: boolean;
  repeatEveryDays?: number;
};

export type UpdateInvoiceSettingsPayload = {
  schoolLogoUrl?: string;
  invoicePrefix?: string;
  numberFormat?: string;
  startingNumber?: number;
  padding?: number;
  defaultDueDate?: string;
  defaultNote?: string;
  remindBeforeDays?: number;
  remindAfterDays?: number;
  repeatReminders?: boolean;
  repeatEveryDays?: number;
};
export type PaymentHistoryEntry = {
  id: number;
  date: string;
  amount: number;
  method: string;
  paidBy: { id: number; name: string; avatar?: string };
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  addedBy?: string;
  note?: string;
};

export type PaymentHistoryResponse = {
  content: PaymentHistoryEntry[];
  totalElements: number;
  page: number;
  size: number;
};

export type AddPaymentPayload = {
  transactionDate: string;
  method: string;
  terminalTransactionId: string | null;
  paidById: number;
  amount: number;
  note: string;
};

export const updateInvoice = async (invoiceId: string, payload: UpdateInvoicePayload) => {
  try {
    const { data } = await api.put(`/invoices/${invoiceId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const createInvoice = async (payload: CreateInvoicePayload) => {
  try {
    const { data } = await api.post("/invoices", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const createInvoiceDraft = async (payload: CreateInvoicePayload) => {
  try {
    const { data } = await api.post("/invoices/draft", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getInvoiceDetail = async (invoiceId: string) => {
  try {
    const { data } = await api.get(`/invoices/detail/${invoiceId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getNextInvoiceNumber = async (branchId: number) => {
  try {
    const { data } = await api.get(`/invoices/next-number?branchId=${branchId}`);
    return data as Record<string, string>;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export type CreateInvoiceSettingsPayload = UpdateInvoiceSettingsPayload & {
  branchId: number;
};

export const getInvoiceSettings = async (branchId: number) => {
  try {
    const { data } = await api.get(`/invoice-settings?branchId=${branchId}`);
    return data as InvoiceSettingsResponse;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createInvoiceSettings = async (payload: CreateInvoiceSettingsPayload) => {
  try {
    const { data } = await api.post("/invoice-settings", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateInvoiceSettings = async (branchId: number, payload: UpdateInvoiceSettingsPayload) => {
  try {
    const { data } = await api.put(`/invoice-settings?branchId=${branchId}`, payload);
    return data as InvoiceSettingsResponse;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getPaymentHistory = async (invoiceId: string, page = 0, size = 10) => {
  try {
    const { data } = await api.get(`/invoices/${invoiceId}/payments?page=${page}&size=${size}`);
    return data as PaymentHistoryResponse;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const sendInvoiceReminder = async (invoiceId: string) => {
  try {
    const { data } = await api.post(`/invoices/${invoiceId}/send-reminder`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteInvoice = async (invoiceId: string) => {
  try {
    const { data } = await api.delete(`/invoices/${invoiceId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addPayment = async (invoiceId: string, payload: AddPaymentPayload) => {
  try {
    const { data } = await api.post(`/invoices/${invoiceId}/payments`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updatePayment = async (invoiceId: string, paymentId: string, payload: AddPaymentPayload) => {
  try {
    const { data } = await api.put(`/invoices/${invoiceId}/payments/${paymentId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getInvoicesByBranch = async ({
  branchId,
  page,
  size,
  classId,
  termId,
  search,
}: {
  branchId: number;
  page: number;
  size: number;
  classId?: number;
  termId?: number;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/invoices/${branchId}?page=${page}&size=${size}${classId ? `&classId=${classId}` : ""}${termId ? `&termId=${termId}` : ""}${search ? `&search=${search}` : ""}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
