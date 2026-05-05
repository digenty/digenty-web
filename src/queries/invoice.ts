export const invoiceKeys = {
  all: ["invoices"] as const,
  byBranch: (branchId?: number, page?: number, size?: number, classId?: number, termId?: number, search?: string) =>
    ["invoices", branchId, page, size, classId, termId, search] as const,
  detail: (invoiceId?: string) => ["invoices", "detail", invoiceId] as const,
  addPayment: (invoiceId?: string) => ["invoices", "addPayment", invoiceId] as const,
  updatePayment: (invoiceId?: string, paymentId?: string) => ["invoices", "updatePayment", invoiceId, paymentId] as const,
  create: ["invoices", "create"] as const,
  draft: ["invoices", "draft"] as const,
  update: (invoiceId?: string) => ["invoices", "update", invoiceId] as const,
  nextNumber: (branchId?: number) => ["invoices", "nextNumber", branchId] as const,
  settings: (branchId?: number) => ["invoices", "settings", branchId] as const,
  paymentHistory: (invoiceId?: string) => ["invoices", "paymentHistory", invoiceId] as const,
  sendReminder: (invoiceId?: string) => ["invoices", "sendReminder", invoiceId] as const,
  deleteInvoice: (invoiceId?: string) => ["invoices", "delete", invoiceId] as const,
};
