export const branchKeys = {
  allBranchesDetail: (termId: number) => ["allbranches", termId] as const,
  branches: ["branches"] as const,
  branchBySchool: (id: string) => ["branches", id] as const,
  addBranch: ["addBranch"] as const,
  stats: ["stats"] as const,
  editRequest: (branchId: number) => ["editRequest", branchId] as const,
};
