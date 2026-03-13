import { addPrincipaleComment, addResultCalculations, addSubmission } from "@/api/result";
import { resultKeys } from "@/queries/result";
import { useMutation } from "@tanstack/react-query";

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
