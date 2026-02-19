export interface AllClassesProps {
  ClassArmId: number;
  className: string;
  teacherName: string;
  subjectSheet: number;
  editRequest: string;
  status: string;
}

export interface AllClassesResponse {
  totalArms: number;
  totalPendingSubmissions: number;
  totalCompletedSubmissions: number;
  branchArmReportResponseDtos: AllClassesProps[];
}
