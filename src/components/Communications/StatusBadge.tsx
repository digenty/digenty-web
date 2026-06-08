import { Draft, TimeFill } from "@digenty/icons";
import { Check, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { CampaignStatus, STATUS_LABEL } from "./types";

const badgeClass: Record<CampaignStatus, string> = {
  SENT: "bg-bg-badge-green text-bg-basic-green-strong",
  PARTIALLY_DELIVERED: "bg-bg-badge-orange text-bg-basic-orange-strong",
  FAILED: "bg-bg-badge-red text-bg-basic-red-strong",
  SCHEDULED: "bg-bg-badge-orange text-bg-basic-orange-strong",
  QUEUED: "bg-bg-badge-orange text-bg-basic-orange-strong",
  SENDING: "bg-bg-badge-blue text-bg-basic-blue-strong",
  PENDING_PAYMENT: "bg-bg-badge-orange text-bg-basic-orange-strong",
  DRAFT: "bg-bg-badge-default text-text-subtle",
  CANCELLED: "bg-bg-badge-default text-text-subtle",
};

const badgeIcon = (status: CampaignStatus) => {
  switch (status) {
    case "SENT":
      return <Check className="size-3" />;
    case "FAILED":
    case "CANCELLED":
      return <X className="size-3" />;
    case "SCHEDULED":
    case "QUEUED":
    case "PENDING_PAYMENT":
      return <TimeFill className="size-3" fill="var(--color-bg-basic-orange-strong)" />;
    case "DRAFT":
      return <Draft className="size-3" fill="var(--color-icon-default-muted)" />;
    default:
      return null;
  }
};

export const getCampaignStatusBadge = (status: CampaignStatus) => {
  return (
    <Badge className={`border-border-default h-5 rounded-md text-xs font-medium ${badgeClass[status] ?? "bg-bg-badge-default text-text-subtle"}`}>
      {badgeIcon(status)}
      <span>{STATUS_LABEL[status] ?? status}</span>
    </Badge>
  );
};
