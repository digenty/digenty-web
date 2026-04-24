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

export const getAllBranchesDetails = async (termId?: number, search?: string) => {
  try {
    // const { data } = await api.get(`/report/class/arm/school?page=0&size=100${search ? `&search=${search}` : ""}`);
    const { data } = await api.get(`/report/class/arm/school?page=0&size=100`);
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

export const getBranchDetails = async (branchId: number, termId?: number, search?: string, levelId?: number) => {
  try {
    const data = await api.get(
      `/report/class/arm/branch/${branchId}?page=0&size=100${termId ? `&termId=${termId}` : ""}${search ? `&search=${search}` : ""}${levelId ? `&levelId=${levelId}` : ""}`,
    );
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }

    throw error;
  }
};

export const deleteBranch = async (branchId: number) => {
  try {
    const { data } = await api.delete(`/branches/${branchId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
