import { CalendarEventFill, Information } from "@digenty/icons";
import { Check } from "lucide-react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

type SummaryCardProps = {
  recipients: number;
  ratePerMessage: number;
  totalCost: number;
  scheduled: boolean;
  paid?: boolean;
  hideInfoBanner?: boolean;
  submitting?: boolean;
  onSubmit?: () => void;
};

export const SummaryCard = ({
  recipients,
  ratePerMessage,
  totalCost,
  scheduled,
  paid = false,
  hideInfoBanner = false,
  submitting,
  onSubmit,
}: SummaryCardProps) => {
  const formattedCost = `₦${totalCost.toLocaleString()}`;
  const ctaLabel = scheduled ? `Pay ${formattedCost} & Schedule` : `Pay ${formattedCost} & Continue`;

  return (
    <div className="border-border-default bg-bg-card flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-text-default text-sm font-semibold">Summary</h3>
        {paid && (
          <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default flex h-5 items-center gap-1 rounded-md text-xs font-medium">
            <Check className="size-3" /> Paid
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Recipients</span>
          <span className="text-text-default font-medium">{recipients}</span>
        </div>
        <div className="border-border-default border-t" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Rate per message</span>
          <span className="text-text-default font-medium">₦{ratePerMessage}</span>
        </div>
        <div className="border-border-default border-t" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Total Cost</span>
          <span className="text-text-default font-semibold">{formattedCost}</span>
        </div>
      </div>

      {!hideInfoBanner && (
        <div className="border-border-default bg-bg-card-subtle flex items-start gap-2 rounded-md border p-3">
          <Information fill="var(--color-icon-default-muted)" className="mt-0.5 size-4 shrink-0" />
          <p className="text-text-muted text-xs leading-relaxed">
            You&apos;ll be redirected to a secure payment gateway to complete this transaction. Your campaign will be ready to send once payment
            is confirmed.
          </p>
        </div>
      )}

      {!hideInfoBanner && (
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-9 w-full items-center justify-center gap-2 rounded-md text-sm font-medium"
        >
          <CalendarEventFill fill="var(--color-icon-white-default)" className="size-4" />
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};
