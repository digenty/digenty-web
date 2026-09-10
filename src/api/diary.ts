import { LevelType } from "@/api/types";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

/* ---------------------------------- Enums --------------------------------- */

export type DiaryEntryType = "HOMEWORK" | "REMINDER" | "CLASS_NOTE";
export type DailyReportStatus = "NOT_STARTED" | "DRAFT" | "PUBLISHED";
export type WeeklyReportStatus = "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "PUBLISHED" | "REJECTED";
export type LearningProgress = "EMERGING" | "DEVELOPING" | "SECURE";
export type AcknowledgementFilter = "ALL" | "NOT_SIGNED" | "COMMENTED" | "NOT_OPENED";
export type ParentResponseRule = "REQUIRE_SIGNATURE" | "TRACK_OPENS_ONLY";
export type DiaryTemplateSection = "EARLY_YEARS" | "PRIMARY";
export type SnapshotFieldKey = "MOOD" | "MEALS" | "NAP" | "TOILET" | "INCIDENTS" | "MEDICATION";

/* ---------------------------------- Types --------------------------------- */

export type DiaryEntry = {
  id: number;
  /** Activity or subject label - the paper diary's "DAY / SUBJECT" column. */
  activity: string;
  /** Free-text note shown to parents. */
  note: string;
  type: DiaryEntryType;
  /** ISO date. Only set for HOMEWORK and REMINDER rows. */
  dueDate: string | null;
  position: number;
};

export type DiaryEntryPayload = Omit<DiaryEntry, "id"> & { id?: number };

export type SnapshotField = {
  key: SnapshotFieldKey;
  label: string;
  options: string[];
};

/** Selected snapshot values keyed by SnapshotFieldKey, e.g. { MOOD: "Happy" }. */
export type SnapshotValues = Partial<Record<SnapshotFieldKey, string | null>>;

export type PupilNote = {
  studentId: number;
  studentName: string;
  studentImage: string | null;
  /** Private note visible only to that pupil's parents. */
  note: string | null;
  /** Per-pupil snapshot override; falls back to the class snapshot when null. */
  snapshot: SnapshotValues | null;
};

export type PupilNotePayload = {
  studentId: number;
  note: string | null;
  snapshot?: SnapshotValues | null;
};

export type ClassDiarySummary = {
  armId: number;
  armName: string;
  classId: number;
  className: string;
  levelId: number;
  levelType: LevelType;
  branchId: number;
  branchName: string;
  teacherName: string | null;
  pupilCount: number;
  reportId: number | null;
  status: DailyReportStatus;
  publishedAt: string | null;
  lastSavedAt: string | null;
  lastSavedBy: string | null;
  signedCount: number;
  totalParents: number;
};

export type WeeklyClassDiarySummary = ClassDiarySummary & {
  weeklyReportId: number | null;
  weeklyStatus: WeeklyReportStatus | null;
};

export type DiaryOverview = {
  classCount: number;
  publishedToday: number;
  awaitingSignature: number;
  /** Whole-number percentage over the trailing 7 days. */
  parentResponseRate: number;
};

export type DailyReportDetail = {
  id: number;
  armId: number;
  armName: string;
  className: string;
  branchName: string;
  levelType: LevelType;
  /** ISO date the report covers. */
  date: string;
  status: DailyReportStatus;
  entries: DiaryEntry[];
  snapshotEnabled: boolean;
  snapshotFields: SnapshotField[];
  snapshot: SnapshotValues;
  applySnapshotToClass: boolean;
  pupilNotes: PupilNote[];
  pupilNoteCount: number;
  pupilCount: number;
  recipientCount: number;
  attendancePresent: number;
  attendanceAbsent: number;
  requireAcknowledgement: boolean;
  requestComment: boolean;
  sendPushSms: boolean;
  publishedAt: string | null;
  publishedByName: string | null;
  publishedByRole: string | null;
  lastSavedAt: string | null;
  lastSavedBy: string | null;
};

export type DailyReportStats = {
  recipientCount: number;
  openedCount: number;
  signedCount: number;
  commentCount: number;
};

export type AcknowledgementRow = {
  studentId: number;
  studentName: string;
  studentImage: string | null;
  parentId: number;
  parentName: string;
  openedAt: string | null;
  signedAt: string | null;
  commentPreview: string | null;
};

export type AcknowledgementCounts = {
  all: number;
  notSigned: number;
  commented: number;
  notOpened: number;
};

