export const requestKeys = {
  all: ["requests"] as const,
  requestsByBranch: (branchId?: number, search?: string) => ["requests", branchId, { search }] as const,
};
