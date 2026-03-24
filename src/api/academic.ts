import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { SchoolStructurePayload, UpdateAcademicPayload } from "./types";

export const addSchoolStructure = async (payload: SchoolStructurePayload) => {
  try {
    const { data } = await api.post(`/academic/session`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAcademic = async () => {
  try {
    const { data } = await api.get(`/academic/session`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAcademic = async (payload: UpdateAcademicPayload, sessionId: number) => {
  try {
    const { data } = await api.put(`/academic/session/${sessionId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
