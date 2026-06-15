import {
  AddDocumentDto,
  AddSubjectDto,
  addAdmissionNumberSetup,
  addLevelDocument,
  addLevelSubject,
  AdmittingDto,
  ApplicantsFilters,
  BranchSpecificDto,
  BulkUpdateStatusRequest,
  bulkUpdateApplicantStatus,
  ClassConfigRequest,
  createAdmissionCycle,
  CreateCycleDto,
  deleteLevelDocument,
  deleteLevelSubject,
  generateAdmissionNumber,
  getAdmissionCycle,
  getAdmissionCycles,
  getApplicantDetail,
  getApplicantScores,
  getApplicantsByClass,
  getClassConfig,
  getCycleApplicants,
  getCyclePayments,
  getCycleLevels,
  getDashboardApplicantsByClass,
  getDashboardApplicantsByStatus,
  getDashboardOverview,
  getLevelClasses,
  getLevelConfig,
  getPaymentsSummary,
  GlobalFeesRequest,
  LevelConfigRequest,
  PaymentsFilters,
  resetClassToLevel,
  saveApplicantScores,
  SaveScoresRequest,
  setCycleBranchSpecific,
  setCycleGlobalFees,
  setLevelAdmitting,
  updateAdmissionCycle,
  updateAdmissionCycleStatus,
  updateApplicantStatus,
  updateClassConfig,
  updateLevelConfig,
  UpdateCycleDto,
  UpdateCycleStatusDto,
  UpdateStatusRequest,
  CycleStatus,
} from "@/api/admission";
import { admissionCycleKeys, admissionKeys } from "@/queries/admission";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ===========================================================================
// Admission Number (existing)
// ===========================================================================

export const useAddmissionNumber = () => {
  return useMutation({
    mutationKey: admissionKeys.add,
    mutationFn: addAdmissionNumberSetup,
  });
};

export const useGenerateAdmissionNumber = () => {
  return useMutation({
    mutationKey: admissionKeys.generate,
    mutationFn: generateAdmissionNumber,
  });
};

// ===========================================================================
// Cycles
// ===========================================================================

export const useGetAdmissionCycles = (status?: CycleStatus) => {
  return useQuery({
    queryKey: admissionCycleKeys.list(status),
    queryFn: () => getAdmissionCycles(status),
    retry: false,
  });
};

export const useGetAdmissionCycle = (cycleId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.detail(cycleId!),
    queryFn: () => getAdmissionCycle(cycleId!),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useCreateAdmissionCycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCycleDto) => createAdmissionCycle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.all });
    },
  });
};

export const useUpdateAdmissionCycle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, payload }: { cycleId: number; payload: UpdateCycleDto }) => updateAdmissionCycle(cycleId, payload),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.all });
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.detail(cycleId) });
    },
  });
};

export const useUpdateCycleStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, payload }: { cycleId: number; payload: UpdateCycleStatusDto }) => updateAdmissionCycleStatus(cycleId, payload),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.all });
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.detail(cycleId) });
    },
  });
};

export const useSetCycleBranchSpecific = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, payload }: { cycleId: number; payload: BranchSpecificDto }) => setCycleBranchSpecific(cycleId, payload),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.detail(cycleId) });
    },
  });
};

export const useSetCycleGlobalFees = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, payload, branchId }: { cycleId: number; payload: GlobalFeesRequest; branchId?: number }) =>
      setCycleGlobalFees(cycleId, payload, branchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.all });
    },
  });
};

// ===========================================================================
// Levels
// ===========================================================================

export const useGetCycleLevels = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.levels(cycleId!, branchId),
    queryFn: () => getCycleLevels(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetLevelConfig = (cycleId?: number, levelId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.levelConfig(cycleId!, levelId!, branchId),
    queryFn: () => getLevelConfig(cycleId!, levelId!, branchId),
    enabled: !!cycleId && !!levelId,
    retry: false,
  });
};

export const useUpdateLevelConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, payload, branchId }: { cycleId: number; levelId: number; payload: LevelConfigRequest; branchId?: number }) =>
      updateLevelConfig(cycleId, levelId, payload, branchId),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.levels(cycleId) });
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels"] });
    },
  });
};

export const useSetLevelAdmitting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, payload, branchId }: { cycleId: number; levelId: number; payload: AdmittingDto; branchId?: number }) =>
      setLevelAdmitting(cycleId, levelId, payload, branchId),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels"] });
    },
  });
};

export const useAddLevelDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, payload, branchId }: { cycleId: number; levelId: number; payload: AddDocumentDto; branchId?: number }) =>
      addLevelDocument(cycleId, levelId, payload, branchId),
    onSuccess: (_data, { cycleId, levelId, branchId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.levelConfig(cycleId, levelId, branchId) });
    },
  });
};

export const useDeleteLevelDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, docId }: { cycleId: number; levelId: number; docId: number }) => deleteLevelDocument(cycleId, levelId, docId),
    onSuccess: (_data, { cycleId, levelId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels", levelId] });
    },
  });
};

