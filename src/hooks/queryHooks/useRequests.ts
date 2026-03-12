import { getEditRequests } from "@/api/request";
import { requestKeys } from "@/queries/request";
import { useQuery } from "@tanstack/react-query";

export const useGetEditRequests = (branchId: number, search?: string) => {
  return useQuery({
    queryKey: requestKeys.requestsByBranch(branchId, search),
    queryFn: () => getEditRequests(branchId, search),
    enabled: !!branchId,
  });
};
