import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getLevels = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/class-levels/names${branchId ? `?branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
