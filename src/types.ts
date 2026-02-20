import { JwtPayload } from "jwt-decode";

export type SchoolOption = "Primary School" | "Secondary School";
export type Crumb = { label: string; url?: string };

export enum BoardingStatus {
  Day = "DAY",
  Boarding = "BOARDING",
}

export enum AdmissionStatus {
  Graduated = "GRADUATED",
  Active = "ACTIVE",
  Suspended = "SUSPENDED",
  Withdrawn = "WITHDRAWN",
  Inactive = "INACTIVE",
  Total = "TOTAL",
}

export enum JoinedTermEnum {
  First = "FIRST",
  Second = "SECOND",
  Third = "THIRD",
}

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
}

export const genders = [
  {
    label: "Male",
    value: Gender.Male,
  },
  {
    label: "Female",
    value: Gender.Female,
  },
];

export const terms = [
  {
    label: "First Term",
    value: "FIRST",
  },
  {
    label: "Second Term",
    value: "SECOND",
  },
  {
    label: "Third Term",
    value: "THIRD",
  },
];

interface User {
  id: string;
  branchId: number;
  schoolId: number;
  permissions: string[];
}

export type JWTPayload = JwtPayload & User;

export interface Pagination {
  limit: number;
  page: number;
}

export enum Relationship {
  Mother = "MOTHER",
  Father = "FATHER",
  Guardian = "GUARDIAN",
}

export const relationships = [
  {
    label: "Mother",
    value: Relationship.Mother,
  },
  {
    label: "Father",
    value: Relationship.Father,
  },
  {
    label: "Guardian",
    value: Relationship.Guardian,
  },
];
