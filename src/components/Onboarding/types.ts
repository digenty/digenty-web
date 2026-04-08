export interface CreateSchoolTypes {
  firstName?: string;
  lastName?: string;
  schoolName?: string;
  schoolSize?: string;
  role?: string;
  country: string;
  currency?: string;
}

export interface OnBoardingCountry {
  name: string;
  currency: string;
  countryCode: string;
  flag: string;
}

export interface CreateBranchPayload {
  branchDtos: {
    branchName?: string;
    address?: string;
    levels?: string[];
  }[];
}
export type BranchType = "one" | "multiple";
