export type AdmissionStatus = "Pending" | "Admitted" | "Rejected";

export interface Applicant {
  id: string;
  name: string;
  image?: string;
  applicantId: string;
  classId: string;
  status: AdmissionStatus;
  totalScore: number | null;
  dateApplied: string;
}
