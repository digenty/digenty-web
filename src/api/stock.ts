import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

export type StockAdjustReason =
  | "RESTOCK"
  | "DONATION"
  | "RETURNED"
  | "CORRECTION_OF_PREVIOUS_ERROR"
  | "TRANSFER_FROM_ANOTHER_BRANCH"
  | "RECOVERED_ITEMS";

export interface CreateStockDto {
  name: string;
  description: string;
  categoryId: number;
  imagePath: string;
  stockUnitId: number;
  quantity: number;
  price: number;
  costPrice: number;
  branchIds: number[];
}

export interface EditStockDto {
  stockId: number;
  name?: string;
  description?: string;
  categoryId?: number;
  imagePath?: string;
  stockUnitId?: number;
  quantity?: number;
  price?: number;
  costPrice?: number;
}

export interface AdjustQuantityDto {
  stockId: number;
  quantityAdjustment?: number;
  reason?: StockAdjustReason;
}

export interface CreateStockUnitDto {
  name: string;
  description: string;
}

export interface EditStockUnitDto {
  stockUnitId: number;
  name?: string;
  description?: string;
}

export interface CreateStockCategoryDto {
  name: string;
}

export interface EditStockCategoryDto {
  stockCategoryId: number;
  name?: string;
}

export interface StockSettingsRequestDto {
  lowStockThreshold: number;
  lowStockAlertEnabled: boolean;
}

export interface StockInvoiceItem {
  id: number;
  itemName: string;
  amount: number;
  quantity: number;
  stockStatus: StockStatus;
  image: string;
}

export interface StockInvoiceSearchResult {
  content: StockInvoiceItem[];
  totalElements: number;
}

export interface SearchStocksParams {
  branchId: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const searchStocks = async ({ branchId, search = "", page = 0, size = 20 }: SearchStocksParams) => {
  try {
    const { data } = await api.get<StockInvoiceSearchResult>(`/stocks${buildQuery({ branchId, search, page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createStock = async (payload: CreateStockDto) => {
  try {
    const { data } = await api.post("/stocks", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editStock = async (payload: EditStockDto) => {
  try {
    const { data } = await api.put("/stocks", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const adjustStockQuantity = async (payload: AdjustQuantityDto) => {
  try {
    const { data } = await api.put("/stocks/adjust/quantity", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockById = async (id: number) => {
  try {
    const { data } = await api.get(`/stocks/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockByStatus = async (status: StockStatus) => {
  try {
    const { data } = await api.get(`/stocks/status/${status}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockByName = async (name: string) => {
  try {
    const { data } = await api.get(`/stocks/search/name/${encodeURIComponent(name)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockByCategory = async (category: string | number) => {
  try {
    const { data } = await api.get(`/stocks/category/${category}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStocksByBranch = async (branchId: number, { page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/stocks/branch/${branchId}${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteStock = async (stockId: number) => {
  try {
    const { data } = await api.delete(`/stocks/${stockId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockTransactions = async (stockId: number, { page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/stockTransaction/${stockId}${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAllStockUnits = async ({ page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/stock/unit${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAllStockUnitsSize = async ({ page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/stock/unit/size${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createStockUnit = async (payload: CreateStockUnitDto) => {
  try {
    const { data } = await api.post("/stock/unit", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editStockUnit = async (payload: EditStockUnitDto) => {
  try {
    const { data } = await api.put("/stock/unit", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteStockUnit = async (stockUnitId: number) => {
  try {
    const { data } = await api.delete(`/stock/unit/delete/${stockUnitId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAllStockCategories = async ({ page = 0, size = 15 }: PaginationParams = {}) => {
  try {
    const { data } = await api.get(`/stock/category${buildQuery({ page, size })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createStockCategory = async (payload: CreateStockCategoryDto) => {
  try {
    const { data } = await api.post("/stock/category", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const editStockCategory = async (payload: EditStockCategoryDto) => {
  try {
    const { data } = await api.put("/stock/category", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteStockCategory = async (stockCategoryId: number) => {
  try {
    const { data } = await api.delete(`/stock/category/${stockCategoryId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockCategoryByName = async (name: string) => {
  try {
    const { data } = await api.get(`/stock/category/search/name/${encodeURIComponent(name)}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStockSettings = async (branchId?: number) => {
  try {
    const { data } = await api.get(`/stock-settings${buildQuery({ branchId })}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateStockSettings = async ({ payload, branchId }: { payload: StockSettingsRequestDto; branchId?: number }) => {
  try {
    const { data } = await api.put(`/stock-settings${buildQuery({ branchId })}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
