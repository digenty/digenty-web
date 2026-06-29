// Mirrors ClassFeeOverview (a class row within GET /fee/class/overview)
export interface ClassFeeTypes {
  id: number;
  classname: string;
  feeNames: string[];
  totalAmount: number;
}
