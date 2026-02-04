import { CreateSchoolTypes } from "@/components/Onboarding/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const addSchool = async (payload: CreateSchoolTypes) => {
  try {
    const { data } = await api.post("/schools", payload);
    console.log(data);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
