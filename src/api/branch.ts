import { CreateBranchPayload } from "@/components/Onboarding/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const addBranch = async (payload: CreateBranchPayload) => {
  try {
    const { data } = await api.post(`/branches`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

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
