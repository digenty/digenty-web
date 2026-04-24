export interface AllBranchesTableProps {
  branchId: number;
  branchName: string;
  branchHeadName: string;
  numberOfClassArm: number;
  numberOfSubmittedSubjects: number | null;
  numberOfClassTeacherSubmitted: number | null;
  numberOfSubjects: number | null;
  numberOfPendingApprovals: number | null;
}

export interface AllBranchesStats {
  totalBranchesInSchool?: number;
  totalArmsInSchool?: number;
  totalPendingArmSubmission: number;
  totalArmSubmitted?: number;
  totalPublishedReport?: number;
}
