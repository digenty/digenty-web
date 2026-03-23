import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { EditRequestResponseTypes } from "./types";

export const getEditRequests = async (branchId: number, search?: string): Promise<{ data: EditRequestResponseTypes[] }> => {
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

export const getEditRequestBySubjectAndArm = async (subjectId: number, armId: number): Promise<{ data: EditRequestResponseTypes }> => {
  try {
    const { data } = await api.get(`/edit-access/subject/${subjectId}/arm/${armId}`);
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
