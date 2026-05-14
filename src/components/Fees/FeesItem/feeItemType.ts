export interface FeeItemApiItem {
  feeItemId: number;
  feeClassId: number;
  feeName: string;
  amount: number;
  quantity: number;
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number;
}

export interface FeeItemProp {
  id: number;
  feeName: string;
  status: string;
  applyTo: { school: string; count: number };
  totalAmount: number;
}
