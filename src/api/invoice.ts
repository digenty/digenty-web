import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { InvoiceSettingPayload } from "./types";

export const addInvoiceSetting = async (payload: InvoiceSettingPayload) => {
  try {
    const { data } = await api.post(`/invoice-settings`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
