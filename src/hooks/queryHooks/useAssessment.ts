import { getAssessmentForSchool, updateAssessmentForBranch, updateAssessmentForLevel, updateAssessmentForSchool } from "./../../api/assessment";
// import { getAssessmentForBranch } from "@/api/assessment";
import { assessmentKeys } from "@/queries/assessment";
import { useMutation, useQuery } from "@tanstack/react-query";

// export const useGetBranchAssessment = (branchId: number) => {
//   return useQuery({
//     queryKey: assessmentKeys.getSchoolAssessment,
//     queryFn: () => getAssessmentForBranch(branchId),
//   });
// };

export const useGetSchoolAssessment = () => {
  return useQuery({
    queryKey: assessmentKeys.getSchoolAssessment,
    queryFn: getAssessmentForSchool,
  });
};

export const useUpdateSchoolAssessment = () => {
  return useMutation({
    mutationKey: assessmentKeys.updateAssessmentSchool,
    mutationFn: updateAssessmentForSchool,
  });
};

export const useUpdateBranchlAssessment = () => {
  return useMutation({
    mutationKey: assessmentKeys.updateAssessmentBranch,
    mutationFn: updateAssessmentForBranch,
  });
};

export const useUpdateLevelAssessment = () => {
  return useMutation({
    mutationKey: assessmentKeys.updateAssessmentLevel,
    mutationFn: updateAssessmentForLevel,
  });
};
