"use client";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

import { BackLink } from "@/components/BackLink";
import { Button } from "../../ui/button";

type EditCampaignHeaderProps = {
  campaignId: string;
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
};

export const EditCampaignHeader = ({ campaignId, onCancel, onSave, saving }: EditCampaignHeaderProps) => {
  useBreadcrumb([
    { label: "Communications", url: "/staff/communications" },
    { label: "Edit Campaign", url: "" },
  ]);

  return (
    <div className="border-border-default bg-bg-card-subtle border-b px-4 py-3 md:px-8">
      <div className="mb-2 md:hidden">
        <BackLink href={`/staff/communications/${campaignId}`} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-text-default text-xl font-semibold">Edit Campaign</h1>

        <div className="flex items-center gap-2">
          <Button
            onClick={onCancel}
            className="bg-bg-state-secondary text-text-default border-border-darker h-8 border px-3 py-1.5 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-8 px-3 py-1.5 text-sm font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
