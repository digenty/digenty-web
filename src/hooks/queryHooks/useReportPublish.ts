import { publishBranchReports, unpublishBranchReports } from "@/api/report-publish";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useInvalidateReports = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["allbranches"] });
    queryClient.invalidateQueries({ queryKey: ["studentReport"] });
  };
};

export const usePublishBranchReports = () => {
  const invalidate = useInvalidateReports();
  return useMutation({ mutationKey: ["publishBranchReports"], mutationFn: publishBranchReports, onSuccess: invalidate });
};

export const useUnpublishBranchReports = () => {
  const invalidate = useInvalidateReports();
  return useMutation({ mutationKey: ["unpublishBranchReports"], mutationFn: unpublishBranchReports, onSuccess: invalidate });
};
