export interface FeeGroupApiItem {
  feeGroupId: number;
  name: string;
  description: string;
  feeNames: string[];
  totalAmount: number;
  appliedToArmsCount: number;
}

export interface FeeGroupProp {
  id: number;
  name: string;
  feeNames: string[];
  totalAmount: number;
  appliedToArmsCount: number;
}
