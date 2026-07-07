import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type FeeStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type InvoiceStatus = "PAID" | "UNPAID" | "FULLY_PAID" | "DRAFT" | "OUTSTANDING" | "PARTIALLY_PAID";

export interface PendingFeeItem {
  studentFeeItemId: number;
  name: string;
  required: boolean;
  amount: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
}

export interface FeeOverviewResponse {
  studentFeeId: number;
  termName: string;
  outstandingAmount: number;
  totalPaid: number;
  status: FeeStatus;
  pendingItems: PendingFeeItem[];
}

export interface PayFeeResponse {
  studentFeeId: number;
  termName: string;
  requiredFees: PendingFeeItem[];
  optionalFees: PendingFeeItem[];
  totalRequired: number;
  totalPaid: number;
  totalBalance: number;
  status: FeeStatus;
}

export interface FeeItemPayment {
  studentFeeItemId: number;
  amount: number;
}

export interface PayFeeRequest {
  studentFeeId: number;
  items: FeeItemPayment[];
}

export interface InvoiceLineItem {
  name: string;
  amount: number;
  amountPaid: number;
  balance: number;
}

export interface InvoiceResponse {
  invoiceId: number;
  invoiceNumber: string;
  studentName: string;
  className: string;
  termName: string;
  issueDate: string;
  dueDate: string;
  requiredFees: InvoiceLineItem[];
  optionalFees: InvoiceLineItem[];
  totalRequired: number;
  totalOptional: number;
  totalPaid: number;
  totalBalance: number;
  status: InvoiceStatus;
}

export const getFeeOverview = async (studentId: number, termId?: number): Promise<FeeOverviewResponse> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.append("termId", String(termId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/fees/${studentId}${qs ? `?${qs}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getPayFeesData = async (studentId: number, termId?: number): Promise<PayFeeResponse> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.append("termId", String(termId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/fees/${studentId}/pay${qs ? `?${qs}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const recordPayment = async (studentId: number, payload: PayFeeRequest) => {
  try {
    const { data } = await api.post(`/parent/portal/fees/${studentId}/pay`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getInvoice = async (studentId: number, termId?: number): Promise<InvoiceResponse> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.append("termId", String(termId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/fees/${studentId}/invoice${qs ? `?${qs}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
