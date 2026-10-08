import {
  addAssessment,
  addAssessmentDefault,
  deleteAssessment,
  getAssessmentDefault,
  getAssessmentForBranch,
  updateAssessmentForLevel,
  updateMidtermAssessments,
} from "@/api/assessment";
import { midtermKeys } from "@/queries/midterm";
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
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
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
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
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
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
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

export const useUpdateMidtermAssessments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.updateMidterm,
    mutationFn: updateMidtermAssessments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levelAssessments] });
      queryClient.invalidateQueries({ queryKey: assessmentKeys.getAssessmentDefault });
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: assessmentKeys.deleteAssessment,
    mutationFn: deleteAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [levelKeys.levelAssessments] });
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
    },
  });
};
