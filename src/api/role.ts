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

export const getRoles = async ({ search }: { search: string }) => {
  try {
    const { data } = await api.get(`/role?search=${search}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
