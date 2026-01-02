export interface FeeGroupProp {
  id: number;
  classname: string;
  applyTo: { item1: string; item2: string; count: number };
  totalAmount: number;
}
