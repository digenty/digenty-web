import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

type AttendancePayload = {
  armId?: number;
  date?: string;
};

type Attendance = {
  studentId: number;
  isPresent: boolean;
};

type markAttendancePayload = {
  attendanceId: number;
  studentAttendanceList: Attendance[];
};

type markAllAttendancePayload = {
  armId: number;
  date: string;
  isPresent: boolean;
};

export const getAllAttendance = async (branchId?: number, termId?: number) => {
  try {
    const { data } = await api.get(`/attendance?${branchId ? `branchId=${branchId}` : ""}${termId ? `${branchId ? "&" : ""}termId=${termId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const createAttendanceSheet = async (payload: AttendancePayload) => {
  try {
    const { data } = await api.post("/attendance", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getArmAttendance = async ({ armId, date, limit, page }: { armId: number; date?: string; limit?: number; page?: number }) => {
  try {
    const { data } = await api.get(`/attendance/arm/${armId}?size=${limit}&page=${page}${date ? `date=${date}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getTermSheet = async (armId: number) => {
  try {
    const { data } = await api.get(`/attendance/term-sheet/arm/${armId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const markAttendance = async (payload: markAttendancePayload) => {
  try {
    const { data } = await api.post("/attendance/mark", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const markAllAttendance = async (payload: markAllAttendancePayload) => {
  try {
    const { data } = await api.post("/attendance/mark-all", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
