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
  emergencyContactNumber: string;
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
  departmentId: number | null;
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
  emergencyContactNumber: string;
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
  departmentId: number | null;
  armId: number | null;
  image: File | null;
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
  image: File | null;
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
