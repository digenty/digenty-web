import { DiaryEntryType, SnapshotFieldKey, WeeklyGlance, WeeklyLearningAreaRow } from "@/api/diary";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

/* ---------------------------------- Types --------------------------------- */

export type ParentDiaryStatus = "AWAITING_SIGNATURE" | "SIGNED" | "NO_SIGNATURE_REQUIRED";

export type ParentAttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type ParentDiaryEntry = {
  id: number;
  activity: string;
  note: string;
  type: DiaryEntryType;
  dueDate: string | null;
  /** Only meaningful for HOMEWORK rows - the parent ticks these off at home. */
  completedAt: string | null;
};

export type ParentDiarySnapshotItem = {
  key: SnapshotFieldKey;
  label: string;
  value: string;
};

export type ParentDiaryComment = {
  id: number;
  message: string;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  replyMessage: string | null;
  replyAuthorName: string | null;
  replyCreatedAt: string | null;
};

export type ParentDiaryReportSummary = {
  reportId: number;
  studentId: number;
  date: string;
  teacherName: string;
  publishedAt: string;
  status: ParentDiaryStatus;
  signedAt: string | null;
  entries: ParentDiaryEntry[];
  homeworkCount: number;
  reminderCount: number;
  hasComment: boolean;
  hasTeacherReply: boolean;
};

export type ParentDailyReportDetail = {
  reportId: number;
  studentId: number;
  studentName: string;
  armName: string;
  className: string;
  date: string;
  teacherName: string;
  teacherRole: string;
  teacherImage: string | null;
  publishedAt: string;
  status: ParentDiaryStatus;
  signedAt: string | null;
  signedByName: string | null;
  /** Pulled from the attendance register for this child on this date. */
  attendanceStatus: ParentAttendanceStatus | null;
  arrivedAt: string | null;
  entries: ParentDiaryEntry[];
  snapshot: ParentDiarySnapshotItem[];
  privateNote: string | null;
  commentRequested: boolean;
  signatureRequired: boolean;
  downloadEnabled: boolean;
  comment: ParentDiaryComment | null;
  /** Name the acknowledgement will be recorded under. */
  signingAsName: string;
  signingAsRelationship: string;
};

export type ParentWeeklyReportSummary = {
  weeklyReportId: number;
  studentId: number;
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  publishedAt: string;
  status: ParentDiaryStatus;
  signedAt: string | null;
  hasTeacherReply: boolean;
};

export type ParentWeeklyGlance = WeeklyGlance & {
  homeworkDone: number;
  parentComments: number;
};

export type ParentWeeklyReportDetail = {
  weeklyReportId: number;
  studentId: number;
  studentName: string;
  armName: string;
  weekNumber: number;
  weekStart: string;
  weekEnd: string;
  teacherName: string;
  teacherRole: string;
  teacherImage: string | null;
  approvedByName: string | null;
  publishedAt: string;
  status: ParentDiaryStatus;
  signedAt: string | null;
  signedByName: string | null;
  /** Per-child figures, not the class figures the teacher sees. */
  glance: ParentWeeklyGlance;
  learningAreas: WeeklyLearningAreaRow[];
  teacherComment: string;
  nextWeekFocus: string;
  comment: ParentDiaryComment | null;
  downloadEnabled: boolean;
  signingAsName: string;
};

export type ParentHomeworkItem = {
  entryId: number;
  reportId: number;
  studentId: number;
  activity: string;
  note: string;
  dueDate: string;
  completedAt: string | null;
};

export type ParentDiaryListParams = {
  studentId: number;
  termId?: number;
  page?: number;
  size?: number;
};

export type AcknowledgeReportRequest = { studentId: number; comment?: string };

export type AddParentCommentRequest = { studentId: number; message: string; attachmentUrl?: string | null };

export type ToggleHomeworkRequest = { studentId: number; done: boolean };

const BASE = "/parent/portal/diary";

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

/* ------------------------------- Daily reports ---------------------------- */

export const getParentDiaryReports = async (params: ParentDiaryListParams): Promise<ParentDiaryReportSummary[]> => {
  try {
    const { data } = await api.get(`${BASE}/reports${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getParentDailyReport = async (reportId: number, studentId: number): Promise<ParentDailyReportDetail> => {
  try {
    const { data } = await api.get(`${BASE}/reports/${reportId}${buildQuery({ studentId })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/** Records the "Seen and signed" acknowledgement, optionally with the parent comment in the same call. */
export const acknowledgeDailyReport = async (reportId: number, payload: AcknowledgeReportRequest): Promise<ParentDailyReportDetail> => {
  try {
    const { data } = await api.post(`${BASE}/reports/${reportId}/acknowledge`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addParentDiaryComment = async (reportId: number, payload: AddParentCommentRequest): Promise<ParentDiaryComment> => {
  try {
    const { data } = await api.post(`${BASE}/reports/${reportId}/comments`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateParentDiaryComment = async (commentId: number, message: string): Promise<ParentDiaryComment> => {
  try {
    const { data } = await api.patch(`${BASE}/comments/${commentId}`, { message });
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const toggleHomeworkDone = async (reportId: number, entryId: number, payload: ToggleHomeworkRequest): Promise<ParentDiaryEntry> => {
  try {
    const { data } = await api.patch(`${BASE}/reports/${reportId}/entries/${entryId}/homework`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getParentHomework = async (studentId: number): Promise<ParentHomeworkItem[]> => {
  try {
    const { data } = await api.get(`${BASE}/homework${buildQuery({ studentId })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const downloadParentReportPdf = async (reportId: number, studentId: number): Promise<{ url: string }> => {
  try {
    const { data } = await api.get(`${BASE}/reports/${reportId}/export${buildQuery({ studentId })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

/* ------------------------------ Weekly reports ---------------------------- */

export const getParentWeeklyReports = async (params: ParentDiaryListParams): Promise<ParentWeeklyReportSummary[]> => {
  try {
    const { data } = await api.get(`${BASE}/weekly${buildQuery({ ...params })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getParentWeeklyReport = async (weeklyReportId: number, studentId: number): Promise<ParentWeeklyReportDetail> => {
  try {
    const { data } = await api.get(`${BASE}/weekly/${weeklyReportId}${buildQuery({ studentId })}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const acknowledgeWeeklyReport = async (weeklyReportId: number, payload: AcknowledgeReportRequest): Promise<ParentWeeklyReportDetail> => {
  try {
    const { data } = await api.post(`${BASE}/weekly/${weeklyReportId}/acknowledge`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addParentWeeklyComment = async (weeklyReportId: number, payload: AddParentCommentRequest): Promise<ParentDiaryComment> => {
  try {
    const { data } = await api.post(`${BASE}/weekly/${weeklyReportId}/comments`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
