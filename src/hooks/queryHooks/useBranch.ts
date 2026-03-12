import {
  addBranch,
  approveEditRequest,
  approveEditRequestBulk,
  getAllBranchesDetails,
  getBranchDetails,
  getBranchesForASchool,
  getRequestEdit,
} from "@/api/branch";
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

export const useGetAllBranchesDetails = (termId?: number, search?: string) => {
  return useQuery({
    queryKey: branchKeys.allBranchesDetail(termId, search),
    queryFn: () => getAllBranchesDetails(termId, search),
    // enabled: !!termId,
  });
};

export const useGetEditRequest = (branchId: number) => {
  return useQuery({
    queryKey: branchKeys.editRequest(branchId),
    queryFn: () => getRequestEdit(branchId),
    retry: false,
  });
};

export const useApproveEditRequest = () => {
  return useMutation({
    mutationFn: ({ editAccessId, isApproved }: { editAccessId: number; isApproved: boolean }) => approveEditRequest(editAccessId, isApproved),
    mutationKey: ["approve-edit-request"],
  });
};

export const useApproveEditRequestBulk = () => {
  return useMutation({
    mutationFn: ({ editAccessIds, isApproved }: { editAccessIds: number[]; isApproved: boolean }) =>
      approveEditRequestBulk(editAccessIds, isApproved),
    mutationKey: ["approve-edit-request-bulk"],
  });
};

export const useGetBranchDetails = (branchId: number, termId?: number) => {
  return useQuery({
    queryKey: branchKeys.branchDetail(branchId, termId),
    queryFn: () => getBranchDetails(branchId, termId),
  });
};
