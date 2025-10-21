export interface Student {
  id: string;
  name: string;
  gender: string;
  class: string;
  admissionNumber: string;
  dob: string;
  branch: string;
  tags?: { label: string; color?: "blue" | "purple" | "gray" }[];
}
