import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

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
