import { addBranch, getBranchesForASchool, updateBranch } from "@/api/branch";
import { branchKeys } from "@/queries/branch";
import { useMutation, useQuery } from "@tanstack/react-query";

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
export const useUpdateBranch = () => {
  return useMutation({
    mutationKey: branchKeys.updateBranch,
    mutationFn: updateBranch,
  });
};
