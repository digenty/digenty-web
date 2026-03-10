import { addAssessment, addAssessmentDefault } from "@/api/assessment";
import { assessmentKey } from "@/queries/assessment";
import { useMutation } from "@tanstack/react-query";

export const useAddAssessmentDefault = () => {
  return useMutation({
    mutationKey: assessmentKey.addDefault,
    mutationFn: addAssessmentDefault,
  });
};

export const useAddAssessment = () => {
  return useMutation({
    mutationKey: assessmentKey.add,
    mutationFn: addAssessment,
  });
};
