import { Draft, TimeFill } from "@digenty/icons";
import { Check, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { CampaignStatus } from "./types";

export const getCampaignStatusBadge = (status: CampaignStatus) => {
  switch (status) {
    case "Delivered":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Delivered</span>
        </Badge>
      );
    case "Failed":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Failed</span>
        </Badge>
      );
    case "Scheduled":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TimeFill className="size-3" fill="var(--color-bg-basic-orange-strong)" />
          <span>Scheduled</span>
        </Badge>
      );
    case "Sending":
      return (
        <Badge className="bg-bg-badge-blue text-bg-basic-blue-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Sending</span>
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" />
          <span>Draft</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-bg-badge-default text-text-subtle border-border-default h-5 rounded-md text-xs font-medium">
          <span className="capitalize">{status}</span>
        </Badge>
      );
  }
};
