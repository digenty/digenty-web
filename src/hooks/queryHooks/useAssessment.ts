import { getAssessmentForBranch } from "@/api/assessment";
import { assessmentKeys } from "@/queries/assessment";
import { useQuery } from "@tanstack/react-query";

export const useGetBranchAssessment = (branchId: number) => {
  return useQuery({
    queryKey: assessmentKeys.getSchoolAssessment,
    queryFn: () => getAssessmentForBranch(branchId),
  });
};
