import { AdmissionStatus, BoardingStatus, Gender, Relationship } from "@/types";

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
  emergencyContact: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  admissionStatus: AdmissionStatus;
  admissionNumber: string;
  medicalInformation: string;
  nationality: string;
  stateOfOrigin: string;
  joinedSchoolTerm: string;
  joinedSchoolSession: string;
  branchId: number | null;
  classId: number | null;
  armId: number | null;
}

export interface ParentInputValues {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: Gender;
  address: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  nationality: string;
  stateOfOrigin: string;
  relationship: Relationship;
  branchId: number | null;
}

export interface Country {
  name: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  flag: string;
  timezones: {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
  }[];
  states: string[];
}

export interface State {
  name: string;
}

export interface StudentInputType {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: Gender;
  boardingStatus: BoardingStatus;
  dateOfBirth: string;
  address: string;
  emergencyContactName: string;
  emergencyContact: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  admissionStatus: AdmissionStatus;
  admissionNumber: string;
  medicalInformation: string;
  nationality: string;
  stateOfOrigin: string;
  joinedSchoolTerm: string;
  joinedSchoolSession: string;
  branchId: number | null;
  classId: number | null;
  armId: number | null;
  image?: string;
  tags: string[];
  linkedParents: number[];
}

export interface ParentInputType {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: Gender | null;
  address: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  nationality: string;
  stateOfOrigin: string;
  relationship: Relationship | null;
  branchId: number | null;
  image?: string;
  tags: string[];
  linkedStudents: number[];
}

export enum StudentsStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Graduated = "GRADUATED",
  Suspended = "SUSPENDED",
  Withdrawn = "WITHDRAWN",
  Total = "TOTAL",
}

export interface StaffInputValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
