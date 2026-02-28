import { getSessionToken } from "@/app/actions/auth";
import { StudentInputType, StudentsStatus } from "@/components/StudentAndParent/types";
import api from "@/lib/axios/axios-auth";
import axios, { isAxiosError } from "axios";

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

export const getStudents = async ({
  limit,
  pageParam,
  branchId,
  classId,
  departmentId,
  armId,
  status,
  search,
}: {
  limit: number;
  pageParam: number;
  branchId?: number;
  classId?: number;
  departmentId?: number;
  armId?: number;
  status?: StudentsStatus;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/students/school?size=${limit}&page=${pageParam}${branchId ? `&branchId=${branchId}` : ""}${classId ? `&classId=${classId}` : ""}${departmentId ? `&departmentId=${departmentId}` : ""}${armId ? `&armId=${armId}` : ""}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`,
    ); // page starts from 0
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const uploadStudents = async ({ file }: { file: File | null }) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const { token } = await getSessionToken();
    try {
      const { data } = await axios.post("/students/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw error.response?.data;
      }
      throw error;
    }
  }
};

export const getStudentsDistribution = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/students/status/distribution?${branchId ? `branchId=${branchId}` : ""}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const exportStudents = async ({
  branchId,
  classId,
  armId,
  status,
}: {
  branchId?: number;
  classId?: number;
  armId?: number;
  status?: StudentsStatus;
}) => {
  try {
    const res = await api.get(
      `/students/export?${branchId ? `branchId=${branchId}` : ""}${classId ? `${branchId && "&"}classId=${classId}` : ""}${armId ? `${branchId || (classId && "&")}armId=${armId}` : ""}${status ? `${branchId || classId || (armId && "&")}status=${status}` : ""}`,
      {
        responseType: "blob",
      },
    );

    const disposition = res.headers["content-disposition"];
    const filename = disposition?.match(/filename="?(.+)"?/)?.[1] ?? "students.xlsx";

    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const withdrawStudents = async (studentIds: number[]) => {
  try {
    const { data } = await api.put(`/students/withdraw/${studentIds.join(",")}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteStudents = async (studentIds: number[]) => {
  try {
    const { data } = await api.delete(`/students/${studentIds.join(",")}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getStudent = async (studentId?: number) => {
  try {
    const { data } = await api.get(`/students/${studentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const editStudent = async (payload: StudentInputType & { studentId: number }) => {
  try {
    const { data } = await api.put("/students", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
export const getStudentReport = async ({ studentId, termId, armId }: { studentId?: number; termId?: number; armId?: number | null }) => {
  try {
    const { data } = await api.get(`/report-card/student/${studentId}/arm/${armId}?termId=${termId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
