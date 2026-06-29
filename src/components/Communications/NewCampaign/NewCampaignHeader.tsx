"use client";

import { CalendarEventFill, Save } from "@digenty/icons";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";

import { Button } from "../../ui/button";

type NewCampaignHeaderProps = {
  totalCost: number;
  scheduled: boolean;
  onSaveDraft: () => void;
  onSchedule: () => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export const NewCampaignHeader = ({ totalCost, scheduled, onSaveDraft, onSchedule, onSubmit, submitting }: NewCampaignHeaderProps) => {
  const isMobile = useIsMobile();

  useBreadcrumb([
    { label: "Communications", url: "/staff/communications" },
    { label: "New Campaign", url: "" },
  ]);

  const formattedCost = `₦${totalCost.toLocaleString()}`;
  const ctaLabel = scheduled ? `Pay ${formattedCost} & Schedule` : `Pay ${formattedCost} & Continue`;

  return (
    <div className="border-border-default border-b bg-bg-card-subtle px-4 py-3 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-text-default text-xl font-semibold">New Campaign</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onSaveDraft}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
          >
            <Save fill="var(--color-icon-default-muted)" className="size-4" />
            Save as Draft
          </Button>

          {!scheduled && (
            <Button
              onClick={onSchedule}
              className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium"
            >
              <CalendarEventFill fill="var(--color-icon-default-muted)" className="size-4" />
              Schedule
            </Button>
          )}

          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 items-center gap-1 px-2.5 py-1.5 text-sm font-medium"
          >
            <CalendarEventFill fill="var(--color-icon-white-default)" className="size-4" />
            {isMobile ? ctaLabel.replace(" & Continue", "").replace(" & Schedule", "") : ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
