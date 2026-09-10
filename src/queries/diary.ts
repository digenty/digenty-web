import { AcknowledgementFilter, DailyReportStatus, DiaryClassListParams, DiaryEntryType, LearningProgress, WeeklyReportStatus } from "@/api/diary";

export const diaryKeys = {
  all: ["diary"] as const,
  overview: (params?: Record<string, unknown>) => ["diary", "overview", params ?? {}] as const,
  classes: (params?: DiaryClassListParams) => ["diary", "classes", params ?? {}] as const,
  weeklyClasses: (params?: DiaryClassListParams & { weekStart?: string }) => ["diary", "weekly-classes", params ?? {}] as const,
  report: (reportId: number) => ["diary", "report", reportId] as const,
  reportStats: (reportId: number) => ["diary", "report", reportId, "stats"] as const,
  acknowledgements: (reportId: number, filter?: AcknowledgementFilter) => ["diary", "report", reportId, "acknowledgements", filter ?? "ALL"] as const,
  comments: (reportId: number) => ["diary", "report", reportId, "comments"] as const,
  weekly: (weeklyReportId: number) => ["diary", "weekly", weeklyReportId] as const,
  learningAreas: (params?: Record<string, unknown>) => ["diary", "learning-areas", params ?? {}] as const,
  settings: ["diary", "settings"] as const,

  openReport: ["openDiaryReport"] as const,
  saveReport: ["saveDiaryReport"] as const,
  publishReport: ["publishDiaryReport"] as const,
  replyComment: ["replyDiaryComment"] as const,
  replyAll: ["replyAllDiaryComments"] as const,
  remind: ["remindDiaryParents"] as const,
  exportReport: ["exportDiaryReport"] as const,
  openWeekly: ["openWeeklyDiaryReport"] as const,
  saveWeekly: ["saveWeeklyDiaryReport"] as const,
  submitWeekly: ["submitWeeklyDiaryReport"] as const,
  approveWeekly: ["approveWeeklyDiaryReport"] as const,
  rejectWeekly: ["rejectWeeklyDiaryReport"] as const,
  updateSettings: ["updateDiarySettings"] as const,
  exportTerm: ["exportTermDiary"] as const,
};

export const parentDiaryKeys = {
  all: ["parent-diary"] as const,
  reports: (params?: Record<string, unknown>) => ["parent-diary", "reports", params ?? {}] as const,
  report: (reportId: number, studentId?: number) => ["parent-diary", "report", reportId, studentId ?? 0] as const,
  weeklyReports: (params?: Record<string, unknown>) => ["parent-diary", "weekly", params ?? {}] as const,
  weeklyReport: (weeklyReportId: number, studentId?: number) => ["parent-diary", "weekly", weeklyReportId, studentId ?? 0] as const,
  homework: (studentId?: number) => ["parent-diary", "homework", studentId ?? 0] as const,

  acknowledge: ["acknowledgeParentDiary"] as const,
  comment: ["commentParentDiary"] as const,
  updateComment: ["updateParentDiaryComment"] as const,
  toggleHomework: ["toggleParentDiaryHomework"] as const,
  download: ["downloadParentDiaryPdf"] as const,
};

/* ------------------------------ Display config ----------------------------- */

export const DIARY_ENTRY_TYPE_CONFIG: Record<DiaryEntryType, { label: string; dot: string; badge: string; requiresDueDate: boolean }> = {
  HOMEWORK: {
    label: "Homework",
    dot: "bg-bg-basic-blue-accent",
    badge: "bg-bg-badge-blue text-text-default",
    requiresDueDate: true,
  },
  REMINDER: {
    label: "Reminder",
    dot: "bg-bg-basic-amber-accent",
    badge: "bg-bg-badge-amber text-text-default",
    requiresDueDate: true,
  },
  CLASS_NOTE: {
    label: "Class note",
    dot: "bg-bg-basic-gray-accent",
    badge: "bg-bg-badge-white text-text-default",
    requiresDueDate: false,
  },
};

export const DIARY_ENTRY_TYPE_OPTIONS = (Object.keys(DIARY_ENTRY_TYPE_CONFIG) as DiaryEntryType[]).map(value => ({
  value,
  label: DIARY_ENTRY_TYPE_CONFIG[value].label,
}));

export const DAILY_REPORT_STATUS_CONFIG: Record<DailyReportStatus, { label: string; dot: string; badge: string }> = {
  PUBLISHED: { label: "Published", dot: "bg-bg-basic-green-accent", badge: "bg-bg-badge-green text-text-default" },
  DRAFT: { label: "Draft", dot: "bg-bg-basic-amber-accent", badge: "bg-bg-badge-amber text-text-default" },
  NOT_STARTED: { label: "Not started", dot: "bg-bg-basic-gray-accent", badge: "bg-bg-badge-white text-text-default" },
};

export const WEEKLY_REPORT_STATUS_CONFIG: Record<WeeklyReportStatus, { label: string; dot: string; badge: string }> = {
  DRAFT: { label: "Draft", dot: "bg-bg-basic-amber-accent", badge: "bg-bg-badge-amber text-text-default" },
  PENDING_APPROVAL: { label: "Awaiting approval", dot: "bg-bg-basic-amber-accent", badge: "bg-bg-badge-amber text-text-default" },
  APPROVED: { label: "Approved", dot: "bg-bg-basic-green-accent", badge: "bg-bg-badge-green text-text-default" },
  PUBLISHED: { label: "Published", dot: "bg-bg-basic-green-accent", badge: "bg-bg-badge-green text-text-default" },
  REJECTED: { label: "Sent back", dot: "bg-bg-basic-red-accent", badge: "bg-bg-badge-red text-text-default" },
};

export const LEARNING_PROGRESS_CONFIG: Record<LearningProgress, { label: string; active: string }> = {
  EMERGING: { label: "Emerging", active: "border-border-amber bg-bg-badge-amber text-text-default" },
  DEVELOPING: { label: "Developing", active: "border-border-blue bg-bg-badge-blue text-text-default" },
  SECURE: { label: "Secure", active: "border-border-green bg-bg-badge-green text-text-default" },
};

export const LEARNING_PROGRESS_OPTIONS = Object.keys(LEARNING_PROGRESS_CONFIG) as LearningProgress[];

export const ACKNOWLEDGEMENT_FILTERS: { value: AcknowledgementFilter; label: string; countKey: "all" | "notSigned" | "commented" | "notOpened" }[] = [
  { value: "ALL", label: "All", countKey: "all" },
  { value: "NOT_SIGNED", label: "Not signed", countKey: "notSigned" },
  { value: "COMMENTED", label: "Commented", countKey: "commented" },
  { value: "NOT_OPENED", label: "Not opened", countKey: "notOpened" },
];
