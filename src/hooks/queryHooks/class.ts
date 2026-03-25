import { getRequiredSubjectReport, setPromotionDecision, submitClassReport } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSubmitClassReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [classKeys.submitClassReport],
    mutationFn: (payload: { classArmReportId: number; status: "PENDING_APPROVAL" }) => submitClassReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classReport()] });
    },
  });
};

export const useSetPromotionDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [classKeys.setPromotionDecision],
    mutationFn: (payload: {
      armId: number;
      sessionId: number;
      decisions: {
        studentId: number;
        status: string;
        toClassId?: number;
        toArmId?: number;
      }[];
    }) => setPromotionDecision(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classCumulativeReport()] });
    },
  });
};

export const useGetRequiredSubjectReport = (armId: number, isSubjectCombination: boolean) => {
  return useQuery({
    queryKey: classKeys.requiredSubjectReport(armId),
    queryFn: () => getRequiredSubjectReport(armId),
    enabled: isSubjectCombination,
  });
};
