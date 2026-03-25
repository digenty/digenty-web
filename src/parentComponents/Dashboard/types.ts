export interface pendingFees {
  id: number;
  title: string;
  amount: number;
  status: "UNPAID" | "PARTIALLY_PAID";
}
