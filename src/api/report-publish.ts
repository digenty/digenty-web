import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

const termQuery = (termId?: number) => (termId ? `?termId=${termId}` : "");

// Term report publishing, per branch. Separate from the mid-term report (see api/midterm.ts).
export const publishBranchReports = async ({ branchId, termId }: { branchId: number; termId?: number }) => {
  try {
    const { data } = await api.put(`/report/class/arm/branch/${branchId}/publish${termQuery(termId)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const unpublishBranchReports = async ({ branchId, termId }: { branchId: number; termId?: number }) => {
  try {
    const { data } = await api.put(`/report/class/arm/branch/${branchId}/unpublish${termQuery(termId)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
