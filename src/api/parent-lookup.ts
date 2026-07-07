import { FeeTermType } from "@/api/fee";
import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

// GET /parent/portal/lookup/schools/{schoolId}/terms
export interface TermLookup {
  id: number;
  term: FeeTermType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  academicSessionId: number;
  academicSessionName: string;
}

export const getParentPortalTerms = async (schoolId: number, academicSessionId?: number): Promise<TermLookup[]> => {
  try {
    const params = new URLSearchParams();
    if (academicSessionId) params.append("academicSessionId", String(academicSessionId));
    const qs = params.toString();
    const { data } = await api.get(`/parent/portal/lookup/schools/${schoolId}/terms${qs ? `?${qs}` : ""}`);
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
