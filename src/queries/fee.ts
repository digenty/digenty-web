import type { FeeItemsFilter } from "@/api/fee";
import type { FeeTermType } from "@/api/fee";

export const feeKeys = {
  fees: ["fees"] as const,
  feesByTerm: (termId?: number) => ["fees", termId] as const,
  feeById: (id: number) => ["fee", id] as const,
  feeArms: (id: number) => ["fee", id, "arms"] as const,
  feeItemsByFee: (id: number) => ["fee", id, "items"] as const,
  feeClassOverview: (sessionId: number, term: FeeTermType, branchId?: number) => ["feeClassOverview", sessionId, term, branchId] as const,
  feeItems: (filter?: FeeItemsFilter) => ["feeItems", filter ?? {}] as const,
  feeItemById: (id: number) => ["feeItem", id] as const,
  feeGroups: (branchId?: number, termId?: number) => ["feeGroups", branchId, termId] as const,
  feeGroupOverview: (sessionId: number, term: FeeTermType, branchId?: number) => ["feeGroupOverview", sessionId, term, branchId] as const,
  feeGroupById: (id: number) => ["feeGroup", id] as const,
  feesForInvoice: (branchId: number, classId?: number, termId?: number, search?: string) =>
    ["feesForInvoice", branchId, classId, termId, search] as const,
  feeGroupsForInvoice: (branchId: number, search?: string) => ["feeGroupsForInvoice", branchId, search] as const,
  feeRoutes: ["feeRoutes"] as const,
  feeRoutesByBranch: (branchId: number) => ["feeRoutes", "branch", branchId] as const,
};
