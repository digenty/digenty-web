import {
  addPrincipaleComment,
  addResultCalculations,
  addSubmission,
  deletePrincipalComment,
  getPrincipalComment,
  getPrincipalCommentByLevel,
  getResultCalculations,
  getSubmissionDeadline,
  updateResultCalculation,
  updateSubmissionDeadline,
} from "@/api/result";
import { UpdateResultCalculationPayload } from "@/api/types";
import { resultKeys } from "@/queries/result";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddResultCalculation = () => {
  return useMutation({
    mutationKey: resultKeys.addResultCalculation,
    mutationFn: addResultCalculations,
  });
};

export const useAddSubmission = () => {
  return useMutation({
    mutationKey: resultKeys.addSubmission,
    mutationFn: addSubmission,
  });
};

export const useAddPrinciapleComment = () => {
  return useMutation({
    mutationKey: resultKeys.addPrincipaleComment,
    mutationFn: addPrincipaleComment,
  });
};

export const useGetSubmissionDeadline = () => {
  return useQuery({
    queryKey: resultKeys.getSubmissionDeadline,
    queryFn: getSubmissionDeadline,
  });
};

export const useUpdateSubmissionDeadline = () => {
  return useMutation({
    mutationKey: resultKeys.updateSubmissionDeadline,
    mutationFn: updateSubmissionDeadline,
  });
};

export const useGetPrincipalComment = () => {
  return useQuery({
    queryKey: resultKeys.getPrincipalComment,
    queryFn: getPrincipalComment,
  });
};

export const useGetPrincipalCommentByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [resultKeys.getPrincipalCommentByLevel, levelId],
    queryFn: () => getPrincipalCommentByLevel(levelId),
    enabled: !!levelId,
  });
};

export const useDeletePrincipalComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: resultKeys.deletetPrincipalComment,
    mutationFn: (commentId: number) => deletePrincipalComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [resultKeys.getPrincipalCommentByLevel] });
    },
  });
};

export const useGetResultCalculation = () => {
  return useQuery({
    queryKey: resultKeys.getResultCalculation,
    queryFn: () => getResultCalculations(),
  });
};

export const useUpdateResultCalculation = () => {
  return useMutation({
    mutationKey: resultKeys.updateResultCalculation,
    mutationFn: ({ payload, resultSettingId }: { payload: UpdateResultCalculationPayload; resultSettingId: number }) =>
      updateResultCalculation(payload, resultSettingId),
  });
};
