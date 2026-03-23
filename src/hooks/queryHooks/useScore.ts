import { addScoreToStudent, viewStudentScore } from "@/api/score";
import { scoresKey } from "@/queries/score";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: scoresKey.addScore,
    mutationFn: addScoreToStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [subjectKeys.studentsBySubjectClass],
      });
    },
  });
};

export const useViewScore = (subjectId: number, armId: number, termId?: number) => {
  return useQuery({
    queryKey: [scoresKey.getScore, termId],
    queryFn: () => viewStudentScore(subjectId, armId, termId),
    enabled: !!termId,
  });
};
