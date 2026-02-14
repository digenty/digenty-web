export type ScoreType = {
  studentId: number;
  studentName: string;
  CA1?: number;
  CA2?: number;
  examScore?: number;
  totalScore?: number;
  grade?: string;
  remark?: string;
};

export interface StudentReportPayload {
  studentId: number;
  CA1: number;
  CA2: number;
  examScore: number;
}

export interface SubmitScorePayload {
  subjectId: number;
  armId: number;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "IN_PROGRESS" | "REQUEST_EDIT_ACCESS";
  studentReports: StudentReportPayload[];
}
