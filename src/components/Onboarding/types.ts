export interface CreateSchoolTypes {
  firstName?: string;
  lastName?: string;
  schoolName?: string;
  schoolSize?: number;
  role?: string;
  country?: string;
  currency?: string;
}

export interface OnBoardingCountry {
  id: string;
  name: string;
  code?: number;
  currency?: string;
  iso2?: string;
}

export interface CreateBranchPayload {
  branchDtos: {
    branchName?: string;
    address?: string;
    levels?: string[];
  }[];
}
export type BranchType = "one" | "multiple";
