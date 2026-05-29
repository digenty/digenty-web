export type CampaignChannel = "SMS" | "Email" | "Whatsapp";
export type CampaignStatus = "Delivered" | "Failed" | "Scheduled" | "Draft" | "Sending";

export type Campaign = {
  id: string;
  title: string;
  date: string;
  channel: CampaignChannel;
  recipients: number;
  status: CampaignStatus;
  messageContent: string;
  intendedRecipients: number;
  delivered: number;
  failed: number;
  createdDate: string;
  deliveryDate: string;
  createdBy: string;
  lastUpdatedBy: string;
  termAndSession: string;
  lastUpdated: string;
  paid: boolean;
  selectedRecipientsSummary: string;
};

export type CampaignFormValues = {
  title: string;
  channel: CampaignChannel | "";
  message: string;
  recipients: string[];
  scheduledDate: string | null;
  scheduledTime: string | null;
};
