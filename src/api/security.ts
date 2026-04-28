import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type ActiveSession = {
  sessionId: number;
  deviceName: string;
  browser: string;
  ipAddress: string;
  lastActiveAt: string;
};

export type SecuritySettingsData = {
  data: {
    passwordStrength: string;
    activeSessions: ActiveSession[];
  };
};

export const getSecuritySettings = async (): Promise<SecuritySettingsData> => {
  try {
    const { data } = await api.get("/security-settings");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const logoutAllSessions = async () => {
  try {
    const { data } = await api.post("/security-settings/logout-all");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
