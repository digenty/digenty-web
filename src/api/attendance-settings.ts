import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type UpdateAttendanceSettingsPayload = {
  sessionsPerDay: 1 | 2;
  effectiveFrom?: string;
};

export const getAttendanceSettings = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/attendance-settings${branchId ? `?branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAttendanceSettingsByLevel = async (levelId: number) => {
  try {
    const { data } = await api.get(`/attendance-settings/level/${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAttendanceSettings = async (levelId: number, payload: UpdateAttendanceSettingsPayload) => {
  try {
    const { data } = await api.put(`/attendance-settings/level/${levelId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