export const useAddLevelSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, payload, branchId }: { cycleId: number; levelId: number; payload: AddSubjectDto; branchId?: number }) =>
      addLevelSubject(cycleId, levelId, payload, branchId),
    onSuccess: (_data, { cycleId, levelId, branchId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.levelConfig(cycleId, levelId, branchId) });
    },
  });
};

export const useDeleteLevelSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, subjectId }: { cycleId: number; levelId: number; subjectId: number }) =>
      deleteLevelSubject(cycleId, levelId, subjectId),
    onSuccess: (_data, { cycleId, levelId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels", levelId] });
    },
  });
};

// ===========================================================================
// Classes
// ===========================================================================

export const useGetLevelClasses = (cycleId?: number, levelId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.classes(cycleId!, levelId!, branchId),
    queryFn: () => getLevelClasses(cycleId!, levelId!, branchId),
    enabled: !!cycleId && !!levelId,
    retry: false,
  });
};

export const useGetClassConfig = (cycleId?: number, levelId?: number, classId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.classConfig(cycleId!, levelId!, classId!, branchId),
    queryFn: () => getClassConfig(cycleId!, levelId!, classId!, branchId),
    enabled: !!cycleId && !!levelId && !!classId,
    retry: false,
  });
};

export const useUpdateClassConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      cycleId,
      levelId,
      classId,
      payload,
      branchId,
    }: {
      cycleId: number;
      levelId: number;
      classId: number;
      payload: ClassConfigRequest;
      branchId?: number;
    }) => updateClassConfig(cycleId, levelId, classId, payload, branchId),
    onSuccess: (_data, { cycleId, levelId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels", levelId, "classes"] });
    },
  });
};

export const useResetClassToLevel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, levelId, classId, branchId }: { cycleId: number; levelId: number; classId: number; branchId?: number }) =>
      resetClassToLevel(cycleId, levelId, classId, branchId),
    onSuccess: (_data, { cycleId, levelId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "levels", levelId, "classes"] });
    },
  });
};

// ===========================================================================
// Applicants
// ===========================================================================

export const useGetCycleApplicants = (cycleId?: number, filters: ApplicantsFilters = {}) => {
  return useQuery({
    queryKey: admissionCycleKeys.applicants(cycleId!, filters),
    queryFn: () => getCycleApplicants(cycleId!, filters),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetApplicantsByClass = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.applicantsByClass(cycleId!, branchId),
    queryFn: () => getApplicantsByClass(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetApplicantDetail = (cycleId?: number, applicantId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.applicantDetail(cycleId!, applicantId!),
    queryFn: () => getApplicantDetail(cycleId!, applicantId!),
    enabled: !!cycleId && !!applicantId,
    retry: false,
  });
};

export const useGetApplicantScores = (cycleId?: number, applicantId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.applicantScores(cycleId!, applicantId!),
    queryFn: () => getApplicantScores(cycleId!, applicantId!),
    enabled: !!cycleId && !!applicantId,
    retry: false,
  });
};

export const useBulkUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, payload }: { cycleId: number; payload: BulkUpdateStatusRequest }) => bulkUpdateApplicantStatus(cycleId, payload),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "applicants"] });
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "dashboard"] });
    },
  });
};

export const useUpdateApplicantStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, applicantId, payload }: { cycleId: number; applicantId: number; payload: UpdateStatusRequest }) =>
      updateApplicantStatus(cycleId, applicantId, payload),
    onSuccess: (_data, { cycleId }) => {
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "applicants"] });
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "dashboard"] });
    },
  });
};

export const useSaveApplicantScores = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cycleId, applicantId, payload }: { cycleId: number; applicantId: number; payload: SaveScoresRequest }) =>
      saveApplicantScores(cycleId, applicantId, payload),
    onSuccess: (_data, { cycleId, applicantId }) => {
      queryClient.invalidateQueries({ queryKey: admissionCycleKeys.applicantScores(cycleId, applicantId) });
      queryClient.invalidateQueries({ queryKey: ["admissionCycles", cycleId, "applicants"] });
    },
  });
};

// ===========================================================================
// Dashboard
// ===========================================================================

export const useGetDashboardOverview = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.dashboardOverview(cycleId!, branchId),
    queryFn: () => getDashboardOverview(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetDashboardApplicantsByClass = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.dashboardByClass(cycleId!, branchId),
    queryFn: () => getDashboardApplicantsByClass(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetDashboardApplicantsByStatus = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.dashboardByStatus(cycleId!, branchId),
    queryFn: () => getDashboardApplicantsByStatus(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};

// ===========================================================================
// Payments
// ===========================================================================

export const useGetCyclePayments = (cycleId?: number, filters: PaymentsFilters = {}) => {
  return useQuery({
    queryKey: admissionCycleKeys.payments(cycleId!, filters),
    queryFn: () => getCyclePayments(cycleId!, filters),
    enabled: !!cycleId,
    retry: false,
  });
};

export const useGetPaymentsSummary = (cycleId?: number, branchId?: number) => {
  return useQuery({
    queryKey: admissionCycleKeys.paymentsSummary(cycleId!, branchId),
    queryFn: () => getPaymentsSummary(cycleId!, branchId),
    enabled: !!cycleId,
    retry: false,
  });
};
