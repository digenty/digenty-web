"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import Download2 from "@/components/Icons/Download2";
import { PaymentStatusBadge } from "./columns";
import { PaymentRecord } from "./types";

export const PaymentMobileCard = ({ record }: { record: PaymentRecord }) => (
  <div className="bg-bg-subtle border-border-default rounded-sm border text-sm font-medium">
    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <div className="flex items-center gap-2">
        <Avatar className="size-5 shrink-0" url={record.image} />
        <p className="text-text-default font-medium">{record.studentName}</p>
      </div>
      <Button variant="ghost" className="size-7 p-0">
        <Download2 fill="var(--color-icon-default-subtle)" className="size-4" />
      </Button>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Applicant ID</p>
      <p className="text-text-default">{record.applicantId}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Class</p>
      <p className="text-text-default">{record.className}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Fee</p>
      <p className="text-text-default">{record.fee}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Amount</p>
      <p className="text-text-default font-medium">₦{record.amount.toLocaleString()}</p>
    </div>

    <div className="border-border-default flex h-9.5 items-center justify-between border-b px-3">
      <p className="text-text-muted">Payment Status</p>
      <PaymentStatusBadge status={record.status} />
    </div>

    <div className="flex h-9.5 items-center justify-between px-3">
      <p className="text-text-muted">Date</p>
      <p className="text-text-default">{record.date}</p>
    </div>
  </div>
);
