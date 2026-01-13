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

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
}

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
}

export type JWTPayload = JwtPayload & User;

export interface Pagination {
  limit: number;
  page: number;
}
