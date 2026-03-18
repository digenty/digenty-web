import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

type AddSubjectPayload = {
  name: string;
  levelId: number;
  branchId: number;
};

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

export const getSubjectStudents = async (subjectId: number, armId: number) => {
  try {
    const data = await api.get(`/report/subject/${subjectId}/arm/${armId}?page=0&size=100`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getBranchTeachersClassSubjects = async (armId: number) => {
  try {
    const data = await api.get(`/report/subject/arm/${armId}?page=0&size=15`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getSubjectsByLevel = async (levelId?: number, branchId?: number) => {
  try {
    const { data } = await api.get(`/subjects/level?levelId=${levelId}${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const addSubject = async (payload: AddSubjectPayload) => {
  try {
    const { data } = await api.post("/subjects/level", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteSubjectByLevel = async (subjectId: number, levelId: number) => {
  try {
    const { data } = await api.delete(`/subjects/level?subjectId=${subjectId}&levelId=${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
