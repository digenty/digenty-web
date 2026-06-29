import { CampaignListParams } from "@/api/campaign";

export const campaignKeys = {
  all: ["campaigns"] as const,
  list: (params?: CampaignListParams) => ["campaigns", "list", params ?? {}] as const,
  overview: ["campaigns", "overview"] as const,
  detail: (id: number) => ["campaigns", "detail", id] as const,
  create: ["createCampaign"] as const,
  update: ["updateCampaign"] as const,
  delete: ["deleteCampaign"] as const,
  schedule: ["scheduleCampaign"] as const,
  cancelSchedule: ["cancelCampaignSchedule"] as const,
  retry: ["retryCampaign"] as const,
  resend: ["resendCampaign"] as const,
  pay: ["payCampaign"] as const,
  duplicate: ["duplicateCampaign"] as const,
  smsCount: ["campaignSmsCount"] as const,
  estimate: ["campaignEstimate"] as const,
};
