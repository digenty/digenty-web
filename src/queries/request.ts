export const requestKeys = {
  all: ["requests"] as const,
  requestsByBranch: ["requestsByBranch"] as const,
  approveEditRequestBulk: ["approve-edit-request-bulk"] as const,
  approveEditRequest: ["approve-edit-request"] as const,
  editRequest: (branchId: number) => ["editRequest", branchId] as const,
  editRequestBySubjectAndArm: ["editRequestBySubjectAndArm"] as const,
};
