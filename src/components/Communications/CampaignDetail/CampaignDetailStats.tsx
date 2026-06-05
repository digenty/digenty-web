import { ReactNode } from "react";

import { CampaignDetailDto } from "@/api/campaign";

import { Avatar } from "../../Avatar";
import { getCampaignStatusBadge } from "../StatusBadge";
import { formatCampaignDate, formatCampaignDateTime } from "../types";

type StatCell = {
  label: string;
  value: ReactNode;
};

const PersonCell = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2">
    <Avatar className="size-5" url="" />
    <span className="text-text-default text-sm font-medium">{name || "—"}</span>
  </div>
);

const textValue = (value: ReactNode) => <span className="text-text-default text-sm font-medium">{value}</span>;

export const CampaignDetailStats = ({ campaign }: { campaign: CampaignDetailDto }) => {
  const cells: StatCell[] = [
    { label: "Status", value: getCampaignStatusBadge(campaign.status) },
    { label: "Intended Recipients", value: textValue(campaign.intendedRecipientCount) },
    { label: "Delivered", value: textValue(campaign.deliveredCount) },
    { label: "Failed", value: textValue(campaign.failedCount) },
    { label: "Created Date", value: textValue(formatCampaignDate(campaign.createdAt)) },
    { label: "Delivery Date", value: textValue(formatCampaignDate(campaign.sentAt ?? campaign.scheduledAt)) },
    { label: "Created By", value: <PersonCell name={campaign.createdByName} /> },
    { label: "Last Updated By", value: <PersonCell name={campaign.lastUpdatedByName} /> },
    { label: "Term & Session", value: textValue(campaign.termAndSession || "—") },
    { label: "Last Updated", value: textValue(formatCampaignDateTime(campaign.updatedAt)) },
  ];

  return (
    <div className="border-border-default grid grid-cols-2 overflow-hidden rounded-md border md:grid-cols-5">
      {cells.map((cell, index) => (
        <div key={`${cell.label}-${index}`} className="border-border-default flex flex-col gap-2 border-r border-b p-4 last:border-r-0 md:p-5">
          <span className="text-text-muted text-xs font-medium">{cell.label}</span>
          {cell.value}
        </div>
      ))}
    </div>
  );
};
