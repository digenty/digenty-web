export interface Invoice {
  id: number;
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  issuedDate: string;
  dueDate?: string;
  totalAmount: number;
  termId?: number;
}
