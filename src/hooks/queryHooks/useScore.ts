import { addScoreToStudent } from "@/api/score";
import { toast } from "@/components/Toast";
import { scoresKey } from "@/queries/score";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addScoreToStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: scoresKey.addScore,
      });

      toast({
        title: "Scores submitted successfully!",
        type: "success",
      });
    },
    onError: error => {
      toast({
        title: "Failed to submit scores",
        description: error?.message || "Please try again.",
        type: "error",
      });
    },
  });
};
