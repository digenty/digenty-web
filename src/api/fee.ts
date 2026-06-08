import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type FeeInvoiceItem = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export type FeeInvoiceResponse = {
  id: number;
  classStudent: string;
  termId: number;
  termLabel: string;
  totalAmount: number;
  items: FeeInvoiceItem[];
};

export type FeeGroupInvoiceItem = {
  id: number;
  name: string;
  amount: number;
  required: boolean;
};

export type FeeGroupInvoiceResponse = {
  id: number;
  name: string;
  totalAmount: number;
  items: FeeGroupInvoiceItem[];
};

export const getFeesForInvoice = async ({
  branchId,
  classId,
  termId,
  search = "",
}: {
  branchId: number;
  classId?: number;
  termId?: number;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/fees?branchId=${branchId}${classId ? `&classId=${classId}` : ""}${termId ? `&termId=${termId}` : ""}${search ? `&search=${search}` : ""}`,
    );

    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

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
  branchIds?: number[];
  armIds: number[];
  amount?: number;
  setDifferentPricesPerBranch?: boolean;
  setDifferentPricesPerClass?: boolean;
  branchAmounts?: BranchAmount[];
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

// Response shape from GET /fee/route and GET /fee/route/branch/{branchId}
export interface FeeRouteResponseDto {
  id: number;
  branchName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  feeClassName: string;
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

export interface FeeItemDetail {
  feeItemId: number;
  feeClassId: number;
  feeName: string;
  amount: number;
  quantity: number;
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number;
}

export const getFeeItems = async (branchId?: number, termId?: number): Promise<FeeItemDetail[]> => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    if (termId) params.append("termId", String(termId));
    const qs = params.toString() ? `?${params}` : "";
    const { data } = await api.get(`/fee/items${qs}`);
    return toArray<FeeItemDetail>(data);
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

// Normalise whatever the server returns to a plain array.
// Swagger says array, but the runtime response may be a paginated wrapper
// ({ content, data, items, … }) depending on the backend version.
function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["content", "data", "items", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

// GET /fee/route — all school fee routes
export const getFeeRoutes = async (): Promise<FeeRouteResponseDto[]> => {
  try {
    const { data } = await api.get(`/fee/route`);
    return toArray<FeeRouteResponseDto>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /fee/route/branch/{branchId} — routes for a specific branch
export const getFeeRoutesByBranch = async (branchId: number): Promise<FeeRouteResponseDto[]> => {
  try {
    const { data } = await api.get(`/fee/route/branch/${branchId}`);
    return toArray<FeeRouteResponseDto>(data);
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

// PUT /fee/route/{id} — update an existing fee route
export const updateFeeRoute = async (id: number, payload: FeeRouteRequestDto) => {
  try {
    const { data } = await api.put(`/fee/route/${id}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroupsForInvoice = async ({ branchId, search = "" }: { branchId: number; search?: string }) => {
  try {
    const { data } = await api.get(`/fee-groups?branchId=${branchId}${search ? `&search=${search}` : ""}`);
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
