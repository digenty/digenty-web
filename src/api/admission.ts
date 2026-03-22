import api from "@/lib/axios/axios-auth";
import { AdmissionNumberPayload } from "./types";
import { isAxiosError } from "axios";

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
