import { submitClassReport } from "@/api/class";
import { classKeys } from "@/queries/class";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSubmitClassReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: classKeys.submitClassReport,
    mutationFn: submitClassReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [classKeys.classReport()] });
    },
  });
};
