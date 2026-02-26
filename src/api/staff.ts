import { AddStaffPayload } from "@/components/AllSettings/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const addStaff = async (payload: AddStaffPayload) => {
  try {
    const { data } = await api.post("/staffs", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const getStaff = async ({ limit, pageParam, branchId, search }: { limit: number; pageParam: number; branchId?: number; search?: string }) => {
  try {
    const { data } = await api.get("/staffs", {
      params: {
        size: limit,
        page: pageParam,
        branchId,
        search,
      },
    });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getStaffDetails = async (staffId: number | null) => {
  try {
    const { data } = await api.get(`/staffs/${staffId}/details`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteStaff = async (staffId: number | null) => {
  try {
    const { data } = await api.delete(`/staffs/${staffId}/delete`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const deactivateStaff = async (staffId: number | null) => {
  try {
    const { data } = await api.patch(`/staffs/${staffId}/deactivate`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
