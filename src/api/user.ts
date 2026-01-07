import api from "@/lib/axios/axios-auth";
import apiPublic from "@/lib/axios/axios-public";
import { isAxiosError } from "axios";

export const getUserByEmail = async (email: string) => {
  try {
    const { data } = await apiPublic.get(`/users/email/lookup/${email}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
