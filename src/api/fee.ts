import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type FeeTermType = "FIRST" | "SECOND" | "THIRD";

export interface ClassArmAmount {
  armId: number;
  amount: number;
}

export interface BranchAmount {
  branchId: number;
  amount: number;
}

export interface FeeItemDto {
  name: string;
  session: number;
  term: FeeTermType;
  quantity?: number;
  /** branch IDs this fee applies to */
  branchIds?: number[];
  /** arm IDs this fee applies to */
  armIds: number[];
  amount?: number;
  setDifferentPricesPerBranch?: boolean;
  setDifferentPricesPerClass?: boolean;
  /** amounts per branch when setDifferentPricesPerBranch is true */
  branchAmounts?: BranchAmount[];
  /** amounts per arm/class when setDifferentPricesPerClass is true */
  classArmAmounts?: ClassArmAmount[];
  allowPartPayment?: boolean;
  minimumPartPayment?: number;
  required?: boolean;
}

export interface FeeGroupItemDto {
  itemType: "FEE_CLASS" | "STOCK" | "CUSTOM";
  feeClassId?: number;
  stockId?: number;
  name?: string;
  unitPrice?: number;
  amount?: number;
  minimumPartPayment?: number;
  quantity?: number;
  optional?: boolean;
  armIds?: number[];
  classArmAmounts?: ClassArmAmount[];
  session?: number;
  term?: FeeTermType;
  branchId?: number;
  setDifferentPricesPerClass?: boolean;
  allowPartPayment?: boolean;
}

export interface FeeGroupDto {
  name: string;
  description?: string;
  session: number;
  term: FeeTermType;
  branchId: number;
  armIds: number[];
  items: FeeGroupItemDto[];
  allowPartPayment?: boolean;
  minimumPartPayment?: number;
}

export interface FeeRouteRequestDto {
  branchId: number;
  bankAccountId: number;
  feeClassId: number;
  isDefault: boolean;
}

export const getFeeClassOverview = async (sessionId: number, term: FeeTermType, branchId?: number) => {
  try {
    const params = new URLSearchParams({ sessionId: String(sessionId), term });
    if (branchId) params.append("branchId", String(branchId));
    const { data } = await api.get(`/fee/class/overview?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFees = async (termId?: number) => {
  try {
    const qs = termId ? `?termId=${termId}` : "";
    const { data } = await api.get(`/fee/fees${qs}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeById = async (id: number) => {
  try {
    const { data } = await api.get(`/fee/fees/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteFee = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/fees/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const publishFee = async (id: number) => {
  try {
    const { data } = await api.post(`/fee/fees/${id}/publish`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeItems = async (branchId?: number, termId?: number) => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    if (termId) params.append("termId", String(termId));
    const qs = params.toString() ? `?${params}` : "";
    const { data } = await api.get(`/fee/items${qs}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeItemById = async (id: number) => {
  try {
    const { data } = await api.get(`/fee/items/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createFeeItem = async (payload: FeeItemDto) => {
  try {
    const { data } = await api.post(`/fee/items`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteFeeItem = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/items/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroups = async (branchId?: number) => {
  try {
    const qs = branchId ? `?branchId=${branchId}` : "";
    const { data } = await api.get(`/fee/group${qs}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroupById = async (feeGroupId: number) => {
  try {
    const { data } = await api.get(`/fee/group/${feeGroupId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createFeeGroup = async (payload: FeeGroupDto) => {
  try {
    const { data } = await api.post(`/fee/group`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateFeeGroup = async (id: number, payload: FeeGroupDto) => {
  try {
    const { data } = await api.put(`/fee/group/${id}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteFeeGroup = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/group/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeesForPicker = async (branchId: number, classId?: number, termId?: number, search?: string) => {
  try {
    const params = new URLSearchParams({ branchId: String(branchId) });
    if (classId) params.append("classId", String(classId));
    if (termId) params.append("termId", String(termId));
    if (search) params.append("search", search);
    const { data } = await api.get(`/fees?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroupsForPicker = async (branchId: number, search?: string) => {
  try {
    const params = new URLSearchParams({ branchId: String(branchId) });
    if (search) params.append("search", search);
    const { data } = await api.get(`/fee-groups?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeRoutes = async () => {
  try {
    const { data } = await api.get(`/fee/route`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createFeeRoute = async (payload: FeeRouteRequestDto) => {
  try {
    const { data } = await api.post(`/fee/route`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteFeeRoute = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/route/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
