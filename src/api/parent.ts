import { getSessionToken } from "@/app/actions/auth";
import { ParentInputType } from "@/components/StudentAndParent/types";
import { BulkUploadResult, CommitUploadResponse, ValidateUploadResponse } from "@/components/StudentAndParent/BulkUpload/types";
import api from "@/lib/axios/axios-auth";
import axios, { isAxiosError } from "axios";

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

export const addParentOnParentPortal = async (payload: ParentInputType) => {
  try {
    const { data } = await api.post("/parents/onboarding", payload);
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

export const uploadParents = async ({
  file,
  branchId,
}: {
  file: File | null;
  branchId?: number;
}): Promise<
  | { success: boolean; code: number; message: string; data: Partial<BulkUploadResult> & { duplicateEmails?: unknown[] }; timestamp: string }
  | undefined
> => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const { token } = await getSessionToken();
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parents/upload/${branchId}`, formData, {
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

export const validateParentsUpload = async ({ file, branchId }: { file: File; branchId: number }): Promise<ValidateUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const { data } = await api.post(`/parents/upload/validate/${branchId}`, formData);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const commitParentsUpload = async ({ batchId }: { batchId: string }): Promise<CommitUploadResponse> => {
  try {
    const { data } = await api.post(`/parents/upload/${batchId}/commit`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
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
      if (error.response?.status === 404) return null;
      throw error.response?.data;
    }
    throw error;
  }
};

// Self-service equivalent of getParent - resolves the parent purely from the
// auth token. /parents/{id} is staff-permission-gated and 403s a parent
// fetching their own record, so the parent portal must use this instead.
export const getMyParentProfile = async () => {
  try {
    const { data } = await api.get(`/parent/portal/me`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) return null;
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

export const editParent = async (payload: ParentInputType & { id: number }) => {
  try {
    const { data } = await api.put("/parents", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
