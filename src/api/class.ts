import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getClassTeacher = async () => {
  try {
    const data = await api.get("/teacher/class/my");
    console.log(data);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.log(error);
      throw error.response?.data;
    }
    throw error;
  }
};
