import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { GradingDefaultPayload, GradingPayload } from "./types";

export const getLevelGrading = async (levelId: number) => {
  try {
    const { data } = await api.get(`/gradings/level${levelId ? `?levelId=${levelId}` : ""}`);
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
    const { data } = await api.post("/gradings/school-default", payload);
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
    const { data } = await api.post("/gradings/branch-default", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
