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

export interface FeeGroupItemResponse {
  id: number;
  itemType: "FEE_CLASS" | "STOCK" | "CUSTOM";
  itemName: string;
  unitPrice: number;
  quantity: number;
  total: number;
  optional: boolean;
}

export interface FeeGroupAppliedArm {
  armId: number;
  armName: string;
  classId: number;
  className: string;
}

export interface FeeGroupByIdData {
  feeGroupId: number;
  name: string;
  description: string;
  branchId: number;
  branchName: string;
  termId: number;
  items: FeeGroupItemResponse[];
  appliedToArms: FeeGroupAppliedArm[];
  totalAmount: number;
  allowPartPayment: boolean | null;
  minimumPartPayment: number | null;
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

export const createFeeItemForArm = async (armId: number, payload: FeeItemForArmDto) => {
  try {
    const { data } = await api.post(`/fee/items/arms/${armId}`, payload);
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

export const deleteFeeRoute = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/route/${id}`);
    return data;
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

const triggerDownload = (blob: Blob, fallbackName: string, disposition?: string) => {
  const filename = disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? fallbackName;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const exportFeeItems = async ({ branchId, termId }: { branchId?: number; termId?: number }) => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    if (termId) params.append("termId", String(termId));
    const res = await api.get(`/fee/items/export?${params}`, { responseType: "blob" });
    triggerDownload(
      new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "fee-items.xlsx",
      res.headers["content-disposition"],
    );
export const createFeeRoute = async (payload: FeeRouteRequestDto) => {
  try {
    const { data } = await api.post(`/fee/route`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const exportFeeGroups = async ({ branchId }: { branchId?: number }) => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    const res = await api.get(`/fee/group/export?${params}`, { responseType: "blob" });
    triggerDownload(
      new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "fee-groups.xlsx",
      res.headers["content-disposition"],
    );
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

export const exportClassFees = async ({
  sessionId,
  term,
  branchId,
  classId,
  armId,
}: {
  sessionId?: number;
  term?: FeeTermType;
  branchId?: number;
  classId?: number;
  armId?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (sessionId) params.append("sessionId", String(sessionId));
    if (term) params.append("term", term);
    if (branchId) params.append("branchId", String(branchId));
    if (classId) params.append("classId", String(classId));
    if (armId) params.append("armId", String(armId));
    const res = await api.get(`/fee/class/overview/export?${params}`, { responseType: "blob" });
    triggerDownload(
      new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "class-fees.xlsx",
      res.headers["content-disposition"],
    );
export const deleteFeeRoute = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/route/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
