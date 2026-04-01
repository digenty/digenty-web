import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

interface EditAccessPayload {
  reason?: string;
  additionalDetails?: string;
  armId?: number;
  classId?: number;
  subjectId?: number;
}

export const getClasses = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/classes?page=0&size=100${branchId ? `&branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const assignClassTeacher = async (payload: { armDtos: { armId: number }[]; teacherId: number }) => {
  try {
    const { data } = await api.post("/teacher/class", payload);
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
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassTeachersInClass = async (armId: number) => {
  try {
    const data = await api.get(`/report/subject/arm/${armId}?page=0&size=100`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};

export const getClassReport = async (armId?: number, termId?: number) => {
  try {
    const { data } = await api.get(`/report/class/arm/${armId}?termId=${termId}&page=0&size=100`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassCumulativeReport = async (armId?: number) => {
  try {
    const { data } = await api.get(`/report/class/arm/${armId}/cumulative-report?page=0&size=100`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassReportPromotion = async (armId: number) => {
  try {
    const { data } = await api.get(`/report/class/arm/${armId}/cumulative-report`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getStudentClassReport = async (studentId: number, armId: number) => {
  try {
    const { data } = await api.get(`/report-card/student/${studentId}/arm/${armId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const requestEditAccess = async (payload: EditAccessPayload) => {
  try {
    const { data } = await api.post("/edit-access", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassesByLevel = async (levelId?: number) => {
  try {
    const { data } = await api.get(`/classes/details/level/${levelId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const deleteClass = async (classroomId: number) => {
  try {
    const { data } = await api.delete(`/classes/${classroomId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getClassLevels = async () => {
  try {
    const { data } = await api.get(`/class-levels/names`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getClassDetails = async (classId: number | null) => {
  try {
    const { data } = await api.get(`/classes/${classId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const submitClassReport = async (payload: { classArmReportId: number; status: string }) => {
  try {
    const { data } = await api.put("/report/class/arm", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const setPromotionDecision = async (payload: {
  armId: number;
  sessionId: number;
  decisions: {
    studentId: number;
    status: string;
    toClassId?: number;
    toArmId?: number;
  }[];
}) => {
  try {
    const { data } = await api.post("/student-promotion/submit", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getRequiredSubjectReport = async (armId: number) => {
  try {
    const { data } = await api.get(`/report/class/arm/${armId}/required-subject-report`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateClass = async (payload: { classId: number | null; name: string }) => {
  try {
    const { data } = await api.put("/classes", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
