export type invoiceBreakdownType = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
  required: boolean;
  stockItemId: number | null;
  feeId: number | null;
};

export type paymentHistoryType = {
  id: number;
  date: string;
  amount: number;
  method: string;
  paidBy: string;      // normalised from PersonRef.name on fetch
  status: string;
  addedBy: string;
  note?: string;
};

export type InvoiceDetailResponse = {
  id: number;
  invoiceNumber: string;
  status: string;
  issuedDate: string;
  dueDate: string;
  issueTo: { id: number; name: string; avatar: string };
  termId: number;
  termName: string;
  branchId: number;
  branchName: string;
  lastUpdated: string;
  lastUpdatedBy: { id: number; name: string; avatar: string };
  items: invoiceBreakdownType[];
  subtotal: number;
  totalAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  paymentProgress: number;
  note: string;
  showAccountDetails: boolean;
};
