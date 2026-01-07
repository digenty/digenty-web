import apiPublic from "@/lib/axios/axios-public";
import { isAxiosError } from "axios";

type Payload = {
  email: string;
  password: string;

  // Remove these when the BE removes it
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

// export const signup = async (payload: Payload): Promise<Payload[]> => {
export const signup = async (payload: Payload) => {
  try {
    const { data } = await apiPublic.post("/auth/register", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const login = async (payload: Payload) => {
  try {
    const { data } = await apiPublic.post("/auth/login", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
