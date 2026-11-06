import {
  AcknowledgementFilter,
  ApplyDiaryTemplateRequest,
  applyDiaryTemplate,
  approveWeeklyReport,
  DiaryClassListParams,
  DiaryOverviewParams,
  DiarySettingsPayload,
  exportDailyReportPdf,
  ExportTermDiaryRequest,
  exportTermDiaryPdf,
  getDiaryBatch,
  getDiaryBatchStats,
  getDiaryClasses,
  getDiaryOverview,
  getDiaryReportInstance,
  getDiarySettings,
  getDailyReportStats,
  getLearningAreas,
  getReportAcknowledgements,
  getReportComments,
  getWeeklyDiaryClasses,
  getWeeklyReport,
  LearningAreaParams,
  openDiaryBatch,
  openWeeklyReport,
  publishDiaryBatch,
  rejectWeeklyReport,
  remindUnsignedParents,
  replyToAllComments,
  replyToComment,
  SaveDiaryBatchPayload,
  saveDiaryBatch,
  SaveWeeklyReportPayload,
  saveWeeklyReport,
  submitWeeklyReport,
  updateDiarySettings,
  WeeklyDiaryClassListParams,
} from "@/api/diary";
import { diaryKeys } from "@/queries/diary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/* --------------------------------- Queries -------------------------------- */

export const useGetDiaryOverview = (params: DiaryOverviewParams, enabled = true) => {
  return useQuery({
    queryKey: diaryKeys.overview(params),
    queryFn: () => getDiaryOverview(params),
    enabled,
    retry: false,
  });
};

export const useGetDiaryClasses = (params: DiaryClassListParams, enabled = true) => {
  return useQuery({
    queryKey: diaryKeys.classes(params),
    queryFn: () => getDiaryClasses(params),
    enabled,
    retry: false,
  });
};

export const useGetWeeklyDiaryClasses = (params: WeeklyDiaryClassListParams, enabled = true) => {
  return useQuery({
    queryKey: diaryKeys.weeklyClasses(params),
    queryFn: () => getWeeklyDiaryClasses(params),
    enabled,
    retry: false,
  });
};

export const useGetDiaryBatch = (batchId?: number) => {
  return useQuery({
    queryKey: diaryKeys.batch(batchId ?? 0),
    queryFn: () => getDiaryBatch(batchId as number),
    enabled: !!batchId,
    retry: false,
  });
};

export const useGetDiaryBatchStats = (batchId?: number) => {
  return useQuery({
    queryKey: diaryKeys.batchStats(batchId ?? 0),
    queryFn: () => getDiaryBatchStats(batchId as number),
    enabled: !!batchId,
    retry: false,
  });
};

export const useGetDiaryReportInstance = (reportId?: number) => {
  return useQuery({
    queryKey: diaryKeys.report(reportId ?? 0),
    queryFn: () => getDiaryReportInstance(reportId as number),
    enabled: !!reportId,
    retry: false,
  });
};

export const useGetDailyReportStats = (reportId?: number) => {
  return useQuery({
    queryKey: diaryKeys.reportStats(reportId ?? 0),
    queryFn: () => getDailyReportStats(reportId as number),
    enabled: !!reportId,
    retry: false,
  });
};

export const useGetReportAcknowledgements = (reportId?: number, filter?: AcknowledgementFilter) => {
  return useQuery({
    queryKey: diaryKeys.acknowledgements(reportId ?? 0, filter),
    queryFn: () => getReportAcknowledgements(reportId as number, filter),
    enabled: !!reportId,
    retry: false,
  });
};

export const useGetReportComments = (reportId?: number) => {
  return useQuery({
    queryKey: diaryKeys.comments(reportId ?? 0),
    queryFn: () => getReportComments(reportId as number),
    enabled: !!reportId,
    retry: false,
  });
};

export const useGetWeeklyReport = (weeklyReportId?: number) => {
  return useQuery({
    queryKey: diaryKeys.weekly(weeklyReportId ?? 0),
    queryFn: () => getWeeklyReport(weeklyReportId as number),
    enabled: !!weeklyReportId,
    retry: false,
  });
};

export const useGetLearningAreas = (params: LearningAreaParams, enabled = true) => {
  return useQuery({
    queryKey: diaryKeys.learningAreas(params),
    queryFn: () => getLearningAreas(params),
    enabled,
    retry: false,
  });
};

export const useGetDiarySettings = () => {
  return useQuery({
    queryKey: diaryKeys.settings,
    queryFn: getDiarySettings,
    retry: false,
  });
};

const useInvalidateBatch = () => {
  const queryClient = useQueryClient();
  return (batchId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["diary", "classes"] });
    queryClient.invalidateQueries({ queryKey: ["diary", "weekly-classes"] });
    queryClient.invalidateQueries({ queryKey: ["diary", "overview"] });
    if (batchId) {
      queryClient.invalidateQueries({ queryKey: diaryKeys.batch(batchId) });
      queryClient.invalidateQueries({ queryKey: diaryKeys.batchStats(batchId) });
    }
  };
};

export const useOpenDiaryBatch = () => {
  const invalidate = useInvalidateBatch();
  return useMutation({
    mutationKey: diaryKeys.openBatch,
    mutationFn: openDiaryBatch,
    onSuccess: batch => invalidate(batch?.id),
  });
};

