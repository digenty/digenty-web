import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const getTeacherSubjects = async () => {
  try {
    const data = await api.get("/teacher/subject/my");
    console.log(data);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getSubjectStudents = async (subjectId: number, amrId: number) => {
  try {
    const data = await api.get(`/report/subject/${subjectId}/arm/${amrId}?page=0&size=15`);

    return data.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
