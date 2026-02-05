import { getBranchesForASchool } from "@/api/branch";
import { branchKeys } from "@/queries/branch";
import { useQuery } from "@tanstack/react-query";

export const useGetBranches = () => {
  return useQuery({
    queryKey: branchKeys.branches,
    queryFn: getBranchesForASchool,
  });
};
