import { CreateSchoolTypes } from "@/components/Onboarding/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { updateSchoolPayload } from "./types";

export const addSchool = async (payload: CreateSchoolTypes) => {
  try {
    const { data } = await api.post("/schools", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateSchool = async (payload: updateSchoolPayload) => {
  try {
    const { data } = await api.put("/schools", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getSchools = async () => {
  try {
    const { data } = await api.get("/schools");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
