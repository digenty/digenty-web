import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type ResetRule = "NEVER" | "YEARLY" | "MONTHLY" | "TERMLY" | "SESSION";

export type InvoiceSettingsResponse = {
  id?: number;
  schoolLogoUrl?: string;
  invoicePrefix?: string;
  numberFormat?: string;
  startingNumber?: number;
  padding?: number;
  nextInvoiceNumber?: string;
  defaultDueDate?: string;
  defaultNote?: string;
  resetRule?: ResetRule;
  remindBeforeDays?: number;
  remindAfterDays?: number;
  repeatReminders?: boolean;
  repeatEveryDays?: number;
};

export type CreateInvoiceSettingsPayload = {
  image?: string;
  invoicePrefix?: string;
  numberFormat?: string;
  startNumber?: number;
  numberPadding: string | number;
  defaultDueDate?: string;
  defaultInvoiceNote?: string;
  resetRule?: ResetRule;
  noOfDaysBeforeDueDate?: number;
  noOfDaysAfterDueDate?: number;
  repeatFrequency?: number;
};

export type UpdateInvoiceSettingsPayload = {
  schoolLogoUrl?: string;
  invoicePrefix?: string;
  numberFormat?: string;
  startingNumber?: number;
  padding: number;
  defaultDueDate?: string;
  defaultNote?: string;
  resetRule?: ResetRule;
  remindBeforeDays?: number;
  remindAfterDays?: number;
  repeatReminders?: boolean;
  repeatEveryDays?: number;
};

export const getInvoiceSettings = async () => {
  try {
    const { data } = await api.get(`/invoice-settings`);
    return data;
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

export const updateInvoiceSettings = async (invoiceId: number, payload: UpdateInvoiceSettingsPayload) => {
  try {
    const { data } = await api.put(`/invoice-settings/${invoiceId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
