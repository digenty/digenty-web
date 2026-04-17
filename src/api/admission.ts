import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AdmissionNumberPayload, UpdateAdmissionNumber } from "./types";

export const addAdmissionNumberSetup = async (payload: AdmissionNumberPayload) => {
  try {
    const { data } = await api.post("/admission/number", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAdmissionNumber = async () => {
  try {
    const { data } = await api.get(`/admission/number`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAdmissionNumber = async (payload: UpdateAdmissionNumber, id: number) => {
  try {
    const { data } = await api.put(`/admission/number/${id}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
