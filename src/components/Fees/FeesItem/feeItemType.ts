export interface FeeItemProp {
  id: number;
  feeName: string;
  status: string;
  applyTo: { school: string; count: number };
  totalAmount: number;
}
