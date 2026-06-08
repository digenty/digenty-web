export const feeInvoiceKeys = {
  fees: (branchId?: number, classId?: number, termId?: number, search?: string) =>
    ["feesForInvoice", branchId, classId, termId, search] as const,
  feeGroups: (branchId?: number, search?: string) =>
    ["feeGroupsForInvoice", branchId, search] as const,
};

export const stockInvoiceKeys = {
  stocks: (branchId?: number, search?: string) =>
    ["stocksForInvoice", branchId, search] as const,
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
