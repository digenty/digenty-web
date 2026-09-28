export const parentFeesKeys = {
  overview: (studentId?: number, termId?: number) => ["parentFeeOverview", studentId, termId] as const,
  pay: (studentId?: number, termId?: number) => ["parentPayFees", studentId, termId] as const,
  invoice: (studentId?: number, termId?: number) => ["parentFeeInvoice", studentId, termId] as const,
  paymentHistory: (studentId?: number, termId?: number, page?: number, size?: number) =>
    ["parentPaymentHistory", studentId, termId, page, size] as const,
};
