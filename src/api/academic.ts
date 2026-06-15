import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { SchoolStructurePayload, UpdateAcademicPayload } from "./types";

export interface AcademicSession {
  id: number;
  uuid: string;
  name: string;
  isActive: boolean;
  schoolId: number;
}

export const getSessions = async (): Promise<AcademicSession[]> => {
  try {
    const { data } = await api.get(`/academic/session`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

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

export const getActiveSession = async () => {
  try {
    const { data } = await api.get(`/academic/session/active`);
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
