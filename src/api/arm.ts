import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { LevelType } from "./types";

type AddArmPayload = {
  names: string[];
  levelType: LevelType;
  branchId?: number;
  branchSpecific: boolean;
};

type AddArmToClassPayload = {
  names: string[];
  className: string;
  levelType: string;
};

export const getArmsByClass = async (classId: number | null) => {
  try {
    const { data } = await api.get(`/arms/class/${classId}?page=0&size=50`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getArmsByLevel = async (levelType?: LevelType, branchId?: number) => {
  try {
    const { data } = await api.get(`/arms/level?levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteArmByLevel = async (armId: number, levelId: number) => {
  try {
    const { data } = await api.delete(`/arms/level?armId=${armId}&levelId=${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addArm = async (payload: AddArmPayload) => {
  try {
    const { data } = await api.post("/arms/level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addArmToClass = async (payload: AddArmToClassPayload) => {
  try {
    const { data } = await api.post("/arms/class", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteArmFromClass = async (armId: number, classId: number) => {
  try {
    const { data } = await api.delete(`/arms/class?armId=${armId}&classId=${classId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
