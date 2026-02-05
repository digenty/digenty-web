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

export const getStudents = async ({ pagination, branchId, classId }: { pagination: Pagination; branchId?: number; classId?: number }) => {
  try {
    const { data } = await api.get(
      `/students/school?size=${pagination.limit}&page=${pagination.page - 1}${branchId ? `&branchId=${branchId}` : ""}${classId ? `&classId=${classId}` : ""}`,
    ); // page starts from 0
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const uploadStudents = async ({ file }: { file: File | null }) => {
  try {
    const { data } = await api.post("/students/upload", file);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
