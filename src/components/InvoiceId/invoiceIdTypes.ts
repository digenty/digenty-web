export type invoiceBreakdownType = {
  name: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
};

export type paymentHistoryType = {
  id: number;
  date: string;
  amount: number;
  method: string;
  paidBy: string;
  status: string;
  addedBy: string;
};
