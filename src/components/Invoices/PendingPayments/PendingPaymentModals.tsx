"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import { toast } from "@/components/Toast";
import { PendingPaymentEntry } from "@/api/invoice";
import { useApprovePendingPayment, useRejectPendingPayment } from "@/hooks/queryHooks/useInvoice";

const PaymentSummary = ({ payment }: { payment: PendingPaymentEntry }) => (
  <div className="border-border-default m-2 flex flex-col gap-3 rounded-sm border p-4">
    <div className="flex justify-between">
      <div className="text-text-muted text-sm font-medium">Student</div>
      <div className="text-text-default text-sm font-medium">{payment.studentName}</div>
    </div>
    <div className="flex justify-between">
      <div className="text-text-muted text-sm font-medium">Invoice</div>
      <div className="text-text-default text-sm font-medium">{payment.invoiceNumber}</div>
    </div>
    <div className="flex justify-between">
      <div className="text-text-muted text-sm font-medium">Amount</div>
      <div className="text-text-default text-sm font-medium">₦{payment.amount.toLocaleString()}</div>
    </div>
    {payment.feeItems.length > 0 && (
      <div className="flex flex-col gap-1">
        <div className="text-text-muted text-sm font-medium">Applied to</div>
        {payment.feeItems.map(item => (
          <div key={item.studentFeeItemId} className="flex justify-between">
            <span className="text-text-default text-sm">{item.name}</span>
            <span className="text-text-default text-sm">₦{item.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )}
    {payment.proofUrl && (
      <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="text-text-informative text-sm font-medium underline">
        View proof of payment
      </a>
    )}
  </div>
);

export const ApprovePaymentModal = ({
  payment,
  open,
  setOpen,
}: {
  payment: PendingPaymentEntry;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();
  const [note, setNote] = useState("");
  const { mutate: approve, isPending } = useApprovePendingPayment();

  const handleApprove = () => {
    approve(
      { invoiceId: payment.invoiceId, paymentId: payment.paymentId, note: note.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: "Payment approved", type: "success" });
          setOpen(false);
        },
        onError: (error: unknown) => {
          const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
          toast({ title: "Failed to approve payment", description, type: "error" });
        },
      },
    );
  };

  const content = (
    <>
      <PaymentSummary payment={payment} />
      <div className="mx-2 mb-2 space-y-2">
        <div className="text-text-default text-sm font-medium">Note (optional)</div>
        <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for this approval…" className="min-h-20" />
      </div>
    </>
  );

  const actionButton = (
    <Button
      onClick={handleApprove}
      disabled={isPending}
      className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      {isPending ? "Approving…" : "Approve Payment"}
    </Button>
  );

  if (!isMobile) {
    return (
      <Modal open={open} setOpen={setOpen} title="Approve Payment" ActionButton={actionButton}>
        {content}
      </Modal>
    );
  }

  return (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Approve Payment">
      {content}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {actionButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  );
};

export const RejectPaymentModal = ({
  payment,
  open,
  setOpen,
}: {
  payment: PendingPaymentEntry;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const { mutate: reject, isPending } = useRejectPendingPayment();
  const noteError = touched && !note.trim() ? "Please explain why this payment is being rejected" : undefined;

  const handleReject = () => {
    setTouched(true);
    if (!note.trim()) return;
    reject(
      { invoiceId: payment.invoiceId, paymentId: payment.paymentId, note: note.trim() },
      {
        onSuccess: () => {
          toast({ title: "Payment rejected", type: "success" });
          setOpen(false);
        },
        onError: (error: unknown) => {
          const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
          toast({ title: "Failed to reject payment", description, type: "error" });
        },
      },
    );
  };

  const content = (
    <>
      <PaymentSummary payment={payment} />
      <div className="mx-2 mb-2 space-y-2">
        <div className="text-text-default text-sm font-medium">
          Reason for rejection <span className="text-text-destructive">*</span>
        </div>
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder="Let the parent know why this payment wasn't accepted…"
          className="min-h-20"
        />
        {noteError && <p className="text-text-destructive text-xs font-light">{noteError}</p>}
      </div>
    </>
  );

  const actionButton = (
    <Button
      onClick={handleReject}
      disabled={isPending}
      className="hover:text-text-white-default! bg-bg-state-disabled text-text-hint hover:bg-bg-state-destructive! h-7! rounded-md px-2 py-1 text-sm disabled:opacity-50"
    >
      {isPending ? "Rejecting…" : "Reject Payment"}
    </Button>
  );

  if (!isMobile) {
    return (
      <Modal open={open} setOpen={setOpen} title="Reject Payment" ActionButton={actionButton}>
        {content}
      </Modal>
    );
  }

  return (
    <MobileDrawer open={open} setIsOpen={setOpen} title="Reject Payment">
      {content}
      <DrawerFooter className="border-border-default border-t">
        <div className="flex justify-between">
          <DrawerClose asChild>
            <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-2 py-1 text-sm font-medium">Cancel</Button>
          </DrawerClose>
          {actionButton}
        </div>
      </DrawerFooter>
    </MobileDrawer>
  );
};
