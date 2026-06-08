import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

export type CampaignChannel = "SMS" | "EMAIL" | "WHATSAPP";

export type CampaignStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "QUEUED"
  | "SCHEDULED"
  | "SENDING"
  | "SENT"
  | "PARTIALLY_DELIVERED"
  | "FAILED"
  | "CANCELLED";

export type CampaignTargetDto = {
  studentIds?: number[];
  parentIds?: number[];
  branchId?: number;
  classId?: number;
  armId?: number;
  allStudents?: boolean;
};

export type CreateCampaignRequest = {
  title: string;
  channel: CampaignChannel;
  message: string;
  target: CampaignTargetDto;
  scheduledAt?: string | null;
};

export type UpdateCampaignRequest = {
  title: string;
  channel: CampaignChannel;
  message: string;
  target?: CampaignTargetDto;
  scheduledAt?: string | null;
};

export type CampaignResponseDto = {
  id: number;
  uuid: string;
  title: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  message: string;
  intendedRecipientCount: number;
  deliveredCount: number;
  failedCount: number;
  ratePerMessage: number;
  totalCost: number;
  currency: string;
  paid: boolean;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type CampaignDetailDto = CampaignResponseDto & {
  updatedAt: string;
  createdByUserId: number;
  createdByName: string;
  lastUpdatedByUserId: number;
  lastUpdatedByName: string;
  termAndSession: string;
};

export type CampaignPageResponse = {
  campaigns: CampaignResponseDto[];
  total: number;
  page: number;
  pageSize: number;
};

type CampaignPageResponseEnvelope = { data: CampaignPageResponse } | CampaignPageResponse;

export type CampaignOverviewDto = {
  totalCampaignsSent: number;
  smsCampaigns: number;
  emailCampaigns: number;
  whatsappCampaigns: number;
};

export type ScheduleCampaignRequest = { scheduledAt: string };

export type CampaignPayRequest = { email?: string; callbackUrl?: string };

export type SmsCountRequest = { message: string };

export type SmsCountResponse = {
  characterCount: number;
  encoding: string;
  charsPerSegment: number;
  segmentCount: number;
  charactersRemaining: number;
};

export type CampaignEstimateRequest = {
  channel: CampaignChannel;
  message: string;
  target: CampaignTargetDto;
};

export type CampaignEstimateResponse = {
  recipientCount: number;
  segmentCount: number;
  ratePerMessage: number;
  totalCost: number;
  currency: string;
};

export type CampaignListParams = {
  search?: string;
  status?: CampaignStatus;
  channel?: CampaignChannel;
  termId?: number;
  branchId?: number;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

const buildQuery = (params: Record<string, string | number | undefined | null>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getCampaigns = async (params: CampaignListParams = {}): Promise<CampaignPageResponse> => {
  try {
    const { data } = await api.get<CampaignPageResponseEnvelope>(
      `/campaigns${buildQuery({ ...params, page: params.page ?? 1, pageSize: params.pageSize ?? 20 })}`,
    );
    return "data" in data && data.data && "campaigns" in data.data ? data.data : (data as CampaignPageResponse);
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getCampaignOverview = async (): Promise<CampaignOverviewDto> => {
  try {
    const { data } = await api.get("/campaigns/overview");
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getCampaignById = async (id: number): Promise<CampaignDetailDto> => {
  try {
    const { data } = await api.get(`/campaigns/${id}`);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const createCampaign = async (payload: CreateCampaignRequest): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.post("/campaigns", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const updateCampaign = async (id: number, payload: UpdateCampaignRequest): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.put(`/campaigns/${id}`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const deleteCampaign = async (id: number): Promise<unknown> => {
  try {
    const { data } = await api.delete(`/campaigns/${id}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const scheduleCampaign = async (id: number, payload: ScheduleCampaignRequest): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/schedule`, payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const cancelCampaignSchedule = async (id: number): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/cancel-schedule`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const retryCampaign = async (id: number): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/retry`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const resendCampaign = async (id: number, payload: CampaignPayRequest = {}): Promise<Record<string, string>> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/resend`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const payForCampaign = async (id: number, payload: CampaignPayRequest = {}): Promise<Record<string, string>> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/pay`, payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const duplicateCampaign = async (id: number): Promise<CampaignResponseDto> => {
  try {
    const { data } = await api.post(`/campaigns/${id}/duplicate`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const getSmsCount = async (payload: SmsCountRequest): Promise<SmsCountResponse> => {
  try {
    const { data } = await api.post("/campaigns/sms/count", payload);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};

export const estimateCampaign = async (payload: CampaignEstimateRequest): Promise<CampaignEstimateResponse> => {
  try {
    const { data } = await api.post("/campaigns/estimate", payload);
    return data?.data ?? data;
  } catch (error: unknown) {
    if (isAxiosError(error)) throw error.response?.data;
    throw error;
  }
};
