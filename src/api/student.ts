import { StudentInputType } from "@/components/StudentAndParent/types";
import api from "@/lib/axios/axios-auth";
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
