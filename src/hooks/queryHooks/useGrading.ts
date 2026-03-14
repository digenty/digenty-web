import {
  getBranchGradings,
  getClassGrading,
  getSchoolGradings,
  updateBranchGradings,
  updateLevelGradings,
  updateSchoolGradings,
} from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetGradingsForClass = (classId: number) => {
  return useQuery({
    queryKey: gradingKeys.getClassGrading,
    queryFn: () => getClassGrading(classId),
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
export const useUpdateBranchGradings = () => {
  return useMutation({
    mutationKey: gradingKeys.updateBranchGrading,
    mutationFn: updateBranchGradings,
  });
};

export const useUpdateLevelGradings = () => {
  return useMutation({
    mutationKey: gradingKeys.updateLevelGrading,
    mutationFn: updateLevelGradings,
  });
};
