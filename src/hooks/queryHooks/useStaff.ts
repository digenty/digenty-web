import { addStaff, deactivateStaff, deleteStaff, getStaff, getStaffDetails } from "@/api/staff";
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

export const useGetStaffDetails = (staffId: number | null) => {
  return useQuery({
    queryKey: staffKeys.staffDetails(staffId),
    queryFn: () => getStaffDetails(staffId),
    enabled: !!staffId,
  });
};

export const useDeleteStaff = (staffId: number | null) => {
  return useMutation({
    mutationKey: staffKeys.deleteStaff,
    mutationFn: () => deleteStaff(staffId),
  });
};

export const useDeactivateStaff = (staffId: number | null) => {
  return useMutation({
    mutationKey: staffKeys.deactivateStaff,
    mutationFn: () => deactivateStaff(staffId),
  });
};
