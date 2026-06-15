import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";
import { AdmissionNumberPayload, UpdateAdmissionNumber } from "./types";

export const addAdmissionNumberSetup = async (payload: AdmissionNumberPayload) => {
  try {
    const { data } = await api.post("/admission/number", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const getAdmissionNumber = async () => {
  try {
    const { data } = await api.get(`/admission/number`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const updateAdmissionNumber = async (payload: UpdateAdmissionNumber, id: number) => {
  try {
    const { data } = await api.put(`/admission/number/${id}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const generateAdmissionNumber = async () => {
  try {
    const { data } = await api.get(`/admission/number/generate`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export type CycleStatus = "ACTIVE" | "CLOSED";
export type ApplicantStatus = "PENDING" | "ADMITTED" | "REJECTED";
export type AdmissionPaymentStatus = "PAID" | "OWING";
export type LevelConfigStatus = "CONFIGURED" | "NOT_CONFIGURED";
export type AdmissionFeeType = "APPLICATION_FEE" | "EXAMINATION_FEE" | "ENTRANCE_FEE";

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ---- Cycles ----------------------------------------------------------------

export interface CycleResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: CycleStatus;
  branchSpecificRequirements: boolean;
}

export interface CreateCycleDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateCycleDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCycleStatusDto {
  status: CycleStatus;
}

export interface BranchSpecificDto {
  enabled: boolean;
}

// ---- Fees (shared) ---------------------------------------------------------

export interface FeeToggle {
  enabled?: boolean;
  amount?: number;
}

export interface SubjectEntry {
  subjectId?: number;
  customName?: string;
  maxScore?: number;
}

export interface EntranceExam {
  enabled?: boolean;
  subjects?: SubjectEntry[];
}

export interface GlobalFeesRequest {
  applicationFee?: FeeToggle;
  entranceExam?: EntranceExam;
}

export interface FeeView {
  enabled: boolean;
  amount: number;
}

export interface SubjectView {
  id: number;
  subjectId: number;
  customName: string;
  maxScore: number;
}

export interface EntranceExamView {
  enabled: boolean;
  subjects: SubjectView[];
}

export interface DocumentView {
  id: number;
  documentName: string;
}

export interface DocumentEntry {
  documentName: string;
}

// ---- Levels ----------------------------------------------------------------

export interface LevelSummaryDto {
  classLevelId: number;
  levelName: string;
  classCount: number;
  status: LevelConfigStatus;
}

export interface LevelConfigResponse {
  levelConfigId: number;
  classLevelId: number;
  branchId: number;
  admitting: boolean;
  status: LevelConfigStatus;
  applicationFee: FeeView;
  examFee: FeeView;
  entranceExam: EntranceExamView;
  requiredDocuments: DocumentView[];
  intakesPerClass: number;
}

export interface LevelConfigRequest {
  admitting?: boolean;
  applicationFee?: FeeToggle;
  examFee?: FeeToggle;
  entranceExam?: EntranceExam;
  requiredDocuments?: DocumentEntry[];
  intakesPerClass?: number;
}

export interface AdmittingDto {
  admitting: boolean;
}

export interface AddDocumentDto {
  documentName: string;
}

export interface AddSubjectDto {
  subjectId?: number;
  customName?: string;
  maxScore: number;
}

// ---- Classes ---------------------------------------------------------------

export interface ClassSummaryDto {
  classId: number;
  className: string;
  usesLevelSettings: boolean;
}

export interface AdmissionClassConfig {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  levelConfigId: number;
  classId: number;
  usesLevelSettings: boolean;
  admitting: boolean;
  applicationFeeEnabled: boolean;
  applicationFeeAmount: number;
  examFeeEnabled: boolean;
  examFeeAmount: number;
  entranceExamEnabled: boolean;
  intakesPerClass: number;
  branchId: number;
  schoolId: number;
}

export interface ClassConfigRequest {
  usesLevelSettings?: boolean;
  admitting?: boolean;
  applicationFee?: FeeToggle;
  examFee?: FeeToggle;
  entranceExam?: EntranceExam;
  requiredDocuments?: DocumentEntry[];
  intakesPerClass?: number;
}

// ---- Applicants ------------------------------------------------------------

export interface ApplicantListItemDto {
  id: number;
  studentName: string;
  applicantNumber: string;
  status: ApplicantStatus;
  totalScore: number;
  dateApplied: string;
}

export interface ClassApplicantSummaryDto {
  classId: number;
  className: string;
  branchName: string;
  admittedCount: number;
  pendingCount: number;
  rejectedCount: number;
  capacityUsed: number;
  capacityTotal: number;
}

export interface BulkUpdateStatusRequest {
  applicantIds: number[];
  status: ApplicantStatus;
}

export interface ApplicantDetailResponse {
  id: number;
  applicantNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  classId: number;
  className: string;
  branchId: number;
  branchName: string;
  applicationDate: string;
  status: ApplicantStatus;
  paymentStatus: AdmissionPaymentStatus;
  submittedDocuments: DocumentView[];
}

export interface AdmissionApplicantDocument {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  applicantId: number;
  name: string;
  fileUrl: string;
  fileSizeBytes: number;
  schoolId: number;
}

export interface ScoreView {
  id: number;
  subjectName: string;
  score: number;
  maxScore: number;
}

export interface ScoreEntry {
  subjectName: string;
  score: number;
  maxScore: number;
}

export interface ApplicantScoresResponse {
  applicantId: number;
  scores: ScoreView[];
  totalScore: number;
  maxTotal: number;
  status: ApplicantStatus;
}

export interface SaveScoresRequest {
  scores: ScoreEntry[];
}

export interface UpdateStatusRequest {
  status: ApplicantStatus;
}

export interface ApplicantsFilters {
  page?: number;
  size?: number;
  classId?: number;
  branchId?: number;
  status?: ApplicantStatus;
  q?: string;
}

// ---- Dashboard -------------------------------------------------------------

export interface DashboardOverviewDto {
  totalApplicants: number;
  pendingReview: number;
  admitted: number;
  revenue: number;
}

export interface ApplicantsByClassDto {
  classId: number;
  className: string;
  admitted: number;
  pending: number;
  rejected: number;
}

export interface ApplicantsByStatusDto {
  admitted: number;
  pending: number;
  rejected: number;
}

// ---- Payments --------------------------------------------------------------

export interface PaymentListItemDto {
  id: number;
  studentName: string;
  applicantNumber: string;
  classId: number;
  feeType: AdmissionFeeType;
  amount: number;
  paymentStatus: AdmissionPaymentStatus;
  date: string;
}

export interface PaymentSummaryDto {
  totalRevenue: number;
  applicationFeeTotal: number;
  examinationFeeTotal: number;
}

export interface AdmissionPayment {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  cycleId: number;
  applicantId: number;
  applicantNumber: string;
  studentName: string;
  classId: number;
  branchId: number;
  feeType: AdmissionFeeType;
  amount: number;
  paymentStatus: AdmissionPaymentStatus;
  paymentDate: string;
  reference: string;
  schoolId: number;
}

export interface PaymentsFilters {
  page?: number;
  size?: number;
  fee?: AdmissionFeeType;
  classId?: number;
  branchId?: number;
  q?: string;
}

// ===========================================================================
// Cycles
// ===========================================================================

export const getAdmissionCycles = async (status?: CycleStatus): Promise<CycleResponse[]> => {
  try {
    const { data } = await api.get("/admissions/cycles", { params: { status } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createAdmissionCycle = async (payload: CreateCycleDto): Promise<CycleResponse> => {
  try {
    const { data } = await api.post("/admissions/cycles", payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAdmissionCycle = async (cycleId: number): Promise<CycleResponse> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateAdmissionCycle = async (cycleId: number, payload: UpdateCycleDto): Promise<CycleResponse> => {
  try {
    const { data } = await api.put(`/admissions/cycles/${cycleId}`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateAdmissionCycleStatus = async (cycleId: number, payload: UpdateCycleStatusDto): Promise<CycleResponse> => {
  try {
    const { data } = await api.patch(`/admissions/cycles/${cycleId}/status`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const setCycleBranchSpecific = async (cycleId: number, payload: BranchSpecificDto): Promise<CycleResponse> => {
  try {
    const { data } = await api.patch(`/admissions/cycles/${cycleId}/branch-specific`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const setCycleGlobalFees = async (cycleId: number, payload: GlobalFeesRequest, branchId?: number) => {
  try {
    const { data } = await api.put(`/admissions/cycles/${cycleId}/global-fees`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getCycleReport = async (cycleId: number) => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/report`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ===========================================================================
// Levels
// ===========================================================================

export const getCycleLevels = async (cycleId: number, branchId?: number): Promise<LevelSummaryDto[]> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/levels`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getLevelConfig = async (cycleId: number, levelId: number, branchId?: number): Promise<LevelConfigResponse> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/levels/${levelId}`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateLevelConfig = async (
  cycleId: number,
  levelId: number,
  payload: LevelConfigRequest,
  branchId?: number,
): Promise<LevelConfigResponse> => {
  try {
    const { data } = await api.put(`/admissions/cycles/${cycleId}/levels/${levelId}`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const setLevelAdmitting = async (cycleId: number, levelId: number, payload: AdmittingDto, branchId?: number): Promise<LevelConfigResponse> => {
  try {
    const { data } = await api.patch(`/admissions/cycles/${cycleId}/levels/${levelId}/admitting`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addLevelDocument = async (cycleId: number, levelId: number, payload: AddDocumentDto, branchId?: number) => {
  try {
    const { data } = await api.post(`/admissions/cycles/${cycleId}/levels/${levelId}/documents`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteLevelDocument = async (cycleId: number, levelId: number, docId: number) => {
  try {
    const { data } = await api.delete(`/admissions/cycles/${cycleId}/levels/${levelId}/documents/${docId}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addLevelSubject = async (cycleId: number, levelId: number, payload: AddSubjectDto, branchId?: number) => {
  try {
    const { data } = await api.post(`/admissions/cycles/${cycleId}/levels/${levelId}/subjects`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteLevelSubject = async (cycleId: number, levelId: number, subjectId: number) => {
  try {
    const { data } = await api.delete(`/admissions/cycles/${cycleId}/levels/${levelId}/subjects/${subjectId}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ===========================================================================
// Classes
// ===========================================================================

export const getLevelClasses = async (cycleId: number, levelId: number, branchId?: number): Promise<ClassSummaryDto[]> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/levels/${levelId}/classes`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getClassConfig = async (cycleId: number, levelId: number, classId: number, branchId?: number): Promise<AdmissionClassConfig> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/levels/${levelId}/classes/${classId}`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateClassConfig = async (
  cycleId: number,
  levelId: number,
  classId: number,
  payload: ClassConfigRequest,
  branchId?: number,
): Promise<AdmissionClassConfig> => {
  try {
    const { data } = await api.put(`/admissions/cycles/${cycleId}/levels/${levelId}/classes/${classId}`, payload, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const resetClassToLevel = async (cycleId: number, levelId: number, classId: number, branchId?: number) => {
  try {
    const { data } = await api.post(`/admissions/cycles/${cycleId}/levels/${levelId}/classes/${classId}/reset-to-level`, null, {
      params: { branchId },
    });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ===========================================================================
// Applicants
// ===========================================================================

export const getCycleApplicants = async (cycleId: number, filters: ApplicantsFilters = {}): Promise<Page<ApplicantListItemDto>> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/applicants`, { params: filters });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getApplicantsByClass = async (cycleId: number, branchId?: number): Promise<ClassApplicantSummaryDto[]> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/applicants/by-class`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const bulkUpdateApplicantStatus = async (cycleId: number, payload: BulkUpdateStatusRequest) => {
  try {
    const { data } = await api.patch(`/admissions/cycles/${cycleId}/applicants/status`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getApplicantDetail = async (cycleId: number, applicantId: number): Promise<ApplicantDetailResponse> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/applicants/${applicantId}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getApplicantDocument = async (cycleId: number, applicantId: number, docId: number): Promise<AdmissionApplicantDocument> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/applicants/${applicantId}/documents/${docId}`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getApplicantScores = async (cycleId: number, applicantId: number): Promise<ApplicantScoresResponse> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/applicants/${applicantId}/scores`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const saveApplicantScores = async (cycleId: number, applicantId: number, payload: SaveScoresRequest): Promise<ApplicantScoresResponse> => {
  try {
    const { data } = await api.put(`/admissions/cycles/${cycleId}/applicants/${applicantId}/scores`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateApplicantStatus = async (cycleId: number, applicantId: number, payload: UpdateStatusRequest) => {
  try {
    const { data } = await api.patch(`/admissions/cycles/${cycleId}/applicants/${applicantId}/status`, payload);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ===========================================================================
// Dashboard
// ===========================================================================

export const getDashboardOverview = async (cycleId: number, branchId?: number): Promise<DashboardOverviewDto> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/dashboard/overview`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDashboardApplicantsByClass = async (cycleId: number, branchId?: number): Promise<ApplicantsByClassDto[]> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/dashboard/applicants-by-class`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDashboardApplicantsByStatus = async (cycleId: number, branchId?: number): Promise<ApplicantsByStatusDto> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/dashboard/applicants-by-status`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// ===========================================================================
// Payments
// ===========================================================================

export const getCyclePayments = async (cycleId: number, filters: PaymentsFilters = {}): Promise<Page<PaymentListItemDto>> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/payments`, { params: filters });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getPaymentsSummary = async (cycleId: number, branchId?: number): Promise<PaymentSummaryDto> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/payments/summary`, { params: { branchId } });
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getPaymentReceipt = async (cycleId: number, paymentId: number): Promise<AdmissionPayment> => {
  try {
    const { data } = await api.get(`/admissions/cycles/${cycleId}/payments/${paymentId}/receipt`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
