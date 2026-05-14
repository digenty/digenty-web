import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";

export interface StockInvoiceItem {
  id: number;
  itemName: string;
  amount: number;
  quantity: number;
  stockStatus: StockStatus;
  image: string | null;
}

export interface StockInvoiceSearchResult {
  content: StockInvoiceItem[];
  totalElements: number;
}

export const searchStocks = async (branchId: number, search = "", page = 0, size = 20): Promise<StockInvoiceSearchResult> => {
  try {
    const params = new URLSearchParams({
      branchId: String(branchId),
      search,
      page: String(page),
      size: String(size),
    });
    const { data } = await api.get(`/stocks?${params}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
