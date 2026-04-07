export interface CreateSchoolTypes {
  firstName?: string;
  lastName?: string;
  schoolName?: string;
  schoolSize?: string;
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

export const DRAFT_KEY_SCHOOL = "onboarding:school";
export const DRAFT_KEY_BRANCH = "onboarding:branch";
export const DRAFT_KEY_STEP = "onboarding:step";
