"use client";

import { Avatar } from "@/components/Avatar";
import { OverviewCard } from "@/components/OverviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { useGetFeeOverview, useGetInvoice, useGetPayFeesData } from "@/hooks/queryHooks/useParentFees";
import { useInitiatePayment } from "@/hooks/queryHooks/usePayment";
import { useGetUserProfile } from "@/hooks/queryHooks/useProfile";
import { useStudentFilterStore } from "@/store/parent";
import { InvoiceStatus } from "@/api/parent-fees";
import { exportToPDF } from "@/lib/export-utils";
import { AlertFill, Bank, BankCard, CheckboxCircleFill, Download2, FileCopy, LogoMark } from "@digenty/icons";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const invoiceStatusConfig: Record<InvoiceStatus, { label: string; className: string }> = {
  PAID: { label: "Paid", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  UNPAID: { label: "Unpaid", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  PARTIALLY_PAID: { label: "Partially Paid", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  DRAFT: { label: "Draft", className: "bg-bg-badge-gray text-bg-basic-gray-strong" },
};

export const FeesBreakdown = ({ termId }: { termId?: number }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFeeIds, setSelectedFeeIds] = useState<Set<number>>(new Set());
  const { selectedStudentId } = useStudentFilterStore();
  const { data: profile } = useGetUserProfile();
  const profileEmail: string | undefined = profile?.data?.email;

  const { data: overview, isLoading: loadingOverview, isError: isErrorOverview, error: overviewError } = useGetFeeOverview(selectedStudentId, termId);
  const { data: invoice, isLoading: loadingInvoice, isError: isErrorInvoice, error: invoiceError } = useGetInvoice(selectedStudentId, termId);
  const { data: payFeesData } = useGetPayFeesData(selectedStudentId, termId);

  const initiatePayment = useInitiatePayment();

  useEffect(() => {
    setSelectedFeeIds(new Set());
  }, [selectedStudentId, termId]);

  const toggleFeeSelection = (id: number) => {
    setSelectedFeeIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyAccountNumber = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    toast.success("Account number copied");
  };

  const handlePayOnline = () => {
    if (!invoice) return;
    if (!profileEmail) {
      toast.error("Add an email address in Settings to pay online.");
      return;
    }
    const hasSelectedFees = selectedFeeIds.size > 0;
    const selectedFeeItems = [...(payFeesData?.requiredFees ?? []), ...(payFeesData?.optionalFees ?? [])].filter(fee =>
      selectedFeeIds.has(fee.studentFeeItemId),
    );
    const customAmount = selectedFeeItems.reduce((sum, fee) => sum + fee.balance, 0);

    if (hasSelectedFees && customAmount <= 0) {
      toast.error("Selected fees have no outstanding balance to pay.");
      return;
    }

    initiatePayment.mutate(
      {
        invoiceId: invoice.invoiceId,
        email: profileEmail,
        currency: "NGN",
        paymentType: hasSelectedFees ? "CUSTOM" : "FULL",
        callBackUrl: `${window.location.origin}/parents/parent-fees/verify?invoiceId=${invoice.invoiceId}`,
        selectedFeeIds: hasSelectedFees ? Array.from(selectedFeeIds) : undefined,
        customAmount: hasSelectedFees ? customAmount : undefined,
      },
      {
        onSuccess: data => {
          if (data?.authorizationUrl) {
            window.location.href = data.authorizationUrl;
          } else {
            toast.error("Could not start payment. Please try again.");
          }
        },
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to start payment"),
      },
    );
  };

  const handleDownloadInvoice = async () => {
    if (!invoice) return;
    setIsDownloading(true);
    try {
      await exportToPDF("invoice-card", `Invoice_${invoice.invoiceNumber}.pdf`);
    } catch {
      toast.error("Could not download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!selectedStudentId) {
    return <PageEmptyState title="No Student Selected" description="Select a student above to view their fees breakdown" buttonText="Refresh" />;
  }

  if (loadingOverview || loadingInvoice) {
    return (
      <div className="flex flex-col gap-5 md:gap-10">
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
          <Skeleton className="bg-bg-input-soft h-24 w-full rounded-md" />
          <Skeleton className="bg-bg-input-soft h-24 w-full rounded-md" />
          <Skeleton className="bg-bg-input-soft col-span-2 h-24 w-full rounded-md md:col-span-1" />
        </div>
        <Skeleton className="bg-bg-input-soft h-150 w-full rounded-md" />
      </div>
    );
  }

  if (isErrorOverview || isErrorInvoice) {
    const errorMessage =
      (overviewError as { message?: string } | null)?.message ??
      (invoiceError as { message?: string } | null)?.message ??
      "This is our problem, we are looking into it so as to serve you better";
    return (
      <div className="flex items-center justify-center p-10">
        <ErrorComponent title="Could not load fees breakdown" description={errorMessage} />
      </div>
    );
  }

  if (!overview && !invoice) {
    return (
      <PageEmptyState
        title="No Fees Found"
        description="There are no fees set up for this student yet"
        buttonText="Contact School Admin"
        url="/parents/parent-dashboard"
      />
    );
  }

  const totalFees = (overview?.totalPaid ?? 0) + (overview?.outstandingAmount ?? 0);
  const status = invoice ? invoiceStatusConfig[invoice.status] : null;
  const isPaid = invoice?.status === "PAID";

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
        <OverviewCard
          title="Total Fees"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`₦${totalFees.toLocaleString()}`}
        />
        <OverviewCard
          title="Total Paid"
          Icon={() => (
            <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`₦${(overview?.totalPaid ?? 0).toLocaleString()}`}
        />
        <OverviewCard
          title="Outstanding"
          Icon={() => (
            <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value={`₦${(overview?.outstandingAmount ?? 0).toLocaleString()}`}
          className="col-span-2 md:col-span-1"
        />
      </div>

      {invoice && (
        <div className="">
          <div className="bg-bg-subtle border-border-default rounded-sm border p-1.5">
            <div id="invoice-card" className="border-border-default bg-bg-default flex flex-col gap-6 rounded-sm border p-5">
              <div className="text-text-default flex items-center justify-between">
                <div className="flex items-center gap-1 text-lg font-bold">
                  <LogoMark />
                </div>
                <div className="text-xl font-semibold">INVOICE</div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-text-default text-sm font-semibold">Bill for</div>
                    <div className="flex items-center gap-1">
                      <Avatar className="size-4" />
                      <span className="text-text-informative text-sm font-medium">{invoice.studentName}</span>
                    </div>
                  </div>
                  {status && (
                    <Badge className={`${status.className} border-border-default rounded-md text-xs font-medium`}>
                      {invoice.status !== "PAID" && <X className="size-3" />}
                      <span>{status.label}</span>
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-text-muted text-sm font-normal">{invoice.className}</span>
                    <span className="text-text-muted text-sm font-normal">{invoice.termName}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-text-default text-sm font-semibold">Invoice number</span>
                    <span className="text-text-muted text-sm font-normal">Due Date</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-text-muted text-sm font-normal">{invoice.invoiceNumber}</span>
                    <span className="text-text-default text-sm font-medium">{invoice.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {invoice.requiredFees.map((fee, index) => {
                  const progressPercentage = fee.amount ? Math.min((fee.amountPaid / fee.amount) * 100, 100) : 0;
                  const pendingFee = payFeesData?.requiredFees.find(p => p.name === fee.name);
                  return (
                    <div key={`${fee.name}-${index}`} className="border-border-default flex w-full flex-col gap-3 rounded-sm border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {!isPaid && pendingFee && pendingFee.balance > 0 && (
                            <Checkbox
                              checked={selectedFeeIds.has(pendingFee.studentFeeItemId)}
                              onCheckedChange={() => toggleFeeSelection(pendingFee.studentFeeItemId)}
                              className="rounded-sm"
                            />
                          )}
                          <div className="text-text-default text-sm">{fee.name}</div>
                        </div>
                        <div className="text-text-default text-sm">₦{fee.amount.toLocaleString()}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-text-default text-sm">₦{fee.amountPaid.toLocaleString()}</div>
                        <div className="text-text-muted text-sm">₦{fee.balance.toLocaleString()}</div>
                      </div>
                      <div className="bg-border-default relative h-1 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {invoice.requiredFees.length === 0 && <p className="text-text-muted text-xs">No required fees for this term</p>}
              </div>

              <div className="border-border-default flex items-center justify-between border-b pb-5">
                <div className="text-text-informative text-sm font-medium">Total Required Balance</div>
                <div className="text-text-default text-sm font-semibold">
                  ₦{invoice.requiredFees.reduce((sum, fee) => sum + fee.balance, 0).toLocaleString()}
                </div>
              </div>

              <div className="text-text-default text-sm font-semibold">Optional Fees</div>

              <div className="flex flex-col gap-2">
                {invoice.optionalFees.map((fee, index) => {
                  const progressPercentage = fee.amount ? Math.min((fee.amountPaid / fee.amount) * 100, 100) : 0;
                  const isOpen = openIndex === index;
                  const pendingFee = payFeesData?.optionalFees.find(p => p.name === fee.name);

                  return (
                    <div
                      key={`${fee.name}-${index}`}
                      className="border-border-default flex w-full cursor-pointer flex-col gap-3 rounded-sm border p-4"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {!isPaid && pendingFee && pendingFee.balance > 0 && (
                            <Checkbox
                              checked={selectedFeeIds.has(pendingFee.studentFeeItemId)}
                              onCheckedChange={() => toggleFeeSelection(pendingFee.studentFeeItemId)}
                              onClick={e => e.stopPropagation()}
                              className="rounded-sm"
                            />
                          )}
                          <div className="text-text-default text-sm">{fee.name}</div>
                        </div>
                        <div className="text-text-default text-sm">₦{fee.amount.toLocaleString()}</div>
                      </div>

                      {isOpen && (
                        <>
                          <div className="flex items-center justify-between">
                            <div className="text-text-default text-sm">₦{fee.amountPaid.toLocaleString()}</div>
                            <div className="text-text-muted text-sm">₦{fee.balance.toLocaleString()}</div>
                          </div>
                          <div className="bg-border-default relative h-1 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {invoice.optionalFees.length === 0 && <p className="text-text-muted text-xs">No optional fees for this term</p>}
              </div>

              <div className="border-border-default flex items-center justify-between border-b pb-5">
                <div className="text-text-informative text-sm font-medium">Total Optional Balance</div>
                <div className="text-text-default text-sm font-semibold">
                  ₦{invoice.optionalFees.reduce((sum, fee) => sum + fee.balance, 0).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-text-default mb-2 text-sm font-semibold">Note</div>
                <div className="bg-bg-muted text-text-default rounded-sm p-4 text-sm font-normal">
                  Payment can be made via bank transfer to the school account or through our online payment portal. For bank transfers, please include
                  the invoice number as reference.
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
                  <Button
                    onClick={handlePayOnline}
                    disabled={initiatePayment.isPending || isPaid}
                    className="pdf-ignore text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-10 w-full text-sm disabled:opacity-50"
                  >
                    {isPaid ? "Paid" : initiatePayment.isPending ? "Redirecting…" : "Pay Online"}
                  </Button>
                </div>
              </div>

              {invoice.collectionAccount && (
                <div className="border-border-default flex flex-col gap-1 rounded-sm border p-4">
                  <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                    <Bank fill="var(--color-bg-basic-purple-accent)" /> Bank Payment
                  </div>

                  <div className="text-text-subtle mb-2 text-sm font-normal">Transfer to our bank account using the details below</div>

                  <div className="flex items-center justify-between">
                    <div className="text-text-muted text-sm font-normal">Account Name</div>
                    <div className="text-text-default text-sm font-medium">{invoice.collectionAccount.accountName}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-text-muted text-sm font-normal">Account Number</div>
                    <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                      {invoice.collectionAccount.accountNumber}
                      <button
                        type="button"
                        onClick={() => handleCopyAccountNumber(invoice.collectionAccount.accountNumber)}
                        className="cursor-pointer"
                      >
                        <FileCopy fill="var(--color-icon-default-muted)" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-text-muted text-sm font-normal">Bank</div>
                    <div className="text-text-default text-sm font-medium">{invoice.collectionAccount.bankName}</div>
                  </div>

                  <div className="bg-bg-basic-orange-subtle text-text-subtle border-border-default rounded-xs border px-3 py-2.5 text-sm">
                    <div className="font-semibold">Important:</div>
                    Please include invoice number &apos;{invoice.invoiceNumber}&apos; as transfer reference
                  </div>
                </div>
              )}

              <Button
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
                className="pdf-ignore text-text-default border-border-default flex h-8 w-41 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium disabled:opacity-50"
              >
                <Download2 fill="var(--color-icon-default-muted)" />
                {isDownloading ? "Downloading…" : "Download Invoice"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
