import { getFeesForPicker, getFeeGroupsForPicker, FeeInvoiceResponse, FeeGroupInvoiceResponse } from "@/api/fee";
import { searchStocks, StockInvoiceSearchResult } from "@/api/stock";
import { feeKeys } from "@/queries/fee";
import { stockKeys } from "@/queries/stock";
import { useQuery } from "@tanstack/react-query";

interface GetFeesForInvoiceParams {
  branchId?: number;
  classId?: number;
  termId?: number;
  search?: string;
}

export const useGetFeesForInvoice = ({ branchId, classId, termId, search }: GetFeesForInvoiceParams) => {
  return useQuery<FeeInvoiceResponse[]>({
    queryKey: feeKeys.feesForInvoice(branchId ?? 0, classId, termId, search),
    queryFn: () => getFeesForPicker(branchId!, classId, termId, search),
    enabled: !!branchId,
    retry: false,
  });
};

interface GetFeeGroupsForInvoiceParams {
  branchId?: number;
  search?: string;
}

export const useGetFeeGroupsForInvoice = ({ branchId, search }: GetFeeGroupsForInvoiceParams) => {
  return useQuery<FeeGroupInvoiceResponse[]>({
    queryKey: feeKeys.feeGroupsForInvoice(branchId ?? 0, search),
    queryFn: () => getFeeGroupsForPicker(branchId!, search),
    enabled: !!branchId,
    retry: false,
  });
};

interface GetStocksForInvoiceParams {
  branchId?: number;
  search?: string;
  page?: number;
  size?: number;
}

export const useGetStocksForInvoice = ({ branchId, search, page, size }: GetStocksForInvoiceParams) => {
  return useQuery<StockInvoiceSearchResult>({
    queryKey: stockKeys.search(branchId ?? 0, search, page, size),
    queryFn: () => searchStocks({ branchId: branchId!, search, page, size }),
    enabled: !!branchId,
    retry: false,
  });
};
