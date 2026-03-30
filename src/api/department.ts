import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { LevelType } from "./types";

export const getDepartmentsForASchool = async () => {
  try {
    const { data } = await api.get("/departments?page=0&size=100");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addDepartmentsToLevel = async (payload: { names: string[]; levelType: LevelType; branchId?: number; branchSpecific: boolean }) => {
  try {
    const { data } = await api.post("/departments/level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getDepartmentsByLevel = async (levelType?: string, branchId?: number) => {
  try {
    const { data } = await api.get(`/departments/level?levelType=${levelType}${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteDepartmentFromLevel = async (departmentId: number, levelId: number) => {
  try {
    const { data } = await api.delete(`/departments/level?departmentId=${departmentId}&levelId=${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
