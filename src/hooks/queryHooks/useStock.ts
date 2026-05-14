import { searchStocks } from "@/api/stock";
import { stockKeys } from "@/queries/stock";
import { useQuery } from "@tanstack/react-query";

export const useSearchStocks = (branchId?: number, search = "", page = 0, size = 20) => {
  return useQuery({
    queryKey: stockKeys.stocks(branchId, search, page),
    queryFn: () => searchStocks(branchId!, search, page, size),
    enabled: !!branchId,
  });
};
