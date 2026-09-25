import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

type RegisterDevicePayload = {
  token: string;
  platform: "WEB";
  app: "DIGENTY_WEB";
  userAgent: string;
};

export const registerDevice = async (payload: RegisterDevicePayload) => {
  try {
    const { data } = await api.post("/push/devices", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const unregisterDevice = async (token: string) => {
  try {
    const { data } = await api.delete("/push/devices", { data: { token } });
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
