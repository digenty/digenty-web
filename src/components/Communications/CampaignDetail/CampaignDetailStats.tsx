import { ReactNode } from "react";

import { Avatar } from "../../Avatar";
import { getCampaignStatusBadge } from "../StatusBadge";
import { Campaign } from "../types";

type StatCell = {
  label: string;
  value: ReactNode;
};

const PersonCell = ({ name }: { name: string }) => (
  <div className="flex items-center gap-2">
    <Avatar className="size-5" url="" />
    <span className="text-text-default text-sm font-medium">{name}</span>
  </div>
);

export const CampaignDetailStats = ({ campaign }: { campaign: Campaign }) => {
  const cells: StatCell[] = [
    { label: "Status", value: getCampaignStatusBadge(campaign.status) },
    { label: "Intended Recipients", value: <span className="text-text-default text-sm font-medium">{campaign.intendedRecipients}</span> },
    { label: "Delivered", value: <span className="text-text-default text-sm font-medium">{campaign.delivered}</span> },
    { label: "Failed", value: <span className="text-text-default text-sm font-medium">{campaign.failed}</span> },
    { label: "Created Date", value: <span className="text-text-default text-sm font-medium">{campaign.createdDate}</span> },
    { label: "Delivery Date", value: <span className="text-text-default text-sm font-medium">{campaign.deliveryDate}</span> },
    { label: "Created By", value: <PersonCell name={campaign.createdBy} /> },
    { label: "Last Updated By", value: <PersonCell name={campaign.lastUpdatedBy} /> },
    { label: "Term & Session", value: <span className="text-text-default text-sm font-medium">{campaign.termAndSession}</span> },
    { label: "Last Updated", value: <span className="text-text-default text-sm font-medium">{campaign.lastUpdated}</span> },
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
