import { CampaignChannel, CampaignStatus } from "@/api/campaign";

export type { CampaignChannel, CampaignStatus } from "@/api/campaign";

/* ------------------------------ Presentation ------------------------------ */

export const CHANNEL_LABEL: Record<CampaignChannel, string> = {
  SMS: "SMS",
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
};

export const STATUS_LABEL: Record<CampaignStatus, string> = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Pending Payment",
  QUEUED: "Queued",
  SCHEDULED: "Scheduled",
  SENDING: "Sending",
  SENT: "Delivered",
  PARTIALLY_DELIVERED: "Partially Delivered",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const formatCampaignDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export const formatCampaignDateTime = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export const formatNaira = (value?: number | null) => `₦${(value ?? 0).toLocaleString()}`;

/** resend/pay endpoints return a payment-gateway redirect under one of several keys. */
export const extractPaymentUrl = (res?: Record<string, string> | null) => {
  if (!res) return undefined;
  return res.authorizationUrl ?? res.authorization_url ?? res.paymentUrl ?? res.payment_url ?? res.url ?? res.link;
};

/* --------------------------------- Forms ---------------------------------- */

export type CampaignFormValues = {
  title: string;
  channel: CampaignChannel | "";
  message: string;
  recipients: SelectedRecipient[];
  scheduledDate: string | null;
  scheduledTime: string | null;
};

export type SelectedRecipientType = "student" | "arm" | "class" | "level" | "branch" | "student-tag" | "parent-tag" | "parent";

export type SelectedRecipient = {
  id: string;
  label: string;
  count?: number;
  type: SelectedRecipientType;
  parentIds?: number[];
  studentIds?: number[];
};
