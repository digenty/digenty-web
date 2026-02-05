import { StudentsStatus } from "./types";

export const AdmissionStatusValues = [
  { label: "Graduated", value: "GRADUATED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Total", value: "TOTAL" },
];

export const studentsStatus = [
  { label: "Active Students", value: StudentsStatus.Active },
  { label: "Graduated Students", value: StudentsStatus.Graduated },
  { label: "Suspended Students", value: StudentsStatus.Suspended },
  { label: "Withdrawn Students", value: StudentsStatus.Withdrawn },
  { label: "Inactive Students", value: StudentsStatus.Inactive },
];

export const GenderValues = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const BoardingStatusValues = [
  { label: "Day", value: "DAY" },
  { label: "Boarding", value: "BOARDING" },
];
