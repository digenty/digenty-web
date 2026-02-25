import { addStaff, getStaff } from "@/api/staff";
import { staffKeys } from "@/queries/staff";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useGetStaffs = ({ branchId, search, limit }: { branchId?: number; search?: string; limit: number }) => {
  return useInfiniteQuery({
    queryKey: [staffKeys.staffs, branchId, search],
    queryFn: ({ pageParam }) => getStaff({ pageParam, limit, branchId, search }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1; // next page index
    },
  });
};

export const useAddStaff = () => {
  return useMutation({
    mutationKey: staffKeys.addStaff,
    mutationFn: addStaff,
  });
};
