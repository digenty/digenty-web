import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type StockInvoiceItem = {
  id: number;
  itemName: string;
  amount: number;
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  image: string;
};

export type StockInvoiceSearchResult = {
  content: StockInvoiceItem[];
  totalElements: number;
};

export const getStocksForInvoice = async ({
  branchId,
  search = "",
  page = 0,
  size = 20,
}: {
  branchId: number;
  search?: string;
  page?: number;
  size?: number;
}) => {
  try {
    const { data } = await api.get(
      `/stocks?branchId=${branchId}&search=${search}&page=${page}&size=${size}`,
    );
    return data as StockInvoiceSearchResult;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
