import { addAssessment, addAssessmentDefault, getAssessmentDefault, getAssessmentForBranch, updateAssessmentForLevel } from "@/api/assessment";
import { assessmentKeys } from "@/queries/assessment";
import { levelKeys } from "@/queries/level";
import { scoresKey } from "@/queries/score";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddAssessmentDefault = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.addDefault,
    mutationFn: addAssessmentDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levelAssessments] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
    },
  });
};

export const useAddAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.add,
    mutationFn: addAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levelAssessments] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
    },
  });
};

export const useUpdateAssessmentForLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.updateAssessmentForLevel,
    mutationFn: updateAssessmentForLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levelAssessments] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
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
