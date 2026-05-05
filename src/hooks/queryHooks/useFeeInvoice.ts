import { getFeeGroupsForInvoice, getFeesForInvoice } from "@/api/fee";
import { getStocksForInvoice } from "@/api/stockInvoice";
import { feeInvoiceKeys, stockInvoiceKeys } from "@/queries/fee";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetFeesForInvoice = ({
  branchId,
  classId,
  termId,
  search = "",
}: {
  branchId?: number;
  classId?: number;
  termId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: feeInvoiceKeys.fees(branchId, classId, termId, search),
    queryFn: () => getFeesForInvoice({ branchId: branchId!, classId, termId, search }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
  });
};

export const useGetFeeGroupsForInvoice = ({
  branchId,
  search = "",
}: {
  branchId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: feeInvoiceKeys.feeGroups(branchId, search),
    queryFn: () => getFeeGroupsForInvoice({ branchId: branchId!, search }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
  });
};

export const useGetStocksForInvoice = ({
  branchId,
  search = "",
}: {
  branchId?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: stockInvoiceKeys.stocks(branchId, search),
    queryFn: () => getStocksForInvoice({ branchId: branchId!, search }),
    enabled: !!branchId,
    placeholderData: keepPreviousData,
  });
};
