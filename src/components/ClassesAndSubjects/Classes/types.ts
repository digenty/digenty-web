export type AllClassesMainTableProps = {
  armId: number;
  classId: number;
  classArmName: string;
  classTeacherName: string;
  numberOfSubjects: number;
  numberOfEditRequest: 0;
  status: "APPROVED" | "PENDING_APPROVAL" | "NOT_SUBMITTED" | "EDIT_REQUEST";
};

export type ClassProps = {
  subjectId: number;
  subjectName: string;
  subjectTeacherName: string;
  status: "SUBMITTED" | "NOT_SUBMITTED" | "IN_PROGRESS" | "REQUESTED_EDIT_ACCESS";
};

export type ClassReportProps = {
  id: number;
  studentName: string;
  subject: number;
};
