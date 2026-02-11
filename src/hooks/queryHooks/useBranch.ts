import { addBranch } from "@/api/branch";
import { branchKeys } from "@/queries/branch";
import { useMutation } from "@tanstack/react-query";

export const useAddBranch = () => {
  return useMutation({
    mutationKey: branchKeys.addBranch,
    mutationFn: addBranch,
  });
};
