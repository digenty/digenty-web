export const feeInvoiceKeys = {
  fees: (branchId?: number, classId?: number, termId?: number, search?: string) =>
    ["feesForInvoice", branchId, classId, termId, search] as const,
  feeGroups: (branchId?: number, search?: string) =>
    ["feeGroupsForInvoice", branchId, search] as const,
};

export const stockInvoiceKeys = {
  stocks: (branchId?: number, search?: string) =>
    ["stocksForInvoice", branchId, search] as const,
};
