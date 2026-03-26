import { addBranch, deleteBranch, getAllBranchesDetails, getBranchDetails, getBranchesForASchool, updateBranch } from "@/api/branch";
import { branchKeys } from "@/queries/branch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetBranches = () => {
  return useQuery({
    queryKey: branchKeys.branches,
    queryFn: getBranchesForASchool,
  });
};

export const useAddBranch = () => {
  return useMutation({
    mutationKey: branchKeys.addBranch,
    mutationFn: addBranch,
  });
};

export const useGetAllBranchesDetails = (termId?: number, search?: string) => {
  return useQuery({
    queryKey: branchKeys.allBranchesDetail(termId, search),
    queryFn: () => getAllBranchesDetails(termId, search),
    // enabled: !!termId,
  });
};

export const useGetBranchDetails = (branchId: number, termId?: number, search?: string, levelId?: number) => {
  return useQuery({
    queryKey: [branchKeys.branchDetail, branchId, termId, search, levelId],
    queryFn: () => getBranchDetails(branchId, termId, search, levelId),
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: branchKeys.updateBranch,
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [branchKeys.branches] });
    },
  });
};

export const useDeleteBranch = (branchId: number) => {
  return useMutation({
    mutationKey: branchKeys.delete,
    mutationFn: () => deleteBranch(branchId),
  });
};
