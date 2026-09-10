import {
  AcknowledgeReportRequest,
  acknowledgeDailyReport,
  acknowledgeWeeklyReport,
  AddParentCommentRequest,
  addParentDiaryComment,
  addParentWeeklyComment,
  downloadParentReportPdf,
  getParentDailyReport,
  getParentDiaryReports,
  getParentHomework,
  getParentWeeklyReport,
  getParentWeeklyReports,
  ParentDiaryListParams,
  ToggleHomeworkRequest,
  toggleHomeworkDone,
  updateParentDiaryComment,
} from "@/api/parent-diary";
import { parentDiaryKeys } from "@/queries/diary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetParentDiaryReports = (params: Partial<ParentDiaryListParams>) => {
  return useQuery({
    queryKey: parentDiaryKeys.reports(params),
    queryFn: () => getParentDiaryReports(params as ParentDiaryListParams),
    enabled: !!params.studentId,
    retry: false,
  });
};

export const useGetParentDailyReport = (reportId?: number, studentId?: number) => {
  return useQuery({
    queryKey: parentDiaryKeys.report(reportId ?? 0, studentId),
    queryFn: () => getParentDailyReport(reportId as number, studentId as number),
    enabled: !!reportId && !!studentId,
    retry: false,
  });
};

export const useGetParentWeeklyReports = (params: Partial<ParentDiaryListParams>) => {
  return useQuery({
    queryKey: parentDiaryKeys.weeklyReports(params),
    queryFn: () => getParentWeeklyReports(params as ParentDiaryListParams),
    enabled: !!params.studentId,
    retry: false,
  });
};

export const useGetParentWeeklyReport = (weeklyReportId?: number, studentId?: number) => {
  return useQuery({
    queryKey: parentDiaryKeys.weeklyReport(weeklyReportId ?? 0, studentId),
    queryFn: () => getParentWeeklyReport(weeklyReportId as number, studentId as number),
    enabled: !!weeklyReportId && !!studentId,
    retry: false,
  });
};

export const useGetParentHomework = (studentId?: number) => {
  return useQuery({
    queryKey: parentDiaryKeys.homework(studentId),
    queryFn: () => getParentHomework(studentId as number),
    enabled: !!studentId,
    retry: false,
  });
};

const useInvalidateParentDiary = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: parentDiaryKeys.all });
  };
};

export const useAcknowledgeDailyReport = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.acknowledge,
    mutationFn: ({ reportId, payload }: { reportId: number; payload: AcknowledgeReportRequest }) => acknowledgeDailyReport(reportId, payload),
    onSuccess: () => invalidate(),
  });
};

export const useAddParentDiaryComment = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.comment,
    mutationFn: ({ reportId, payload }: { reportId: number; payload: AddParentCommentRequest }) => addParentDiaryComment(reportId, payload),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateParentDiaryComment = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.updateComment,
    mutationFn: ({ commentId, message }: { commentId: number; message: string }) => updateParentDiaryComment(commentId, message),
    onSuccess: () => invalidate(),
  });
};

export const useToggleHomeworkDone = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.toggleHomework,
    mutationFn: ({ reportId, entryId, payload }: { reportId: number; entryId: number; payload: ToggleHomeworkRequest }) =>
      toggleHomeworkDone(reportId, entryId, payload),
    onSuccess: () => invalidate(),
  });
};

export const useAcknowledgeWeeklyReport = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.acknowledge,
    mutationFn: ({ weeklyReportId, payload }: { weeklyReportId: number; payload: AcknowledgeReportRequest }) =>
      acknowledgeWeeklyReport(weeklyReportId, payload),
    onSuccess: () => invalidate(),
  });
};

export const useAddParentWeeklyComment = () => {
  const invalidate = useInvalidateParentDiary();
  return useMutation({
    mutationKey: parentDiaryKeys.comment,
    mutationFn: ({ weeklyReportId, payload }: { weeklyReportId: number; payload: AddParentCommentRequest }) =>
      addParentWeeklyComment(weeklyReportId, payload),
    onSuccess: () => invalidate(),
  });
};

export const useDownloadParentReportPdf = () => {
  return useMutation({
    mutationKey: parentDiaryKeys.download,
    mutationFn: ({ reportId, studentId }: { reportId: number; studentId: number }) => downloadParentReportPdf(reportId, studentId),
  });
};
