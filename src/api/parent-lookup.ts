import { FeeTermType } from "@/api/fee";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

// GET /parent/portal/terms/active, GET /parent/portal/terms
export interface TermLookup {
  id: number;
  term: FeeTermType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  academicSessionId: number;
  academicSessionName: string;
}

export const getActiveParentPortalTerm = async (): Promise<TermLookup> => {
  try {
    const { data } = await api.get(`/parent/portal/terms/active`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getParentPortalTerms = async (academicSessionId: number): Promise<TermLookup[]> => {
  try {
    const { data } = await api.get(`/parent/portal/terms?academicSessionId=${academicSessionId}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /parent/portal/lookup/schools/{schoolId}/branches
export interface BranchLookup {
  id: number;
  name: string;
}

export const getParentPortalBranches = async (schoolId: number): Promise<BranchLookup[]> => {
  try {
    const { data } = await api.get(`/parent/portal/lookup/schools/${schoolId}/branches`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /parent/portal/lookup/schools/{schoolId}/classes
export interface ClassLookup {
  id: number;
  name: string;
  branchId: number;
  levelId: number;
}

export const getParentPortalClasses = async (schoolId: number, branchId?: number): Promise<ClassLookup[]> => {
  try {
    const params = new URLSearchParams();
    if (branchId) params.append("branchId", String(branchId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/lookup/schools/${schoolId}/classes${qs ? `?${qs}` : ""}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

// GET /parent/portal/lookup/classes/{classId}/arms
export interface ArmLookup {
  id: number;
  name: string;
  classId: number;
}

export const getParentPortalArms = async (classId: number): Promise<ArmLookup[]> => {
  try {
    const { data } = await api.get(`/parent/portal/lookup/classes/${classId}/arms`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
