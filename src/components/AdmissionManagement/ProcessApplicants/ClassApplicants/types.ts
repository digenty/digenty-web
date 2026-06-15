import { ApplicantListItemDto, ApplicantStatus } from "@/api/admission";

export type AdmissionStatus = "Pending" | "Admitted" | "Rejected";

export interface Applicant {
  id: number;
  name: string;
  image?: string;
  applicantId: string;
  status: AdmissionStatus;
  totalScore: number | null;
  dateApplied: string;
}

export const API_TO_DISPLAY_STATUS: Record<ApplicantStatus, AdmissionStatus> = {
  PENDING: "Pending",
  ADMITTED: "Admitted",
  REJECTED: "Rejected",
};

export const DISPLAY_TO_API_STATUS: Record<AdmissionStatus, ApplicantStatus> = {
  Pending: "PENDING",
  Admitted: "ADMITTED",
  Rejected: "REJECTED",
};

export const mapApplicant = (dto: ApplicantListItemDto): Applicant => ({
  id: dto.id,
  name: dto.studentName,
  applicantId: dto.applicantNumber,
  status: API_TO_DISPLAY_STATUS[dto.status],
  totalScore: dto.totalScore ?? null,
  dateApplied: dto.dateApplied,
});
