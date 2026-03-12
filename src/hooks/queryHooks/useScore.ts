import { addScoreToStudent, viewStudentScore } from "@/api/score";
import { scoresKey } from "@/queries/score";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddScore = () => {
  return useMutation({
    mutationKey: scoresKey.addScore,
    mutationFn: addScoreToStudent,
  });
};

export const useViewScore = (subjectId: number, armId: number, termId?: number) => {
  return useQuery({
    queryKey: scoresKey.getScore,
    queryFn: () => viewStudentScore(subjectId, armId, termId),
    enabled: !!termId,
  });
};
