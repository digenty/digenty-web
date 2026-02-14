import api from "@/lib/axios/axios-auth";
import { useQuery } from "@tanstack/react-query";
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

export const getTeacherClass = async () => {
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

// To put in another branch
export const getClassTeachersInClass = async (classId: number) => {
  try {
    const data = await api.get(`/report/subject/arm/${classId}?page=0&size=15`);
    return data.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.message;
    }

    throw error;
  }
};
