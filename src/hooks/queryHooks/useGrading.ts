import { addGrading, addGradingDefault, getClassGrading } from "@/api/grading";
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