export const useSaveDiaryBatch = () => {
  const invalidate = useInvalidateBatch();
  return useMutation({
    mutationKey: diaryKeys.saveBatch,
    mutationFn: ({ batchId, payload }: { batchId: number; payload: SaveDiaryBatchPayload }) => saveDiaryBatch(batchId, payload),
    onSuccess: batch => invalidate(batch?.id),
  });
};

export const usePublishDiaryBatch = () => {
  const invalidate = useInvalidateBatch();
  return useMutation({
    mutationKey: diaryKeys.publishBatch,
    mutationFn: ({ batchId, payload }: { batchId: number; payload: SaveDiaryBatchPayload }) => publishDiaryBatch(batchId, payload),
    onSuccess: result => invalidate(result?.batch?.id),
  });
};

export const useApplyDiaryTemplate = () => {
  const invalidate = useInvalidateBatch();
  return useMutation({
    mutationKey: diaryKeys.applyTemplate,
    mutationFn: ({ batchId, payload }: { batchId: number; payload: ApplyDiaryTemplateRequest }) => applyDiaryTemplate(batchId, payload),
    onSuccess: batch => invalidate(batch?.id),
  });
};

export const useReplyToComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: diaryKeys.replyComment,
    mutationFn: ({ reportId, commentId, message }: { reportId: number; commentId: number; message: string }) =>
      replyToComment(reportId, commentId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: diaryKeys.comments(variables.reportId) });
      queryClient.invalidateQueries({ queryKey: diaryKeys.reportStats(variables.reportId) });
    },
  });
};

export const useReplyToAllComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: diaryKeys.replyAll,
    mutationFn: ({ reportId, message }: { reportId: number; message: string }) => replyToAllComments(reportId, message),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: diaryKeys.comments(variables.reportId) });
    },
  });
};

export const useRemindUnsignedParents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: diaryKeys.remind,
    mutationFn: remindUnsignedParents,
    onSuccess: (_data, reportId) => {
      queryClient.invalidateQueries({ queryKey: diaryKeys.acknowledgements(reportId) });
    },
  });
};

export const useExportDailyReportPdf = () => {
  return useMutation({
    mutationKey: diaryKeys.exportReport,
    mutationFn: exportDailyReportPdf,
  });
};

const useInvalidateWeekly = () => {
  const queryClient = useQueryClient();
  return (weeklyReportId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["diary", "weekly-classes"] });
    if (weeklyReportId) queryClient.invalidateQueries({ queryKey: diaryKeys.weekly(weeklyReportId) });
  };
};

export const useOpenWeeklyReport = () => {
  const invalidate = useInvalidateWeekly();
  return useMutation({
    mutationKey: diaryKeys.openWeekly,
    mutationFn: openWeeklyReport,
    onSuccess: report => invalidate(report?.id),
  });
};

export const useSaveWeeklyReport = () => {
  const invalidate = useInvalidateWeekly();
  return useMutation({
    mutationKey: diaryKeys.saveWeekly,
    mutationFn: ({ weeklyReportId, payload }: { weeklyReportId: number; payload: SaveWeeklyReportPayload }) =>
      saveWeeklyReport(weeklyReportId, payload),
    onSuccess: report => invalidate(report?.id),
  });
};

export const useSubmitWeeklyReport = () => {
  const invalidate = useInvalidateWeekly();
  return useMutation({
    mutationKey: diaryKeys.submitWeekly,
    mutationFn: ({ weeklyReportId, payload }: { weeklyReportId: number; payload: SaveWeeklyReportPayload }) =>
      submitWeeklyReport(weeklyReportId, payload),
    onSuccess: report => invalidate(report?.id),
  });
};

export const useApproveWeeklyReport = () => {
  const invalidate = useInvalidateWeekly();
  return useMutation({
    mutationKey: diaryKeys.approveWeekly,
    mutationFn: approveWeeklyReport,
    onSuccess: report => invalidate(report?.id),
  });
};

export const useRejectWeeklyReport = () => {
  const invalidate = useInvalidateWeekly();
  return useMutation({
    mutationKey: diaryKeys.rejectWeekly,
    mutationFn: ({ weeklyReportId, reason }: { weeklyReportId: number; reason: string }) => rejectWeeklyReport(weeklyReportId, reason),
    onSuccess: report => invalidate(report?.id),
  });
};

export const useUpdateDiarySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: diaryKeys.updateSettings,
    mutationFn: (payload: DiarySettingsPayload) => updateDiarySettings(payload),
    onSuccess: settings => {
      queryClient.setQueryData(diaryKeys.settings, settings);
      // Templates and the response rule change what the composer renders, so drop cached reports too.
      queryClient.invalidateQueries({ queryKey: ["diary", "report"] });
      queryClient.invalidateQueries({ queryKey: ["diary", "batch"] });
    },
  });
};

export const useExportTermDiaryPdf = () => {
  return useMutation({
    mutationKey: diaryKeys.exportTerm,
    mutationFn: (payload: ExportTermDiaryRequest) => exportTermDiaryPdf(payload),
  });
};
