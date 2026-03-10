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

export const getRequestEdit = async (branchId: number) => {
  try {
    const { data } = await api.get(`/edit-access/branch/${branchId}`);

    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const approveEditRequest = async (editAccessId: number, isApproved: boolean) => {
  try {
    const data = await api.post("/edit-access/approve", {
      editAccessId,
      isApproved,
    });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }
    throw error;
  }
};

export const approveEditRequestBulk = async (editAccessIds: number[], isApproved: boolean) => {
  try {
    const data = await api.post("/edit-access/approve/all", {
      editAccessIds,
      isApproved,
    });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }
    throw error;
  }
};

export const getBranchDetails = async (branchId: number, termId?: number) => {
  try {
    const data = await api.get(`/report/class/arm/branch/${branchId}?page=0&size=100${termId ? `&termId=${termId}` : ""}`);
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
