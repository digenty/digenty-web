import { addStaff, deactivateStaff, deleteStaff, getStaff, getStaffDetails, makeBranchAdminStaff, updateStaff } from "@/api/staff";
import { staffKeys } from "@/queries/staff";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: staffKeys.updateStaff,
    mutationFn: updateStaff,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [staffKeys.staffs] });
      queryClient.invalidateQueries({ queryKey: staffKeys.staffDetails(variables.staffId) });
    },
  });
};

export const useAddStaff = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: staffKeys.addStaff,
    mutationFn: addStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [staffKeys.staffs] });
    },
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

export const useMakeBranchAdminStaff = () => {
  return useMutation({
    mutationKey: staffKeys.makeBranchAdminStaff,
    mutationFn: makeBranchAdminStaff,
  });
};
