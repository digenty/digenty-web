import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getArmsByClass = async (classId?: number) => {
  try {
    const { data } = await api.get(`/arms/class/${classId}?page=0&size=50`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getArmsByLevel = async (levelId?: number, branchId?: number) => {
  try {
    const { data } = await api.get(`/arms/level?levelId=${levelId}${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
