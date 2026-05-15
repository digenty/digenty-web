import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export interface BankOption {
  name: string;
  code: string;
  slug: string;
}

export type FeeCollectionMode = "SINGLE_ACCOUNT" | "BRANCH_ACCOUNTS";

export interface BranchAccountDto {
  branchId?: number;
  bankName: string;
  bankCode: string;
  accountNumber: string;
  isDefault?: boolean;
}

export interface FeeRouteDto {
  feeClassId: number;
  bankAccountId: number;
  isDefault?: boolean;
}

export interface FeeCollectionSetupDto {
  mode: FeeCollectionMode;
  branchAccounts: BranchAccountDto[];
  feeRoutes?: FeeRouteDto[];
}

export interface UpdateBankAccountDto {
  bankName: string;
  bankCode: string;
  accountNumber: string;
}

export interface UpdateModeDto {
  mode: FeeCollectionMode;
}

export interface BankAccountInfo {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  isDefault: boolean;
}

export interface BranchAccountInfo {
  branchId: number;
  branchName: string;
  account: BankAccountInfo;
}

export interface FeeRouteInfo {
  feeClassId: number;
  feeName: string;
  account: BankAccountInfo;
  isDefault: boolean;
}

export interface FeeCollectionConfigResponse {
  mode: FeeCollectionMode;
  defaultAccount?: BankAccountInfo;
  branchAccounts?: BranchAccountInfo[];
  feeRoutes?: FeeRouteInfo[];
  customRouteCount?: number;
  defaultRouteCount?: number;
  totalFees?: number;
}

export const setupFeeCollection = async (payload: FeeCollectionSetupDto) => {
  try {
    const { data } = await api.post<Record<string, string>>(`/api/fee-collection/setup`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getSetupStatus = async (): Promise<FeeCollectionConfigResponse> => {
  try {
    const { data } = await api.get<FeeCollectionConfigResponse>(`/api/fee-collection/setup/status`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["content", "data", "items", "results"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

export const getBankAccounts = async (): Promise<BankAccountInfo[]> => {
  try {
    const { data } = await api.get(`/api/fee-collection/accounts`);
    return toArray<BankAccountInfo>(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateBankAccount = async (accountId: number, payload: UpdateBankAccountDto) => {
  try {
    const { data } = await api.put<Record<string, string>>(`/api/fee-collection/accounts/${accountId}`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateMode = async (payload: UpdateModeDto) => {
  try {
    const { data } = await api.put<Record<string, string>>(`/api/fee-collection/mode`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getAllBanks = async (): Promise<BankOption[]> => {
  try {
    const { data } = await api.get<{ data: BankOption[] }>(`/banks/all`);
    return data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
