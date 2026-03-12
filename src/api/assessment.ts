import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AssessmentDefaultPayload, AssessmentPayload } from "./types";

export const addAssessmentDefault = async (payload: AssessmentDefaultPayload) => {
  try {
    const { data } = await api.post("/assessments/branch-default", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
}

// This is not yet , just put it incase
// export const getAssessmentForSchool = async () => {
//   try {
//     const { data } = await api.get(`assessment/school`);
//     return data;
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       throw error.response?.data;
//     }
//     throw error;
//   }
// };

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
    const { data } = await api.post("/assessments/branch-level", payload);
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
