import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type PaymentCurrency = "NGN" | "USD" | "GBP" | "EUR";
export type PaymentType = "FULL" | "PARTIAL" | "CUSTOM";

export interface PaymentRequestDto {
  invoiceId: number;
  email: string;
  currency: PaymentCurrency;
  paymentType: PaymentType;
  callBackUrl: string;
  selectedFeeIds?: number[];
  customAmount?: number;
}

export interface PaymentBreakdown {
  description: string;
  currency: PaymentCurrency;
  invoiceAmount: number;
  serviceCharge: number;
  subtotal: number;
  paystackFee: number;
  totalAmount: number;
}

export interface PaymentResponseDto {
  authorizationUrl: string;
  reference: string;
  currency: PaymentCurrency;
  invoiceAmount: number;
  serviceCharge: number;
  paystackFee: number;
  totalAmount: number;
  breakdown?: PaymentBreakdown;
}

export const initiatePayment = async (payload: PaymentRequestDto): Promise<PaymentResponseDto> => {
  try {
    const { data } = await api.post("/api/payments/initiate", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export type InvoicePaymentStatus = "DRAFT" | "UNPAID" | "PARTIALLY_PAID" | "PAID";

export interface StudentInvoiceDto {
  invoiceId: number;
  invoiceNumber: string;
  studentId: number;
  studentName: string;
  className: string;
  currency: PaymentCurrency;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoicePaymentStatus;
  dueDate: string;
}

export const getStudentInvoice = async (invoiceId: number, currency?: PaymentCurrency): Promise<StudentInvoiceDto> => {
  try {
    const qs = currency ? `?currency=${currency}` : "";
    const { data } = await api.get(`/api/payments/invoice/${invoiceId}${qs}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
