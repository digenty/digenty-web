import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

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
