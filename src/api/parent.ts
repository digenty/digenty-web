import { ParentInputType } from "@/components/StudentAndParent/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export const addParent = async (payload: ParentInputType) => {
  try {
    const { data } = await api.post("/parents", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getParents = async ({
  limit,
  pageParam,
  branchId,
  search,
}: {
  limit: number;
  pageParam: number;
  branchId?: number;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/parents/all?size=${limit}&page=${pageParam}${branchId ? `&branchId=${branchId}` : ""}${search ? `&search=${search}` : ""}`,
    ); // page starts from 0
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const uploadParents = async ({ file }: { file: File | null }) => {
  try {
    const { data } = await api.post("/parents/upload", file);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const exportParents = async ({ branchId }: { branchId?: number }) => {
  try {
    const res = await api.get(`/parents/export?${branchId ? `branchId=${branchId}` : ""}`, {
      responseType: "blob",
    });

    const disposition = res.headers["content-disposition"];
    const filename = disposition?.match(/filename="?(.+)"?/)?.[1] ?? "parents.xlsx";

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

export const getParent = async (parentId?: number) => {
  try {
    const { data } = await api.get(`/parents/${parentId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const deleteParents = async (parentIds: number[]) => {
  try {
    const { data } = await api.delete(`/parents/${parentIds.join(",")}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
