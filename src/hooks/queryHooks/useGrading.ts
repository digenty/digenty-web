import { getClassGrading } from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { useQuery } from "@tanstack/react-query";

export const useGetGradingsForClass = (classId: number) => {
  return useQuery({
    queryKey: gradingKeys.getClassGrading,
    queryFn: () => getClassGrading(classId),
  });
};
