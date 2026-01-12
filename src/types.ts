export type SchoolOption = "Primary School" | "Secondary School";
export type Crumb = { label: string; url?: string };

export enum BoardingStatus {
  Day = "Day",
  Boarding = "Boarding",
}

export enum StudentStatus {
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
