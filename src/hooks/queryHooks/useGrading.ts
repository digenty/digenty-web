import { getLevelGrading } from "@/api/grading";
import { gradingKeys } from "@/queries/grading";
import { useQuery } from "@tanstack/react-query";

export const useGetGradingsForLevel = (levelId: number) => {
  return useQuery({
    queryKey: gradingKeys.getClassGrading,
    queryFn: () => getLevelGrading(levelId),
  });
};
