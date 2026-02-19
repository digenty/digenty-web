export interface AllBranchesTableProps {
  branchId: number;
  branchName: string;
  BranchHeadName: string;
  numberOfClassArm: number;
  numberOfClassTeacherSubmitted: number | null;
  numberOfPendingApprovals: number | null;
}

export interface AllBranchesStats {
  totalBranchesInSchool?: number;
  totalArmsInSchool?: number;
  totalPendingArmSubmission: number;
  totalArmSubmitted?: number;
  totalPublishedReport?: number;
}
