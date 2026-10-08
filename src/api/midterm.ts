import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { MidtermClassOverviewRow, MidtermPublishPayload, MidtermPublishResponse, MidtermReport } from "./types";

const termQuery = (termId?: number) => (termId ? `?termId=${termId}` : "");

export const getMidtermStudentReport = async ({ studentId, armId, termId }: { studentId: number; armId: number; termId?: number }) => {
  try {
    const { data } = await api.get(`/report/midterm/student/${studentId}/arm/${armId}${termQuery(termId)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getMidtermClassOverview = async ({ armId, termId }: { armId: number; termId?: number }) => {
  try {
    const { data } = await api.get(`/report/midterm/arm/${armId}${termQuery(termId)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const publishMidtermReport = async ({ branchId, ...payload }: MidtermPublishPayload & { branchId: number }) => {
  try {
    const { data } = await api.put(`/report/midterm/branch/${branchId}/publish`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const unpublishMidtermReport = async ({ branchId, termId }: { branchId: number; termId?: number }) => {
  try {
    const { data } = await api.put(`/report/midterm/branch/${branchId}/unpublish${termQuery(termId)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getParentMidtermReport = async (studentId: number, termId?: number): Promise<MidtermReport> => {
  try {
    const { data } = await api.get(`/parent/portal/students/${studentId}/midterm-report${termQuery(termId)}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export type { MidtermClassOverviewRow, MidtermPublishResponse };
