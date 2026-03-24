import { addGrading, addGradingDefault, getClassGrading, getBranchGradings, getSchoolGradings, updateSchoolGradings } from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetGradingsForClass = (classId: number) => {
  return useQuery({
    queryKey: gradingKeys.getClassGrading,
    queryFn: () => getClassGrading(classId),
  });
};

export const useAddGradingDefault = () => {
  return useMutation({
    mutationKey: gradingKeys.addGradingDefault,
    mutationFn: addGradingDefault,
  });
};

export const useAddGrading = () => {
  return useMutation({
    mutationKey: gradingKeys.addGrading,
    mutationFn: addGrading,
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
