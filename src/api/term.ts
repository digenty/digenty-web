import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getTermsBySession = async (schoolId?: number) => {
  try {
    const { data } = await api.get(`/academic/session/school/${schoolId}/terms`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
