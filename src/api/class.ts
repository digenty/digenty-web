import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getClassesForASchool = async () => {
  try {
    const { data } = await api.get("/classes?page=0&size=100");
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassTeacher = async () => {
  try {
    const data = await api.get("/teacher/class/my");

    return data.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
