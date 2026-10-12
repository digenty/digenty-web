import {
  getMidtermClassOverview,
  getMidtermStudentReport,
  getParentMidtermReport,
  publishMidtermReport,
  unpublishMidtermReport,
} from "@/api/midterm";
import { midtermKeys } from "@/queries/midterm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetMidtermStudentReport = ({
  studentId,
  armId,
  termId,
  enabled = true,
}: {
  studentId?: number;
  armId?: number;
  termId?: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: midtermKeys.studentReport(studentId, armId, termId),
    queryFn: () => getMidtermStudentReport({ studentId: studentId!, armId: armId!, termId }),
    enabled: enabled && !!studentId && !!armId,
    retry: false,
  });
};

export const useGetMidtermClassOverview = ({ armId, termId, enabled = true }: { armId?: number; termId?: number; enabled?: boolean }) => {
  return useQuery({
    queryKey: midtermKeys.classOverview(armId, termId),
    queryFn: () => getMidtermClassOverview({ armId: armId!, termId }),
    enabled: enabled && !!armId,
    retry: false,
  });
};

/**
 * A class has a mid-term report once at least one of its assessment components is flagged. The overview
 * endpoint answers 400 until then, so a successful response is the class-scoped "mid-term is on" signal
 * (the setup GET is keyed by level, which a class arm screen doesn't have to hand).
 */
export const useIsMidtermEnabled = (armId?: number) => {
  const { isSuccess, isLoading } = useGetMidtermClassOverview({ armId });
  return { enabled: isSuccess, isLoading };
};

export const usePublishMidtermReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: midtermKeys.publish,
    mutationFn: publishMidtermReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
    },
  });
};

export const useUnpublishMidtermReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: midtermKeys.unpublish,
    mutationFn: unpublishMidtermReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: midtermKeys.all });
    },
  });
};

export const useGetParentMidtermReport = (studentId?: number, termId?: number) => {
  return useQuery({
    queryKey: midtermKeys.parentReport(studentId, termId),
    queryFn: () => getParentMidtermReport(studentId!, termId),
    enabled: !!studentId,
    retry: false,
  });
};
