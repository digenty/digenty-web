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
