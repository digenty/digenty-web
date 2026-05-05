import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type FeeInvoiceItem = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export type FeeInvoiceResponse = {
  id: number;
  classStudent: string;
  termId: number;
  termLabel: string;
  totalAmount: number;
  items: FeeInvoiceItem[];
};

export type FeeGroupInvoiceItem = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export type FeeGroupInvoiceResponse = {
  id: number;
  name: string;
  totalAmount: number;
  items: FeeGroupInvoiceItem[];
};

export const getFeesForInvoice = async ({
  branchId,
  classId,
  termId,
  search = "",
}: {
  branchId: number;
  classId?: number;
  termId?: number;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/fees?branchId=${branchId}${classId ? `&classId=${classId}` : ""}${termId ? `&termId=${termId}` : ""}${search ? `&search=${search}` : ""}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroupsForInvoice = async ({ branchId, search = "" }: { branchId: number; search?: string }) => {
  try {
    const { data } = await api.get(`/fee-groups?branchId=${branchId}${search ? `&search=${search}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
