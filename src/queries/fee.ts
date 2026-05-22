export const feeKeys = {
  fees: ["fees"] as const,
  feeById: (id: number) => ["fee", id] as const,
  feeItems: (branchId?: number, termId?: number) => ["feeItems", branchId, termId] as const,
  feeItemById: (id: number) => ["feeItem", id] as const,
  feeGroups: (branchId?: number) => ["feeGroups", branchId] as const,
  feeGroupById: (id: number) => ["feeGroup", id] as const,
  feeRoutes: ["feeRoutes"] as const,
  feeRoutesByBranch: (branchId: number) => ["feeRoutes", "branch", branchId] as const,
};
