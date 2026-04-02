import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { GradingDefaultPayload, GradingPayload } from "./types";
import { UpdateGradingDefaultPayload } from "./types";

export const getClassGrading = async (classId: number) => {
  try {
    const { data } = await api.get(`/gradings/class${classId ? `?classId=${classId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addGradingDefault = async (payload: GradingDefaultPayload) => {
  try {
    const { data } = await api.post("/gradings/branch-default", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addGrading = async (payload: GradingPayload) => {
  try {
    const { data } = await api.post("/gradings/level", payload);
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
