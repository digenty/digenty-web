import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AssessmentDefaultPayload, AssessmentPayload, MidtermAssessmentPayload } from "./types";

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

export const getAssessmentDefault = async () => {
  try {
    const { data } = await api.get("/assessments/school-default");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAssessmentForBranch = async (branchId: number) => {
  try {
    const { data } = await api.get(`/assessment/branch/${branchId}`);
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
    const { data } = await api.post("/assessments/level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAssessmentForLevel = async (payload: AssessmentPayload) => {
  try {
    const { data } = await api.put("/assessments/level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAssessmentForSchoolLevel = async () => {
  try {
    const { data } = await api.get(`/assessments/class`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateMidtermAssessments = async (payload: MidtermAssessmentPayload) => {
  try {
    const { data } = await api.patch("/assessments/midterm", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

// Almost always refused (scores entered, or the rest would no longer add up to 100). Users should remove a
// component by editing the full setup and redistributing its weight in the same save instead.
export const deleteAssessment = async (assessmentId: number) => {
  try {
    const { data } = await api.delete(`/assessments/${assessmentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
