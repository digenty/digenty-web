import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

type UpdateLevelPayload = {
  levelId: number;
  levelType: "CRECHE" | "KINDERGARTEN" | "NURSERY" | "PRIMARY" | "JUNIOR_SECONDARY" | "SENIOR_SECONDARY";
  levelName: string;
  classNamePrefix: string;
  classStart: number;
  classEnd: number;
  branchSpecific: boolean;
};

export const getLevels = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/class-levels/names${branchId ? `?branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateLevel = async (payload: UpdateLevelPayload) => {
  try {
    const { data } = await api.put("/class-levels", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getLevelResultSettings = async (levelId: number, filter: string) => {
  try {
    const { data } = await api.get(`/result-settings/level?levelId=${levelId}&filter=${filter}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getAssessmentsByLevel = async (levelId: number) => {
  try {
    const { data } = await api.get(`/assessments/level?levelId=${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getGradingsByLevel = async (levelId: number) => {
  try {
    const { data } = await api.get(`/gradings/level?levelId=${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
