import api from "@/lib/axios/axios-auth";
import { PrincaleCommentPayload, ResultCalculationPayload, ResultSubmissionPayload } from "./types";
import { isAxiosError } from "axios";

export const addResultCalculations = async (payload: ResultCalculationPayload) => {
  try {
    const { data } = await api.post(`/result-settings`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addSubmission = async (payload: ResultSubmissionPayload) => {
  try {
    const { data } = await api.post(`/result-settings/submission-deadline`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addPrincipaleComment = async (payload: PrincaleCommentPayload) => {
  try {
    const { data } = await api.post(`/result-settings/principal-comment`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
