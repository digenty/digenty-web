// Mirrors FeeGroupSummary from GET /fee/group
export interface FeeGroupProp {
  feeGroupId: number;
  name: string;
  description: string;
  feeNames: string[];
  totalAmount: number;
  appliedToArmsCount: number;
}