export type AcknowledgementResponse = {
  counts: AcknowledgementCounts;
  rows: AcknowledgementRow[];
};

export type DiaryReply = {
  id: number;
  message: string;
  authorName: string;
  createdAt: string;
};

export type DiaryComment = {
  id: number;
  parentId: number;
  parentName: string;
  parentImage: string | null;
  studentId: number;
  studentName: string;
  message: string;
  attachmentUrl: string | null;
  createdAt: string;
  reply: DiaryReply | null;
};

export type LearningArea = {
  id: number;
  name: string;
  position: number;
};

export type WeeklyLearningAreaRow = {
  areaId: number;
  areaName: string;
  focus: string;
  progress: LearningProgress | null;
};

export type WeeklyGlance = {
  daysPresent: number;
  daysTotal: number;
  homeworkSet: number;
  notesToParents: number;
  parentResponses: number;
};

export type WeeklyDailyEntrySummary = {
  reportId: number;
  date: string;
  entryCount: number;
  signedCount: number;
  totalParents: number;
};

export type WeeklyReportDetail = {
  id: number;
  armId: number;
  armName: string;
  className: string;
  /** ISO date of the Monday that starts the week. */
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  status: WeeklyReportStatus;
  glance: WeeklyGlance;
  learningAreas: WeeklyLearningAreaRow[];
  teacherComment: string;
  nextWeekFocus: string;
  dailyEntries: WeeklyDailyEntrySummary[];
  recipientCount: number;
  approvalRequired: boolean;
  approverName: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  authorName: string | null;
  authorRole: string | null;
  publishedAt: string | null;
};

export type DiaryTemplate = {
  section: DiaryTemplateSection;
  label: string;
  description: string;
  enabled: boolean;
  snapshotEnabled: boolean;
  privateNoteEnabled: boolean;
  signatureRequired: boolean;
  weeklyReportEnabled: boolean;
  allowedEntryTypes: DiaryEntryType[];
};

export type DiarySnapshotFieldSetting = {
  key: SnapshotFieldKey;
  label: string;
  enabled: boolean;
};

export type DiarySettings = {
  moduleEnabled: boolean;
  templates: DiaryTemplate[];
  parentResponseRule: ParentResponseRule;
  requestComment: boolean;
  remindUnsignedParents: boolean;
  weeklyApprovalRequired: boolean;
  approverStaffId: number | null;
  approverName: string | null;
  approverRole: string | null;
  snapshotFields: DiarySnapshotFieldSetting[];
  termPdfExportEnabled: boolean;
  parentDownloadEnabled: boolean;
};

export type DiarySettingsPayload = Partial<
  Pick<
    DiarySettings,
    | "moduleEnabled"
    | "parentResponseRule"
    | "requestComment"
    | "remindUnsignedParents"
    | "weeklyApprovalRequired"
    | "approverStaffId"
    | "termPdfExportEnabled"
    | "parentDownloadEnabled"
  >
> & {
  templates?: Partial<DiaryTemplate>[];
  snapshotFields?: { key: SnapshotFieldKey; enabled: boolean }[];
};

export type OpenDailyReportRequest = { armId: number; date: string };

export type SaveDailyReportPayload = {
  entries: DiaryEntryPayload[];
  snapshot?: SnapshotValues;
  applySnapshotToClass?: boolean;
  pupilNotes?: PupilNotePayload[];
  requireAcknowledgement?: boolean;
  requestComment?: boolean;
  sendPushSms?: boolean;
};

export type OpenWeeklyReportRequest = { armId: number; weekStart: string };

export type SaveWeeklyReportPayload = {
  learningAreas: { areaId: number; focus: string; progress: LearningProgress | null }[];
  teacherComment: string;
  nextWeekFocus: string;
};

export type ExportTermDiaryRequest = { termId: number; studentId?: number; armId?: number };

export type DiaryOverviewParams = { branchId?: number; termId?: number; date?: string };

export type DiaryClassListParams = {
  branchId?: number;
  termId?: number;
  date?: string;
  search?: string;
  page?: number;
  size?: number;
};

export type WeeklyDiaryClassListParams = DiaryClassListParams & { weekStart?: string };

export type LearningAreaParams = { levelId?: number; levelType?: LevelType };

export type Paginated<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

const buildQuery = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

/* ------------------------------ Staff: reports ---------------------------- */

