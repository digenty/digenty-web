import {
  addGrading,
  addGradingDefault,
  getClassGrading,
  getBranchGradings,
  getSchoolGradings,
  updateSchoolGradings,
  getGradingsByLevel,
  updateGradingsForLevel,
} from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { scoresKey } from "@/queries/score";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetGradingsForClass = (classId: number) => {
  return useQuery({
    queryKey: [gradingKeys.getClassGrading, classId],
    queryFn: () => getClassGrading(classId),
  });
};

export const useGetGradingsByLevel = (levelId?: number) => {
  return useQuery({
    queryKey: [gradingKeys.getGradingsByLevel, levelId],
    queryFn: () => getGradingsByLevel(levelId!),
    enabled: !!levelId,
  });
};

export const useAddGradingDefault = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: gradingKeys.addGradingDefault,
    mutationFn: addGradingDefault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getGradingsByLevel] });
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getClassGrading] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
    },
  });
};

export const useAddGrading = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: gradingKeys.addGrading,
    mutationFn: addGrading,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getGradingsByLevel] });
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getClassGrading] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
    },
  });
};

export const useUpdateGradingsForLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: gradingKeys.updateGradingsForLevel,
    mutationFn: updateGradingsForLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getGradingsByLevel] });
      queryClient.invalidateQueries({ queryKey: [gradingKeys.getClassGrading] });
      queryClient.invalidateQueries({ queryKey: [subjectKeys.studentsBySubjectClass] });
      queryClient.invalidateQueries({ queryKey: [scoresKey.getScore] });
    },
  });
};

export const useGetBranchGradings = (branchId: number) => {
  return useQuery({
    queryKey: gradingKeys.getBranchGrading,
    queryFn: () => getBranchGradings(branchId),
  });
};
export const useGetSchoolGradings = () => {
  return useQuery({
    queryKey: gradingKeys.getSchoolGrading,
    queryFn: getSchoolGradings,
  });
};

export const useUpdateSchoolGradings = () => {
  return useMutation({
    mutationKey: gradingKeys.updateSchoolGrading,
    mutationFn: updateSchoolGradings,
  });
};
