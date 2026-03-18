import { addGrading, addGradingDefault, getLevelGrading } from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetGradingsForLevel = (levelId: number) => {
  return useQuery({
    queryKey: gradingKeys.getClassGrading,
    queryFn: () => getLevelGrading(levelId),
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
