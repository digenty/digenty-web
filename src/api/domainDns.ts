import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type EmailProvider = "ZOHO" | "GOOGLE" | "MICROSOFT";
export type ZohoRegion = "COM" | "EU" | "IN" | "AU" | "JP" | "CA" | "SA";
export type DmarcPolicy = "none" | "quarantine" | "reject";

export interface EmailSetupRequest {
  provider: EmailProvider;
  region?: ZohoRegion; // Zoho only, default COM
  verification?: { type?: "TXT" | "CNAME"; name?: string; value: string }; // Microsoft: TXT only
  dkim?: { selector: string; value: string }; // Zoho / Google only
  dmarc?: { policy?: DmarcPolicy; reportEmail?: string };
  replaceExistingMx?: boolean;
  mxHost?: string; // Microsoft only
  microsoftDkim?: { selector1: string; selector2: string }; // Microsoft only
}

export type EmailSetupPurpose = "VERIFICATION" | "MX" | "SPF" | "AUTODISCOVER" | "DKIM" | "DMARC";
export type EmailSetupOutcome = "CREATED" | "EXISTS" | "REMOVED" | "REMOVE_FAILED";

export interface EmailSetupResult {
  domain: string;
  results: {
    purpose: EmailSetupPurpose;
    name: string; // "" = root, display as "@"
    type: "MX" | "TXT" | "CNAME";
    value: string;
    mxPriority: number | null;
    outcome: EmailSetupOutcome;
  }[];
}

export type EmailComponentState = "NOT_CONFIGURED" | "PROPAGATING" | "ACTIVE";

export interface EmailSetupStatus {
  domain: string;
  provider: EmailProvider | "OTHER" | null;
  complete: boolean;
  // AUTODISCOVER appears only when provider is MICROSOFT — render the list, not a fixed set.
  components: {
    component: EmailSetupPurpose;
    state: EmailComponentState;
    records: { name: string; fqdn: string; type: string; value: string; mxPriority: number | null; visible: boolean }[];
  }[];
  nextSteps: string[];
}

export interface DnsRecordView {
  id: string;
  name: string;
  fqdn: string;
  type: string;
  value: string;
  ttl: number | null;
  mxPriority: number | null;
  managedBy: "PLATFORM" | "SCHOOL" | "SUPPORT";
  deletable: boolean;
  source: "MANUAL" | "PRESET_ZOHO" | "PRESET_GOOGLE" | null;
}

export interface DnsRecordsResponse {
  domain: string;
  editable: boolean;
  records: DnsRecordView[];
  message: string | null;
}

export interface CreateDnsRecordRequest {
  name?: string;
  type: "MX" | "TXT" | "CNAME" | "A";
  value: string;
  ttl?: number;
  mxPriority?: number;
}

const base = (purchaseId: string) => `/api/domains/purchases/${purchaseId}/dns`;

// Success bodies are wrapped ({ data }), error bodies are not — rethrow the server's JSON so callers can read errorCode/message.
const unwrap = async <T>(request: Promise<{ data: { data?: T } & T }>): Promise<T> => {
  try {
    const { data } = await request;
    return data.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getEmailSetup = (purchaseId: string): Promise<EmailSetupStatus> => unwrap(api.get(`${base(purchaseId)}/email-setup`));

export const postEmailSetup = ({ purchaseId, payload }: { purchaseId: string; payload: EmailSetupRequest }): Promise<EmailSetupResult> =>
  unwrap(api.post(`${base(purchaseId)}/email-setup`, payload));

export const getDnsRecords = (purchaseId: string): Promise<DnsRecordsResponse> => unwrap(api.get(`${base(purchaseId)}/records`));

export const createDnsRecord = ({ purchaseId, payload }: { purchaseId: string; payload: CreateDnsRecordRequest }): Promise<DnsRecordView> =>
  unwrap(api.post(`${base(purchaseId)}/records`, payload));

// 204 with no body — don't parse it.
export const deleteDnsRecord = async ({ purchaseId, recordId }: { purchaseId: string; recordId: string }): Promise<void> => {
  try {
    await api.delete(`${base(purchaseId)}/records/${recordId}`);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const addSpfInclude = ({ purchaseId, include }: { purchaseId: string; include: string }): Promise<EmailSetupResult> =>
  unwrap(api.post(`${base(purchaseId)}/spf/includes`, { include }));
