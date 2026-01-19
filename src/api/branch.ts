import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getBranchesForASchool = async () => {
  try {
    const { data } = await api.get(`/branch`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
