import { addAssessment, addAssessmentDefault, getAssessmentDefault, getAssessmentForBranch, updateAssessmentForLevel } from "@/api/assessment";
import { assessmentKeys } from "@/queries/assessment";
import { levelKeys } from "@/queries/level";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useUpdateAssessmentForLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.updateAssessmentForLevel,
    mutationFn: updateAssessmentForLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.levelAssessments });
    },
  });
};

export const useGetBranchAssessment = (branchId: number) => {
  return useQuery({
    queryKey: assessmentKeys.getSchoolAssessment,
    queryFn: () => getAssessmentForBranch(branchId),
  });
};

export const useGetAssessmentDefault = () => {
  return useQuery({
    queryKey: assessmentKeys.getAssessmentDefault,
    queryFn: () => getAssessmentDefault(),
  });
};
