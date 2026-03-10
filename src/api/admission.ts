import api from "@/lib/axios/axios-auth";
<<<<<<< HEAD
import { AdmissionNumberPayload } from "./types";
import { isAxiosError } from "axios";

export const addAdmissionNumberSetup = async (payload: AdmissionNumberPayload) => {
  try {
    const { data } = await api.post("/admission/number", payload);
=======
import { isAxiosError } from "axios";
import { UpdateAdmissionNumber } from "./types";

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
>>>>>>> 12680bd (consume get and post api for the school structure and the admission number)
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
