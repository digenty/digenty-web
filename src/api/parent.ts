import { ParentInputType } from "@/components/StudentAndParent/types";
import api from "@/lib/axios/axios-auth";
import { Pagination } from "@/types";
import { isAxiosError } from "axios";

export const addParent = async (payload: ParentInputType) => {
  try {
    const { data } = await api.post("/parents", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getParents = async ({ pagination }: { pagination: Pagination }) => {
  try {
    const { data } = await api.get(`/parents?size=${pagination.limit}&page=${pagination.page}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
