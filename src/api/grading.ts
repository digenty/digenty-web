import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { UpdateGradingDefaultPayload } from "./types";

export const getClassGrading = async (classId: number) => {
  try {
    const { data } = await api.get(`/gradings/class/${classId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getSchoolGradings = async () => {
  try {
    const { data } = await api.get(`gradings/school`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getBranchGradings = async (branchId: number) => {
  try {
    const { data } = await api.get(`/gradings/branch/${branchId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateSchoolGradings = async (payload: UpdateGradingDefaultPayload) => {
  try {
    const { data } = await api.put(`/gradings/branch/`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
