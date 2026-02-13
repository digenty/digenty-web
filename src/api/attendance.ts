import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getAllAttendance = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/attendance?${branchId ? `branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
