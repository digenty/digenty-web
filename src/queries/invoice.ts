export const invoiceKeys = {
  all: ["invoices"] as const,
  byBranch: (branchId?: number, page?: number, size?: number, classId?: number, termId?: number, search?: string, status?: string, startDate?: string, endDate?: string) =>
    ["invoices", branchId, page, size, classId, termId, search, status, startDate, endDate] as const,
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
  byStudent: (studentId?: number, page?: number, size?: number) => ["invoices", "student", studentId, page, size] as const,
  paymentById: (invoiceId?: string, paymentId?: string) => ["invoices", "payment", invoiceId, paymentId] as const,
  preview: (invoiceId?: string) => ["invoices", "preview", invoiceId] as const,
};
