import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { ArmCommentsPayload, ArmCommentsResponse, ArmCommentsStudent, LevelMidtermSetting, MidtermFormat, StudentCommentsPayload } from "./types";

const rethrow = (error: unknown): never => {
  if (isAxiosError(error)) throw error.response?.data;
  throw error;
};

export const getMidtermSettings = async (branchId?: number): Promise<LevelMidtermSetting[]> => {
  try {
    const { data } = await api.get(`/midterm-settings${branchId ? `?branchId=${branchId}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const getMidtermSettingForLevel = async (levelId: number): Promise<LevelMidtermSetting> => {
  try {
    const { data } = await api.get(`/midterm-settings/level/${levelId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const setLevelMidtermFormat = async ({ levelId, format }: { levelId: number; format: MidtermFormat }): Promise<LevelMidtermSetting> => {
  try {
    const { data } = await api.put(`/midterm-settings/level/${levelId}`, { format });
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const setClassMidtermFormat = async ({ classId, format }: { classId: number; format: MidtermFormat }): Promise<LevelMidtermSetting> => {
  try {
    const { data } = await api.put(`/midterm-settings/class/${classId}`, { format });
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const resetClassMidtermFormat = async (classId: number): Promise<LevelMidtermSetting> => {
  try {
    const { data } = await api.delete(`/midterm-settings/class/${classId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const getArmMidtermComments = async ({ armId, termId }: { armId: number; termId?: number }): Promise<ArmCommentsResponse> => {
  try {
    const { data } = await api.get(`/report/midterm/comments/arm/${armId}${termId ? `?termId=${termId}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const saveArmMidtermComments = async ({ armId, payload }: { armId: number; payload: ArmCommentsPayload }): Promise<ArmCommentsResponse> => {
  try {
    const { data } = await api.post(`/report/midterm/comments/arm/${armId}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};

export const saveStudentMidtermComments = async ({
  studentId,
  armId,
  payload,
}: {
  studentId: number;
  armId: number;
  payload: StudentCommentsPayload;
}): Promise<ArmCommentsStudent> => {
  try {
    const { data } = await api.post(`/report/midterm/comments/student/${studentId}/arm/${armId}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    return rethrow(error);
  }
};
