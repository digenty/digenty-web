import { Gender, Relationship } from "@/types";

export type Step = {
  id: number;
  label: string;
  completed: boolean;
};

export type UploadRowError = {
  field: string;
  code: string;
  message: string;
};

export type UploadValidRow = {
  rowNumber: number;
  data: Record<string, string>;
};

export type UploadInvalidRow = {
  rowNumber: number;
  data: Record<string, string>;
  errors: UploadRowError[];
};

export type ValidateUploadResponse = {
  batchId: string;
  expiresAt: string;
  fileName: string;
  summary: { total: number; valid: number; invalid: number };
  columns: string[];
  validRows: UploadValidRow[];
  invalidRows: UploadInvalidRow[];
};

export type CommitUploadResponse = {
  summary: { requested: number; imported: number; failed: number };
  failedRows: UploadInvalidRow[];
  message: string;
};

// The live one-shot upload endpoints (`/students/upload/{branchId}`, `/parents/upload/{branchId}`)
// return this shape wrapped in the app's standard `{ success, code, message, data, timestamp }` envelope.
export type BulkUploadResult = {
  uploaded: number;
  failed: number;
  message: string;
  batchId: string;
  errors: string[];
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
