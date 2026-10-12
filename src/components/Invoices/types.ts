export type InvoicesOverviewTableProps = {
  invoiceId: string;
  studentName: string;
  amount: number;
  status: string;
  lastActivity: string;
  invoiceNumber: string;
};

export type InvoicesResponse = {
  /** Required fee items only. */
  totalRequiredIssued?: number;
  totalRequiredPaid?: number;
  /** Optional fee items only. */
  totalOptionalIssued?: number;
  totalOptionalPaid?: number;
  outstandingFees: number;
  /** @deprecated Combined totals; used as the required totals until the backend sends the split fields. */
  totalIssued?: number;
  /** @deprecated See totalIssued. */
  totalPaid?: number;
  invoices: InvoicesOverviewTableProps[];
  totalElements?: number;
};

export const formatInvoiceStatus = (status?: string) => {
  if (!status) return "";
  const map: Record<string, string> = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    PARTIALLY_PAID: "Partially Paid",
    DRAFT: "Draft",
  };
  return map[status.toUpperCase()] ?? status;
};

export const formatNaira = (amount?: number) => `₦${(amount ?? 0).toLocaleString()}`;
