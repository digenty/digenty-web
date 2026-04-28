import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getUserProfileDetails = async () => {
  try {
    const { data } = await api.get("/users/profile");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export interface UpdateUserProfilePayload {
  image?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  timezone?: string;
}

export const updateUserProfile = async (payload: UpdateUserProfilePayload) => {
  try {
    const { data } = await api.put("/users", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
