import { approveEditRequest, approveEditRequestBulk, getEditRequestBySubjectAndArm, getEditRequests, getRequestEdit } from "@/api/request";
import { requestKeys } from "@/queries/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetEditRequests = (branchId: number, search?: string) => {
  return useQuery({
    queryKey: [requestKeys.requestsByBranch, branchId, search],
    queryFn: () => getEditRequests(branchId, search),
    enabled: !!branchId,
  });
};

export const useGetEditRequestBySubjectAndArm = (subjectId: number, armId: number) => {
  return useQuery({
    queryKey: [requestKeys.editRequestBySubjectAndArm, subjectId, armId],
    queryFn: () => getEditRequestBySubjectAndArm(subjectId, armId),
    enabled: !!subjectId && !!armId,
  });
};

export const useGetEditRequest = (branchId: number) => {
  return useQuery({
    queryKey: requestKeys.editRequest(branchId),
    queryFn: () => getRequestEdit(branchId),
    retry: false,
  });
};

export const useApproveEditRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: requestKeys.approveEditRequest,
    mutationFn: ({ editAccessId, isApproved }: { editAccessId: number; isApproved: boolean }) => approveEditRequest(editAccessId, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [requestKeys.requestsByBranch] });
      queryClient.invalidateQueries({ queryKey: [requestKeys.editRequestBySubjectAndArm] });
    },
  });
};

export const useApproveEditRequestBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: requestKeys.approveEditRequestBulk,
    mutationFn: ({ editAccessIds, isApproved }: { editAccessIds: number[]; isApproved: boolean }) =>
      approveEditRequestBulk(editAccessIds, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [requestKeys.requestsByBranch] });
    },
  });
};
