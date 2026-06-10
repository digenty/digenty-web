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

// POST /fee/items/arms/{armId} — add a single fee item to one arm
export interface SingleArmFeeItemDto {
  name: string;
  session: number;
  term: FeeTermType;
  quantity?: number;
  amount: number;
  required?: boolean;
  allowPartPayment?: boolean;
  minimumPartPayment?: number;
}

export interface BranchFeeSelection {
  branchId: number;
  armIds: number[];
  branchAmount?: number;
  classArmAmounts?: ClassArmAmount[];
}

// POST /fee/items/multi-branch — create a fee item across several branches at once
export interface MultiBranchFeeItemDto {
  name: string;
  session: number;
  term: FeeTermType;
  quantity?: number;
  required?: boolean;
  amount?: number;
  setDifferentPricesPerBranch?: boolean;
  setDifferentPricesPerClass?: boolean;
  branches: BranchFeeSelection[];
  allowPartPayment?: boolean;
  minimumPartPayment?: number;
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

// ---- Fee class overview / detail response shapes ----
export interface ArmFeeOverview {
  armId: number;
  armName: string;
  feeItems: FeeItemDetail[];
  totalAmount: number;
}

export interface ClassFeeOverview {
  classId: number;
  className: string;
  arms: ArmFeeOverview[];
  feeNames: string[];
  totalAmount: number;
}

export interface BranchFeeOverview {
  branchId: number;
  branchName: string;
  totalFees: number;
  totalClassVariations: number;
  classes: ClassFeeOverview[];
}

export interface FeeClassOverviewResponse {
  branches: BranchFeeOverview[];
  grandTotalFees: number;
  grandTotalVariations: number;
}

// GET /fee/fees/{id}
export interface ClassFeeDetailResponse {
  feeId: number;
  branchId: number;
  branchName: string;
  termId: number;
  termLabel: string;
  academicYear: string;
  published: boolean;
  publishedAt: string;
  classes: ClassFeeOverview[];
  totalAmount: number;
}

export const getFeeClassOverview = async (sessionId: number, term: FeeTermType, branchId?: number): Promise<FeeClassOverviewResponse> => {
  try {
    const params = new URLSearchParams({ sessionId: String(sessionId), term });
    if (branchId) params.append("branchId", String(branchId));
    const { data } = await api.get(`/fee/class/overview?${params}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// PUT /fee/class/{id}/name — rename a fee class
export const renameFeeClass = async (id: number, name: string) => {
  try {
    const params = new URLSearchParams({ name });
    const { data } = await api.put(`/fee/class/${id}/name?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// Raw fee entity returned by GET /fee/fees
export interface Fee {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  schoolId: number;
  branchId: number;
  termId: number;
  academicYear: string;
  term: string;
  dueDate: string;
  published: boolean;
  publishedAt: string;
}

// Raw fee-arm join entity returned by GET /fee/fees/{id}/arms
export interface FeeArm {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  feeId: number;
  armId: number;
}

// Raw fee-item entity returned by GET /fee/fees/{id}/items
export interface FeeItemEntity {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  feeId: number;
  name: string;
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number;
  feeClassId: number;
  armId: number;
  amount: number;
  quantity: number;
  classId: number;
  branchId: number;
  termId: number;
}

export const getFees = async (termId?: number): Promise<Fee[]> => {
  try {
    const qs = termId ? `?termId=${termId}` : "";
    const { data } = await api.get(`/fee/fees${qs}`);
    return toArray<Fee>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeById = async (id: number): Promise<ClassFeeDetailResponse> => {
  try {
    const { data } = await api.get(`/fee/fees/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /fee/fees/{id}/arms — arms attached to a fee
export const getFeeArms = async (id: number): Promise<FeeArm[]> => {
  try {
    const { data } = await api.get(`/fee/fees/${id}/arms`);
    return toArray<FeeArm>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /fee/fees/{id}/items — raw fee items belonging to a fee
export const getFeeItemsByFee = async (id: number): Promise<FeeItemEntity[]> => {
  try {
    const { data } = await api.get(`/fee/fees/${id}/items`);
    return toArray<FeeItemEntity>(data);
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

// Enriched single-item response from GET /fee/items/{id}
export interface AppliedClassEntry {
  classId: number;
  className: string;
  armId: number | null;
  armName: string | null;
  type: "CLASS" | "DEPARTMENT";
  amount: number;
}

export interface AppliedClassGroup {
  branchId: number;
  branchName: string;
  classes: AppliedClassEntry[];
}

export interface FeeItemDetailResponse {
  feeItemId: number;
  feeName: string;
  active: boolean;
  termId: number;
  term: FeeTermType;
  termLabel: string;
  academicYear: string;
  amount: number | null;
  minAmount: number;
  maxAmount: number;
  quantity: number;
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number;
  branches: { branchId: number; branchName: string }[];
  appliedClasses: AppliedClassGroup[];
}

export interface FeeItemsFilter {
  branchId?: number;
  termId?: number;
  classId?: number;
  armId?: number;
  feeId?: number;
}

export const getFeeItems = async (filter: FeeItemsFilter = {}): Promise<FeeItemDetail[]> => {
  try {
    const { branchId, termId, classId, armId, feeId } = filter;
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    if (termId) params.append("termId", String(termId));
    if (classId) params.append("classId", String(classId));
    if (armId) params.append("armId", String(armId));
    if (feeId) params.append("feeId", String(feeId));
    const qs = params.toString() ? `?${params}` : "";
    const { data } = await api.get(`/fee/items${qs}`);
    return toArray<FeeItemDetail>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeItemById = async (id: number): Promise<FeeItemDetailResponse> => {
  try {
    const { data } = await api.get(`/fee/items/${id}`);
    return data?.data ?? data;
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

// POST /fee/items/arms/{armId} — add one fee item to a single arm
export const createSingleArmFeeItem = async (armId: number, payload: SingleArmFeeItemDto) => {
  try {
    const { data } = await api.post(`/fee/items/arms/${armId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// POST /fee/items/multi-branch — create a fee item across several branches
export const createMultiBranchFeeItem = async (payload: MultiBranchFeeItemDto) => {
  try {
    const { data } = await api.post(`/fee/items/multi-branch`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export interface UpdateFeeItemDto {
  name: string;
  quantity?: number;
  required?: boolean;
  allowPartPayment?: boolean;
  minimumPartPayment?: number;
  amount?: number;
  setDifferentPricesPerClass?: boolean;
  classArmAmounts?: ClassArmAmount[];
  branchIds?: number[];
  armIds?: number[];
  branchAmounts?: BranchAmount[];
}

export const updateFeeItem = async (id: number, payload: UpdateFeeItemDto): Promise<FeeItemDetailResponse> => {
  try {
    const { data } = await api.put(`/fee/items/${id}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const duplicateFeeItem = async (id: number): Promise<{ feeItemId: number }> => {
  try {
    const { data } = await api.post(`/fee/items/${id}/duplicate`);
    return data?.data ?? data;
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

// ---- Fee group response shapes ----
export interface FeeGroupSummary {
  feeGroupId: number;
  name: string;
  description: string;
  feeNames: string[];
  totalAmount: number;
  appliedToArmsCount: number;
}

export interface BranchFeeGroupOverview {
  branchId: number;
  branchName: string;
  feeGroups: FeeGroupSummary[];
}

// GET /fee/group/overview
export interface FeeGroupOverviewResponse {
  branches: BranchFeeGroupOverview[];
  totalGroups: number;
}

export interface FeeGroupItemDetail {
  id: number;
  itemType: "FEE_CLASS" | "STOCK" | "CUSTOM";
  itemName: string;
  unitPrice: number;
  quantity: number;
  total: number;
  optional: boolean;
}

export interface ArmInfo {
  armId: number;
  armName: string;
  classId: number;
  className: string;
}

// GET /fee/group/{feeGroupId}
export interface FeeGroupDetailResponse {
  feeGroupId: number;
  name: string;
  description: string;
  branchId: number;
  branchName: string;
  termId: number;
  items: FeeGroupItemDetail[];
  totalAmount: number;
  allowPartPayment: boolean;
  minimumPartPayment: number;
}

export const getFeeGroups = async (branchId?: number, termId?: number): Promise<FeeGroupSummary[]> => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    if (termId) params.append("termId", String(termId));
    const qs = params.toString() ? `?${params}` : "";
    const { data } = await api.get(`/fee/group${qs}`);
    return toArray<FeeGroupSummary>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /fee/group/overview — grouped by branch with a grand total count
export const getFeeGroupOverview = async (sessionId: number, term: FeeTermType, branchId?: number): Promise<FeeGroupOverviewResponse> => {
  try {
    const params = new URLSearchParams({ sessionId: String(sessionId), term });
    if (branchId) params.append("branchId", String(branchId));
    const { data } = await api.get(`/fee/group/overview?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getFeeGroupById = async (feeGroupId: number): Promise<FeeGroupDetailResponse> => {
  try {
    const { data } = await api.get(`/fee/group/${feeGroupId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// POST /fee/group/items — add a single item to an existing fee group
export const addFeeGroupItem = async (payload: FeeGroupItemDto) => {
  try {
    const { data } = await api.post(`/fee/group/items`, payload);
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

export interface FeeInvoiceItem {
  id: number;
  name: string;
  amount: number;
  required: boolean;
}

export interface FeeInvoiceResponse {
  id: number;
  classStudent: string;
  termId: number;
  termLabel: string;
  totalAmount: number;
  items: FeeInvoiceItem[];
}

export interface FeeGroupInvoiceItem {
  id: number;
  name: string;
  amount: number;
  required: boolean;
}

export interface FeeGroupInvoiceResponse {
  id: number;
  name: string;
  totalAmount: number;
  items: FeeGroupInvoiceItem[];
}

export const getFeesForPicker = async (branchId: number, classId?: number, termId?: number, search?: string): Promise<FeeInvoiceResponse[]> => {
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

export const getFeeGroupsForPicker = async (branchId: number, search?: string): Promise<FeeGroupInvoiceResponse[]> => {
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

// GET /fee/group/invoice-picker — fee groups formatted for the invoice creation picker
export const getFeeGroupsForInvoicePicker = async (branchId: number, search?: string): Promise<FeeGroupInvoiceResponse[]> => {
  try {
    const params = new URLSearchParams({ branchId: String(branchId) });
    if (search) params.append("search", search);
    const { data } = await api.get(`/fee/group/invoice-picker?${params}`);
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

export const deleteFeeRoute = async (id: number) => {
  try {
    const { data } = await api.delete(`/fee/route/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
