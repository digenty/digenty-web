import api from "@/lib/axios/axios-auth";
import { PrincaleCommentPayload, ResultCalculationPayload, ResultSubmissionPayload, UpdateSubmissionDeadlinePayload } from "./types";
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

export const getSubmissionDeadline = async () => {
  try {
    const { data } = await api.get(`/result-settings/submission-deadline`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }
    throw error;
  }
};
export const updateSubmissionDeadline = async (payload: UpdateSubmissionDeadlinePayload) => {
  try {
    const { data } = await api.put(`/result-settings/submission-deadline/`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
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

export const getPrincipalComment = async () => {
  try {
    const { data } = await api.get(`/result-settings/principal-comment`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
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

export const deletePrincipalComment = async (commentId: number) => {
  try {
    const { data } = await api.delete(`/result-settings/principal-comment/${commentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }
    throw error;
  }
};
