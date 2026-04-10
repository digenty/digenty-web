import api from "@/lib/axios/axios-auth";
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

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

type ResetPasswordPayload = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
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

export const reAuthenticateUser = async () => {
  try {
    const { data } = await api.get("/reauth/token");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const forgetPassword = async (email: string) => {
  try {
    const { data } = await apiPublic.post("/auth/forgot-password", { email });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const verifyOtp = async (payload: VerifyOtpPayload) => {
  try {
    const { data } = await apiPublic.post("/auth/verify-otp", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const { data } = await apiPublic.post("/auth/reset-password", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
