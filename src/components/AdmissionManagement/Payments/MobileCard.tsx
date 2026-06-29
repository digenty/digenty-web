"use client";

import { PaymentListItemDto } from "@/api/admission";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { FEE_LABEL, PaymentStatusBadge } from "./columns";
import { Download2 } from "@digenty/icons";

export const PaymentMobileCard = ({ record }: { record: PaymentListItemDto }) => (
  <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <div className="flex items-center gap-2">
        <Avatar className="size-5 shrink-0" />
        <p className="text-text-default font-medium">{record.studentName}</p>
      </div>
      <Button variant="ghost" className="size-7 p-0">
        <Download2 fill="var(--color-icon-default-subtle)" className="size-4" />
      </Button>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Applicant ID</p>
      <p className="text-text-default">{record.applicantNumber}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Fee</p>
      <p className="text-text-default">{FEE_LABEL[record.feeType]}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Amount</p>
      <p className="text-text-default font-medium">₦{record.amount.toLocaleString()}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Payment Status</p>
      <PaymentStatusBadge status={record.paymentStatus} />
    </div>

    <div className="flex h-9.5 items-center justify-between px-3">
      <p className="text-text-muted">Date</p>
      <p className="text-text-default">{record.date}</p>
    </div>
  </div>
);
