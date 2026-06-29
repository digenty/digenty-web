// Mirrors FeeItemDetail from GET /fee/items
export interface FeeItemProp {
  feeItemId: number;
  feeClassId: number;
  feeName: string;
  amount: number;
  quantity: number;
  required: boolean;
  allowPartPayment: boolean;
  minimumPartPayment: number;
}
