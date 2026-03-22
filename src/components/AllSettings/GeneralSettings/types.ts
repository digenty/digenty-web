export interface SchoolData {
  id: number;
  name: string;
  phoneNumber: string | null;
  email: string | null;
  country: string;
  currency: string;
  logo: string | null;
  motto: string | null;
  timezone: string | null;
  adminId: number;
}

export interface CountryData {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
}

export type EditProps = "editName" | "editSchoolName" | "moto" | "editPhoneNum" | "editBranch" | "newBranch" | null;
