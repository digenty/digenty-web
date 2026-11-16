import { addScoreToStudent, viewStudentScore } from "@/api/score";
import { scoresKey } from "@/queries/score";
import { subjectKeys } from "@/queries/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refreshIfStale } from "@/lib/academicStructureCache";

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
    // "Subject '…' is not taught in this class" / 404: the subject was removed from the class, so refresh the subject list.
    onError: refreshIfStale(queryClient),
  });
};

export const useViewScore = (subjectId: number, armId: number, termId?: number) => {
  return useQuery({
    queryKey: [scoresKey.getScore, termId],
    queryFn: () => viewStudentScore(subjectId, armId, termId),
    enabled: !!termId,
  });
};
