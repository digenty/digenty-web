import { FeeTermType } from "@/api/fee";

export const feeKeys = {
  feeClassOverview: (sessionId?: number, term?: FeeTermType, branchId?: number) =>
    ["feeClassOverview", sessionId, term, branchId] as const,

  fees: (termId?: number) => ["fees", termId] as const,
  feeById: (id?: number) => ["fee", id] as const,

  feeItems: (branchId?: number, termId?: number) => ["feeItems", branchId, termId] as const,
  feeItemById: (id?: number) => ["feeItem", id] as const,

  feeGroups: (branchId?: number) => ["feeGroups", branchId] as const,
  feeGroupById: (id?: number) => ["feeGroup", id] as const,

  feesForPicker: (branchId?: number, classId?: number, termId?: number) =>
    ["feesForPicker", branchId, classId, termId] as const,
  feeGroupsForPicker: (branchId?: number, search?: string) =>
    ["feeGroupsForPicker", branchId, search] as const,

  feeRoutes: ["feeRoutes"] as const,
  feeRoutesByBranch: (branchId?: number) => ["feeRoutes", "branch", branchId] as const,

  createFeeItem: ["createFeeItem"] as const,
  createFeeGroup: ["createFeeGroup"] as const,
  updateFeeGroup: ["updateFeeGroup"] as const,
  deleteFee: ["deleteFee"] as const,
  deleteFeeItem: ["deleteFeeItem"] as const,
  deleteFeeGroup: ["deleteFeeGroup"] as const,

  exportFeeItems: ["exportFeeItems"] as const,
  exportFeeGroups: ["exportFeeGroups"] as const,
  exportClassFees: ["exportClassFees"] as const,
};
