import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AssessmentDefaultPayload, AssessmentPayload } from "./types";

export const addAssessmentDefault = async (payload: AssessmentDefaultPayload) => {
  try {
    const { data } = await api.post("/assessments/school-default", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addAssessment = async (payload: AssessmentPayload) => {
  try {
    const { data } = await api.post("/assessments/branch-level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
