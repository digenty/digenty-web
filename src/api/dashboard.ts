import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { DashboardAlert } from "@/components/Alert/type";

export const getDashboardInfo = async (termId: number | null, branchId: number | null) => {
  try {
    const { data } = await api.get(`/admin/dashboard?${termId ? `termId=${termId}` : ""}${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getDashboardAlerts = async (termId: number | null, branchId: number | null): Promise<DashboardAlert[]> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.set("termId", String(termId));
    if (branchId) params.set("branchId", String(branchId));
    const { data } = await api.get(`/admin/dashboard/alerts${params.toString() ? `?${params.toString()}` : ""}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export type DashboardLevel = {
  levelType: string;
  name: string;
  classCount: number;
};

export const getDashboardLevels = async (branchId: number | null): Promise<DashboardLevel[]> => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.set("branchId", String(branchId));
    const { data } = await api.get(`/admin/dashboard/levels${params.toString() ? `?${params.toString()}` : ""}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export type ClassPaymentCompletion = {
  classId: number;
  className: string;
  levelType: string;
  billedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paidPercentage: number;
  unpaidPercentage: number;
  studentsBilled: number;
  studentsOwing: number;
};

export type ClassPaymentCompletionResponse = {
  termId: number;
  termLabel: string;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  paidPercentage: number;
  unpaidPercentage: number;
  classes: ClassPaymentCompletion[];
};

export const getClassPaymentCompletion = async (
  termId: number | null,
  branchId: number | null,
  levelType?: string,
): Promise<ClassPaymentCompletionResponse> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.set("termId", String(termId));
    if (branchId) params.set("branchId", String(branchId));
    if (levelType) params.set("levelType", levelType);
    const { data } = await api.get(`/admin/dashboard/class-payment-completion${params.toString() ? `?${params.toString()}` : ""}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
