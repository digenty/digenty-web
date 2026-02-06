import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getTeacherSubjects = async () => {
  try {
    const data = await api.get("/teacher/subject/my");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
