import React from "react";
import { Button } from "../ui/button";
import Eye from "../Icons/Eye";
import { SendPlane } from "../Icons/SendPlane";
import { EyeClose } from "../Icons/EyeClose";
import { X } from "lucide-react";

type PreviewProps = {
  openPreview: boolean;
  onPreviewToggle: (open: boolean) => void;
};

export const EditInvoiceHeader = ({ openPreview, onPreviewToggle }: PreviewProps) => {
  return (
    <div className="mb-3">
      <div className="bg-bg-card-subtle border-border-default flex justify-between gap-3 border-b px-4 py-3 md:flex-row md:px-8">
        <div className="text-text-default text-xl font-semibold">Edit Invoice</div>

        <div className="hidden gap-1 md:flex md:justify-between">
          <Button className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-fit items-center gap-1 border px-2.5 py-1.5 text-sm font-medium">
            <X className="text-icon-default-muted" /> Canel
          </Button>
          <Button
            onClick={() => onPreviewToggle(!openPreview)}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-1/2 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-fit"
          >
            {!openPreview ? (
              <>
                <Eye fill="var(--color-icon-default-muted)" /> Preview
              </>
            ) : (
              <div className="flex items-center gap-1">
                <EyeClose fill="var(--color-icon-default-muted)" /> Hide Preview
              </div>
            )}
          </Button>
          <Button className="bg-bg-state-primary hover:bg-bg-state-primary/90! border-border-darker text-text-white-default hidden h-8 items-center gap-1 px-2.5 py-1.5 text-sm font-medium md:flex">
            <SendPlane fill="var(--color-icon-white-default)" /> Save Changes
          </Button>
        </div>
      </div>
      <div className="flex gap-2.5 px-4 py-2 md:hidden">
        <Button
          onClick={() => onPreviewToggle(!openPreview)}
          className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-full items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-fit"
        >
          <Eye fill="var(--color-icon-default-muted)" /> Preview
        </Button>
      </div>
    </div>
  );
};