export const getDiaryOverview = async (params: DiaryOverviewParams = {}): Promise<DiaryOverview> => {
  try {
    const { data } = await api.get(`/diary/overview${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDiaryClasses = async (params: DiaryClassListParams = {}): Promise<Paginated<ClassDiarySummary>> => {
  try {
    const { data } = await api.get(`/diary/classes${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDailyReport = async (reportId: number): Promise<DailyReportDetail> => {
  try {
    const { data } = await api.get(`/diary/reports/${reportId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/** Returns the report for the arm + date, creating a draft when none exists yet. */
export const openDailyReport = async (payload: OpenDailyReportRequest): Promise<DailyReportDetail> => {
  try {
    const { data } = await api.post("/diary/reports", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const saveDailyReport = async (reportId: number, payload: SaveDailyReportPayload): Promise<DailyReportDetail> => {
  try {
    const { data } = await api.patch(`/diary/reports/${reportId}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const publishDailyReport = async (reportId: number, payload: SaveDailyReportPayload): Promise<DailyReportDetail> => {
  try {
    const { data } = await api.post(`/diary/reports/${reportId}/publish`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDailyReportStats = async (reportId: number): Promise<DailyReportStats> => {
  try {
    const { data } = await api.get(`/diary/reports/${reportId}/stats`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getReportAcknowledgements = async (reportId: number, filter?: AcknowledgementFilter): Promise<AcknowledgementResponse> => {
  try {
    const { data } = await api.get(`/diary/reports/${reportId}/acknowledgements${buildQuery({ filter })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getReportComments = async (reportId: number): Promise<DiaryComment[]> => {
  try {
    const { data } = await api.get(`/diary/reports/${reportId}/comments`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const replyToComment = async (reportId: number, commentId: number, message: string): Promise<DiaryComment> => {
  try {
    const { data } = await api.post(`/diary/reports/${reportId}/comments/${commentId}/reply`, { message });
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const replyToAllComments = async (reportId: number, message: string): Promise<{ repliedCount: number }> => {
  try {
    const { data } = await api.post(`/diary/reports/${reportId}/comments/reply-all`, { message });
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const remindUnsignedParents = async (reportId: number): Promise<{ remindedCount: number }> => {
  try {
    const { data } = await api.post(`/diary/reports/${reportId}/remind`, {});
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const exportDailyReportPdf = async (reportId: number): Promise<{ url: string }> => {
  try {
    const { data } = await api.get(`/diary/reports/${reportId}/export`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/* ------------------------------ Staff: weekly ----------------------------- */

export const getWeeklyDiaryClasses = async (params: WeeklyDiaryClassListParams = {}): Promise<Paginated<WeeklyClassDiarySummary>> => {
  try {
    const { data } = await api.get(`/diary/weekly/classes${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/** Returns the weekly report for the arm + week, creating a draft when none exists yet. */
export const openWeeklyReport = async (payload: OpenWeeklyReportRequest): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.post("/diary/weekly", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getWeeklyReport = async (weeklyReportId: number): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.get(`/diary/weekly/${weeklyReportId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const saveWeeklyReport = async (weeklyReportId: number, payload: SaveWeeklyReportPayload): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.patch(`/diary/weekly/${weeklyReportId}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/** Sends for head-teacher approval, or publishes straight to parents when approval is off. */
export const submitWeeklyReport = async (weeklyReportId: number, payload: SaveWeeklyReportPayload): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.post(`/diary/weekly/${weeklyReportId}/submit`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const approveWeeklyReport = async (weeklyReportId: number): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.post(`/diary/weekly/${weeklyReportId}/approve`, {});
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const rejectWeeklyReport = async (weeklyReportId: number, reason: string): Promise<WeeklyReportDetail> => {
  try {
    const { data } = await api.post(`/diary/weekly/${weeklyReportId}/reject`, { reason });
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getLearningAreas = async (params: LearningAreaParams = {}): Promise<LearningArea[]> => {
  try {
    const { data } = await api.get(`/diary/learning-areas${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/* ----------------------------- Staff: settings ---------------------------- */

export const getDiarySettings = async (): Promise<DiarySettings> => {
  try {
    const { data } = await api.get("/diary/settings");
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateDiarySettings = async (payload: DiarySettingsPayload): Promise<DiarySettings> => {
  try {
    const { data } = await api.patch("/diary/settings", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const exportTermDiaryPdf = async (payload: ExportTermDiaryRequest): Promise<{ jobId: string }> => {
  try {
    const { data } = await api.post("/diary/export/term", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
