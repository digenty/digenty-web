import { LevelType } from "@/api/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type AddDevelopmentCategoryPayload = {
  name: string;
  displayOrder?: number;
};

export type UpdateLevelSkillsPayload = {
  categoryId: number;
  branchSpecific: boolean;
  levelType?: LevelType;
  levelId?: number | null;
  skills: { id: number | null; name: string }[];
};

export const getDevelopmentCategories = async () => {
  try {
    const { data } = await api.get(`/development-settings/categories`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addDevelopmentCategory = async (payload: AddDevelopmentCategoryPayload) => {
  try {
    const { data } = await api.post(`/development-settings/categories`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateDevelopmentCategory = async (categoryId: number, payload: AddDevelopmentCategoryPayload) => {
  try {
    const { data } = await api.put(`/development-settings/categories/${categoryId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteDevelopmentCategory = async (categoryId: number) => {
  try {
    const { data } = await api.delete(`/development-settings/categories/${categoryId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getDevelopmentSettings = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/development-settings${branchId ? `?branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getDevelopmentSettingsByLevel = async (levelId: number) => {
  try {
    const { data } = await api.get(`/development-settings/level/${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateLevelSkills = async (payload: UpdateLevelSkillsPayload) => {
  try {
    const { data } = await api.put(`/development-settings/level`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
