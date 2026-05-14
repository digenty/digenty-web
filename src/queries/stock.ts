export const stockKeys = {
  stocks: (branchId?: number, search?: string, page?: number) =>
    ["stocks", branchId, search, page] as const,
};
