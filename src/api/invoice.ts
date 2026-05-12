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

export type StudentInvoiceEntry = {
  id: number;
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  issuedDate: string;
  dueDate?: string;
  totalAmount: number;
  termId?: number;
};

export type StudentInvoicesPage = {
  content: StudentInvoiceEntry[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type PaymentDetailResponse = {
  id: number;
  transactionDate: string;
  amount: number;
  method: string;
  terminalTransactionId?: string | null;
  paidBy: { id: number; name: string; avatar?: string };
  status: string;
  note?: string;
};

export const getInvoicesByStudent = async (studentId: number, page = 0, size = 20) => {
  try {
    const { data } = await api.get(`/invoices/student/${studentId}?page=${page}&size=${size}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getPaymentById = async (invoiceId: string, paymentId: string) => {
  try {
    const { data } = await api.get(`/invoices/${invoiceId}/payments/${paymentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const downloadInvoicePdf = async (invoiceId: string) => {
  try {
    const response = await api.post(`/invoices/${invoiceId}/pdf`, {}, { responseType: "blob" });
    return response.data as Blob;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
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
  status,
  startDate,
  endDate,
}: {
  branchId: number;
  page: number;
  size: number;
  classId?: number;
  termId?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (classId) params.set("classId", String(classId));
    if (termId) params.set("termId", String(termId));
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const { data } = await api.get(`/invoices/${branchId}?${params.toString()}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export type InvoicePreviewPayment = {
  id: number;
  date: string;
  amount: number;
  method: string;
  status: string;
  paidByName: string;
  note: string;
};

export type InvoicePreviewResponse = {
  school: { name: string; logo: string | null; address: string | null; phone: string | null; email: string | null; currency: string };
  branch: { id: number; name: string; address: string | null; phone: string | null; email: string | null };
  id: number;
  invoiceNumber: string;
  status: string;
  issuedDate: string;
  dueDate: string;
  termName: string;
  billTo: { studentId: number; name: string; avatar: string | null; classLabel: string }[];
  items: { id: number; name: string; quantity: number; price: number; total: number; required: boolean; stockItemId: number; feeId: number }[];
  subtotal: number;
  totalAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  paymentProgress: number;
  payments: InvoicePreviewPayment[];
  accountDetails: null | unknown;
  note: string;
};

export const getInvoicePreview = async (invoiceId: string) => {
  try {
    const { data } = await api.get(`/invoices/${invoiceId}/preview`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
