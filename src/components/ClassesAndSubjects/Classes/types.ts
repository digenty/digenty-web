export type AllClassesMainTableProps = {
  id: number;
  classArmName: string;
  classTeacherName: string;
  numberOfSubjects: number;
  numberOfEditRequest: 0;
  status: "APPROVED" | "PENDING_APPROVAL" | "NOT_SUBMITTED" | "EDIT_REQUEST";
};

export type ClassProps = {
  subjectId: number;
  subject: string;
  subjectTeacherName: string;
  status: string;
};

export type ClassReportProps = {
  id: number;
  studentName: string;
  subject: number;
};
