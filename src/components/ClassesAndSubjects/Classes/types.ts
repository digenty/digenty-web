export type AllClassesMainTableProps = {
  id: number;
  className: string;
  teacherName: string;
  subjectSheet: number;
  editRequest: string;
  status: "Approved" | "Pending Approval" | "Not Submitted" | "Edit Request";
};

export type ClassProps = {
  id: number;
  subject: string;
  teacherName: string;
  status: string;
};

export type ClassReportProps = {
  id: number;
  studentName: string;
  subject: number;
};
