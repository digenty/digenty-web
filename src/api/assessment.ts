import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { UpdateAssessmentLevelPayload, UpdateASssessmentBranchPayload, UpdateASssessmentDefaultPayload } from "./types";

export const getAssessmentForSchool = async () => {
  try {
    const { data } = await api.get(`/assessments/school-default`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAssessmentForSchool = async (payload: UpdateASssessmentDefaultPayload) => {
  try {
    const { data } = await api.put(`/assessments/school-default`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAssessmentForBranch = async (payload: UpdateASssessmentBranchPayload) => {
  try {
    const { data } = await api.put(`/assessments/school-default`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAssessmentForLevel = async (payload: UpdateAssessmentLevelPayload) => {
  try {
    const { data } = await api.put(`/assessments/school-default`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
