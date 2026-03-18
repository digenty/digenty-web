import { Gender, Relationship } from "@/types";

export type Step = {
  id: number;
  label: string;
  completed: boolean;
};

export type StudentUploadType = {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: Gender;
  email: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
  stateOfOrigin: string;
  emergencyContactNumber: string;
  phoneNumber: string;
  admissionNumber: string;
  branch: string;
  class: string;
  arm: string;
};

export type ParentUploadType = {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: Gender;
  email: string;
  phoneNumber: string;
  relationship: Relationship;
  nationality: string;
  stateOfOrigin: string;
  address: string;
  secondaryPhoneNumber: string;
  branch: string;
};
