import { addAssessment, addAssessmentDefault, getAssessmentForBranch } from "@/api/assessment";
import { assessmentKeys } from "@/queries/assessment";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddAssessmentDefault = () => {
  return useMutation({
    mutationKey: assessmentKeys.addDefault,
    mutationFn: addAssessmentDefault,
  });
};

export const useAddAssessment = () => {
  return useMutation({
    mutationKey: assessmentKeys.add,
    mutationFn: addAssessment,
  });
};

export const useGetBranchAssessment = (branchId: number) => {
  return useQuery({
    queryKey: assessmentKeys.getSchoolAssessment,
    queryFn: () => getAssessmentForBranch(branchId),
  });
};
