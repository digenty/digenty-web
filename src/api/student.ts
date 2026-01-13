import { StudentInputType } from "@/components/StudentAndParent/types";
import api from "@/lib/axios/axios-auth";
import { Pagination } from "@/types";
import { isAxiosError } from "axios";

export const addStudent = async (payload: StudentInputType) => {
  try {
    const { data } = await api.post("/students", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getStudents = async ({ pagination }: { pagination: Pagination }) => {
  try {
    const { data } = await api.get(`/students?size=${pagination.limit}&page=${pagination.page}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
