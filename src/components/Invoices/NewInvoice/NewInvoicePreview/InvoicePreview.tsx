"use client";

import { Avatar } from "@/components/Avatar";
import { Bank } from "@/components/Icons/Bank";
import BankCard from "@/components/Icons/BankCard";
import { LogoMark } from "@/components/Icons/LogoMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PreviewTable } from "./PreviewTable";
import { FileCopy } from "@/components/Icons/FileCopy";
import Download2 from "@/components/Icons/Download2";
import { EyeClose } from "@/components/Icons/EyeClose";

type ToggleProp = {
  onPreviewToggle: (open: boolean) => void;
};

export const InvoicePreview = ({ onPreviewToggle }: ToggleProp) => {
  const content = (
    <div className="bg-bg-subtle border-border-default rounded-sm border p-1.5">
      <div className="border-border-default bg-bg-default flex flex-col gap-6 rounded-sm border p-5">
        <div className="text-text-default flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-bold">
            <LogoMark /> Digenty
          </div>
          <div className="text-xl font-semibold">INVOICE</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-text-default text-sm font-semibold">Bill for</div>
              <div className="flex items-center gap-1">
                <Avatar username="Damilare John" className="size-4" />
                <span className="text-text-informative text-sm font-medium">Damilare John</span>
              </div>
            </div>
            <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default rounded-md text-xs font-medium">
              <X className="size-3" />
              <span>Unpaid</span>
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">JSS 1 A</span>
              <span className="text-text-muted text-sm font-normal">Issued Date</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">GFA/2023/01045</span>
              <span className="text-text-default text-sm font-medium">25/09/2004</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-default text-sm font-semibold">Invoice number</span>
              <span className="text-text-muted text-sm font-normal">Due Date</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">GFA/2023/01045</span>
              <span className="text-text-default text-sm font-medium">25/09/2004</span>
            </div>
          </div>
        </div>

        <PreviewTable />

        <div>
          <div className="text-text-default mb-2 text-sm font-semibold">Note</div>
          <div className="bg-bg-muted text-text-default rounded-sm p-4 text-sm font-normal">
            Payment can be made via bank transfer to the school account or through our online payment portal. For bank transfers, please include the
            invoice number as reference.
          </div>
        </div>

        <div>
          <div className="text-text-default mb-2 text-sm font-semibold">Payment Options</div>
          <div className="border-border-default flex flex-col gap-2 rounded-sm border p-4">
            <div className="flex items-center gap-1">
              <BankCard fill="var(--color-bg-basic-teal-accent)" />
              <span className="text-text-default text-sm font-medium">Online Payment</span>
            </div>
            <div className="text-text-subtle text-sm">Pay securely with card or bank transfer.</div>
            <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7 w-full text-sm">Pay Online</Button>
          </div>
        </div>

        <div className="border-border-default flex flex-col gap-1 rounded-sm border p-4">
          <div className="text-text-default flex items-center gap-1 text-sm font-medium">
            <Bank fill="var(--color-bg-basic-purple-accent)" /> Bank Payment
          </div>

          <div className="text-text-subtle mb-2 text-sm font-normal">Transfer to our bank account using the details below</div>

          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm font-normal">Account Name</div>
            <div className="text-text-default text-sm font-medium">Greenfield Academy</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm font-normal">Account Number</div>
            <div className="text-text-default flex items-center gap-1 text-sm font-medium">
              0123456789
              <FileCopy fill="var(--color-icon-default-muted)" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-text-muted text-sm font-normal">Bank</div>
            <div className="text-text-default text-sm font-medium">Access Bank</div>
          </div>

          <div className="bg-bg-basic-orange-subtle text-text-subtle border-border-default rounded-xs border px-3 py-2.5 text-sm">
            <div className="font-semibold">Important:</div>
            Please include invoice number &apos;GFA/2023/01045&apos; as transfer reference
          </div>
        </div>

        <Button className="text-text-default border-border-default flex h-8 w-41 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium">
          <Download2 fill="var(--color-icon-default-muted)" />
          Download Invoice
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex items-center justify-center p-4">
          <div className="max-h-[86vh] w-full overflow-y-auto">{content}</div>
        </div>

        <div onClick={() => onPreviewToggle(false)} className="absolute right-0 bottom-6 left-0 z-20 flex justify-center px-4">
          <Button className="text-text-default bg-bg-state-secondary border-border-darker flex items-center gap-2 rounded-md border px-4 py-2 text-center">
            <EyeClose fill="var(--color-icon-default-muted)" />
            <span>Hide preview</span>
          </Button>
        </div>
      </div>
    </>
  );
};
