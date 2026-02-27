import { CreateBranchPayload } from "@/components/Onboarding/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { UpdateBranchPayload } from "./types";

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
    const { data } = await api.get("/branches?page=0&size=100");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateBranch = async (payload: UpdateBranchPayload) => {
  try {
    const { data } = await api.put(`/branches`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
