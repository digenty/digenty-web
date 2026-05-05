export type InvoicesOverviewTableProps = {
  invoiceId: string;
  studentName: string;
  amount: number;
  status: string;
  lastActivity: string;
};

export type InvoicesResponse = {
  totalIssued: number;
  totalPaid: number;
  outstandingFees: number;
  invoices: InvoicesOverviewTableProps[];
  totalElements?: number;
};

export const formatInvoiceStatus = (status?: string) => {
  if (!status) return "";
  const map: Record<string, string> = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    OUTSTANDING: "Outstanding",
    FULLY_PAID: "Fully Paid",
    DRAFT: "Draft",
  };
  return map[status.toUpperCase()] ?? status;
};

export const formatNaira = (amount?: number) => `₦${(amount ?? 0).toLocaleString()}`;
