export const branchKeys = {
  allBranchesDetail: (termId?: number, search?: string) => ["allbranches", termId, search] as const,
  branches: ["branches"] as const,
  branchBySchool: (id: string) => ["branches", id] as const,
  addBranch: ["addBranch"] as const,
  stats: ["stats"] as const,
  branchDetail: (branchId: number, termId?: number, search?: string, levelId?: number) =>
    ["branchDetail", branchId, termId, search, levelId] as const,
  updateBranch: ["updateBranch"] as const,
  delete: ["deleteBranch"] as const,
};
