import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AddRolePayload } from "@/components/AllSettings/types";

export const addRole = async (payload: AddRolePayload) => {
  try {
    const { data } = await api.post("/role", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const getRoles = async (search?: string) => {
  try {
    const { data } = await api.get(`/role${search ? `?search=${search}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteRole = async (roleId?: number) => {
  try {
    const { data } = await api.delete(`/role/${roleId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const updateRole = async (payload: AddRolePayload & { roleId: number }) => {
  try {
    const { data } = await api.put("/role", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const getRole = async (roleId: number) => {
  try {
    const { data } = await api.get(`/role/${roleId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
