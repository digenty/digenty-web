import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import type { FeePaymentMode } from "@/api/fee";

export type FeeStatus = "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type InvoiceStatus = "DRAFT" | "UNPAID" | "PARTIALLY_PAID" | "PAID";

export interface ParentInstallment {
  id: number;
  sequence: number;
  percentage: number;
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: FeeStatus;
}

export interface PendingFeeItem {
  studentFeeItemId: number;
  name: string;
  required: boolean;
  amount: number;
  amountPaid: number;
  balance: number;
  status: FeeStatus;
  paymentMode: FeePaymentMode;
  minimumPartPayment: number | null;
  payableAmounts: number[] | null;
  installments?: ParentInstallment[];
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
  paymentProofUrl: string;
}

export interface InvoiceLineItem {
  name: string;
  amount: number;
  amountPaid: number;
  balance: number;
}

export interface InvoiceAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  // bankCode: string;
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
  collectionAccount: InvoiceAccount;
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
