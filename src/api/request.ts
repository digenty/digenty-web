import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { BranchEditRequestTypes } from "@/components/ClassesAndSubjects/AllBranches/ManagaeEditRequests/types";

export const getEditRequests = async (branchId: number, search?: string): Promise<{ data: BranchEditRequestTypes[] }> => {
  try {
    const { data } = await api.get(`/edit-access/branch/${branchId}${search ? `?search=${search}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
