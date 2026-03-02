import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getClassGrading = async (classId: number, branchId: number) => {
  try {
    const { data } = await api.get(`/gradings/branch/${branchId}/class/${classId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
