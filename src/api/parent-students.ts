import { FeeStatus, PendingFeeItem } from "@/api/parent-fees";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export interface StudentOverviewResponse {
  studentId: number;
  studentName: string;
  parentName: string;
  termName: string;
  outstandingBalance: number;
  totalPaid: number;
  feeStatus: FeeStatus;
  pendingFees: PendingFeeItem[];
}

export interface AssessmentScoreDto {
  assessmentId: number;
  assessmentName: string;
  score: number;
  weight: number;
}

export interface SubjectReportRow {
  subjectName: string;
  assessments: AssessmentScoreDto[];
  total: number;
  grade: string;
  remark: string;
}

export interface StudentReportCardResponse {
  schoolName: string;
  sessionName: string;
  studentId: number;
  studentName: string;
  className: string;
  totalSchoolDays: number;
  totalPresent: number;
  totalAbsent: number;
  neatness: string;
  punctuality: string;
  diligence: string;
  subjectReports: SubjectReportRow[];
  overallPercentage: number;
  classTeacherComment: string;
  principalComment: string;
  nextTermBegins: string;
}

export const getParentStudents = async (): Promise<StudentOverviewResponse[]> => {
  try {
    const { data } = await api.get(`/parent/portal/students`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStudentOverview = async (studentId: number): Promise<StudentOverviewResponse> => {
  try {
    const { data } = await api.get(`/parent/portal/students/${studentId}/overview`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getStudentAcademicRecord = async (studentId: number, termId?: number): Promise<StudentReportCardResponse> => {
  try {
    const params = new URLSearchParams();
    if (termId) params.append("termId", String(termId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/students/${studentId}/academic-record${qs ? `?${qs}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
