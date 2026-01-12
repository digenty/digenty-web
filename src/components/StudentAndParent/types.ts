import { BoardingStatus, Gender, StudentStatus } from "@/types";

export interface Student {
  id: string;
  name: string;
  gender: string;
  class: string;
  admissionNumber: string;
  dob: string;
  branch: string;
  tags?: { label: string; color?: "bg-basic-cyan-strong" | "bg-basic-violet-strong"; bgColor?: "bg-badge-cyan" | "bg-badge-violet" }[];
}

export interface Parent {
  id: string;
  name: string;
  gender: string;
  phoneNumber: string;
  emailAddress: string;
  branch: string;
  tags: { label: string; color?: "bg-basic-fuchsia-strong" | "bg-basic-violet-strong"; bgColor?: "bg-badge-fuchsia" | "bg-badge-violet" }[];
}

export interface StudentInputValues {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: Gender;
  boardingStatus: BoardingStatus;
  dateOfBirth: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  studentStatus: StudentStatus;
  admissionNumber: string;
  medicalInformation: string;
  role: string;
  nationality: string;
  stateOfOrigin: string;
  termJoined: string;
  sessionJoined: string;
}

export interface Country {
  id: string;
  name: string;
  iso2: string;
  iso3: string;
  phonecode: string;
  capital: string;
  currency: string;
  native: string;
  emoji: string;
}

export interface State {
  id: string;
  name: string;
  iso2: string;
}
