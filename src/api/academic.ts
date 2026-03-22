import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { SchoolStructurePayload } from "./types";

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
