import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type DomainPurchaseType = "PURCHASE" | "CONNECT_EXISTING";

export type DomainPurchaseStatus =
  | "PENDING"
  | "REGISTERING"
  | "REGISTERED"
  | "DNS_CONFIGURING"
  | "DNS_CONFIGURED"
  | "VERCEL_ATTACHING"
  | "AWAITING_VERIFICATION"
  | "LIVE"
  | "REJECTED"
  | "REGISTRATION_INDETERMINATE"
  | "DNS_FAILED"
  | "VERCEL_CONFLICT"
  | "VERCEL_FAILED"
  | "VERIFICATION_TIMEOUT"
  | "ACTIVATION_FAILED"
  | "ACTIVATION_CONFLICT";

export type DomainFailedStep = "REGISTER" | "DNS" | "VERCEL" | "ACTIVATE";

export interface DnsRecordDto {
  hostname: string;
  type: string;
  value: string;
  ttl: number;
}

export interface DomainPurchaseDto {
  purchaseId: string;
  domainName: string;
  status: DomainPurchaseStatus;
  purchaseType: DomainPurchaseType;
  failedStep: DomainFailedStep | null;
  message: string;
  requiresManualReview: boolean;
  simulated: boolean;
  manageDns: boolean;
  requiredDnsRecords: DnsRecordDto[];
  verificationAttempts: number;
  registrarRegisteredAt: string | null;
  vercelAttachedAt: string | null;
  activatedAt: string | null;
  createdAt: string;
}

export interface PurchaseAndConnectDomainPayload {
  domainName: string;
  years?: number;
  purchaseType?: DomainPurchaseType;
  manageDns?: boolean;
}

export interface DomainCheckPayload {
  domain: string;
  tld: string;
}

// Registrar response is passed through untyped by the backend — probe defensively, don't assume a shape.
export type DomainCheckResult = Record<string, unknown>;

export const checkDomainAvailability = async (payload: DomainCheckPayload): Promise<DomainCheckResult> => {
  try {
    const { data } = await api.post("/api/domains/check", payload);
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const purchaseAndConnectDomain = async (payload: PurchaseAndConnectDomainPayload): Promise<DomainPurchaseDto> => {
  try {
    const { data } = await api.post("/api/domains/purchase-and-connect", payload);
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDomainPurchase = async (purchaseId: string): Promise<DomainPurchaseDto> => {
  try {
    const { data } = await api.get(`/api/domains/purchases/${purchaseId}`);
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getDomainPurchases = async (): Promise<DomainPurchaseDto[]> => {
  try {
    const { data } = await api.get("/api/domains/purchases");
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
