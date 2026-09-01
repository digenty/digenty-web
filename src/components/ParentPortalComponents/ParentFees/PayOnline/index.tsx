"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { StudentFilter } from "../../FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Information } from "@digenty/icons";
import { useGetPayFeesData, useRecordPayment } from "@/hooks/queryHooks/useParentFees";
import { useGetParentPortalTerms } from "@/hooks/queryHooks/useParentLookup";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useStudentFilterStore } from "@/store/parent";
import { PendingFeeItem } from "@/api/parent-fees";
import { feeStatusConfig } from "@/components/ParentPortalComponents/feeStatus";
import { TermLookup } from "@/api/parent-lookup";
import { toast } from "sonner";

const ProgressBar = ({ paid, amount }: { paid: number; amount: number }) => {
  const progressPercentage = amount ? Math.min((paid / amount) * 100, 100) : 0;
  return (
    <div className="bg-border-default relative h-1 w-full overflow-hidden rounded-full">
      <div className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};

/** Unpaid instalments in sequence order, used to label payableAmounts entries and to render the schedule. */
const unpaidInstallments = (fee: PendingFeeItem) => (fee.installments ?? []).filter(i => i.status !== "PAID").sort((a, b) => a.sequence - b.sequence);

/** payableAmounts[i] settles the first (i+1) unpaid instalments — build a human label for each option. */
const payableAmountOptions = (fee: PendingFeeItem): { value: number; label: string }[] => {
  const amounts = fee.payableAmounts ?? [];
  if (amounts.length <= 1) return amounts.map(value => ({ value, label: `₦${value.toLocaleString()}` }));

  const unpaid = unpaidInstallments(fee);
  return amounts.map((value, i) => {
    const covered = unpaid.slice(0, i + 1);
    const first = covered[0]?.sequence;
    const last = covered[covered.length - 1]?.sequence;
    const label = !first ? `₦${value.toLocaleString()}` : first === last ? `Pay instalment ${first}` : `Pay instalments ${first}–${last}`;
    return { value, label: `${label} — ₦${value.toLocaleString()}` };
  });
};

const InstallmentSchedule = ({ fee }: { fee: PendingFeeItem }) => {
  if (!fee.installments || fee.installments.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      {fee.installments.map(inst => {
        const status = feeStatusConfig[inst.status];
        return (
          <div key={inst.id} className="bg-bg-input-soft flex items-center justify-between rounded-md px-2.5 py-1.5">
            <span className="text-text-muted text-xs">
              Instalment {inst.sequence} · Due {inst.dueDate}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-text-default text-xs font-medium">₦{inst.amount.toLocaleString()}</span>
              <Badge className={`${status?.className ?? ""} rounded-md text-[10px] font-medium`}>{status?.label ?? inst.status}</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FeeItemRow = ({
  fee,
  checked,
  onCheck,
  amount,
  onAmountChange,
}: {
  fee: PendingFeeItem;
  checked: boolean;
  onCheck: (id: number) => void;
  amount: number;
  onAmountChange: (id: number, amount: number) => void;
}) => {
  const amountAfterPayment = fee.balance - amount;
  const payableAmounts = fee.payableAmounts;
  const settled = payableAmounts !== null && payableAmounts.length === 0;
  const options = payableAmounts !== null && payableAmounts.length > 1 ? payableAmountOptions(fee) : [];
  const fixedAmount = payableAmounts !== null && payableAmounts.length === 1 ? payableAmounts[0] : null;

  return (
    <div className="border-border-default flex w-full flex-col gap-3 rounded-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!settled && <Checkbox checked={checked} onCheckedChange={() => onCheck(fee.studentFeeItemId)} className="rounded-sm" />}
          <p className="text-text-default text-sm">{fee.name}</p>
        </div>
        <p className="text-text-default text-sm font-medium">₦{fee.amount.toLocaleString()}</p>
      </div>

      {fee.amountPaid > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-text-subtle text-sm font-medium">Paid: ₦{fee.amountPaid.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Balance: ₦{fee.balance.toLocaleString()}</p>
          </div>
          <ProgressBar paid={fee.amountPaid} amount={fee.amount} />
        </>
      )}

      <InstallmentSchedule fee={fee} />

      {checked && !settled && (
        <div className="flex flex-col gap-2">
          <p className="text-text-default text-sm font-medium">Amount to Pay</p>

          {fixedAmount !== null ? (
            <div className="bg-bg-input-soft! flex h-8 items-center rounded-md px-3 text-sm">₦{fixedAmount.toLocaleString()}</div>
          ) : options.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {options.map(option => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm ${
                    amount === option.value ? "border-border-informative border-2" : "border-border-default"
                  }`}
                >
                  <input
                    type="radio"
                    name={`payable-${fee.studentFeeItemId}`}
                    checked={amount === option.value}
                    onChange={() => onAmountChange(fee.studentFeeItemId, option.value)}
                  />
                  <span className="text-text-default">{option.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-bg-input-soft! flex h-8 flex-1 items-center gap-1 rounded-md px-3 py-2">
                <span className="text-text-muted text-sm">₦</span>
                <Input
                  type="number"
                  value={amount || ""}
                  onChange={e => onAmountChange(fee.studentFeeItemId, Math.min(Number(e.target.value) || 0, fee.balance))}
                  placeholder="0.00"
                  className="text-text-default h-5 border-none! bg-none p-0 text-sm"
                />
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => onAmountChange(fee.studentFeeItemId, fee.balance)}
                className="bg-bg-input-soft text-text-subtle hover:bg-bg-input-soft text-sm font-medium"
              >
                Pay Full
              </Button>
            </div>
          )}

          <div className="border-border-default rounded-md border">
            <div className="border-border-default flex items-center justify-between border-b p-4">
              <p className="text-text-default text-sm">Paying now</p>
              <p className="text-text-default text-sm">₦{amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="text-text-default text-sm">Amount after Payment</p>
              <p className="text-text-success text-sm">₦{Math.max(amountAfterPayment, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PayInvoice = () => {
  const user = useLoggedInUser();
  const { selectedStudentId } = useStudentFilterStore();
  const [termSelected, setTermSelected] = useState<TermLookup | null>(null);
  const [checkedRequired, setCheckedRequired] = useState<Set<number>>(new Set());
  const [checkedOptional, setCheckedOptional] = useState<Set<number>>(new Set());
  const [amounts, setAmounts] = useState<Record<number, number>>({});

  const { data: terms, isLoading: loadingTerms } = useGetParentPortalTerms(user?.schoolId);
  const { data: payFeesData, isLoading: loadingPayFeesData, isError: isErrorPayFeesData } = useGetPayFeesData(selectedStudentId, termSelected?.id);
  const recordPayment = useRecordPayment(selectedStudentId);

  useEffect(() => {
    if (terms?.length && !termSelected) {
      setTermSelected(terms.find(t => t.isActive) ?? terms[0]);
    }
  }, [terms, termSelected]);

  useEffect(() => {
    setCheckedRequired(new Set());
    setCheckedOptional(new Set());
    setAmounts({});
  }, [selectedStudentId, termSelected?.id]);

  /** Default amount for a newly-checked fee: the first payableAmounts entry (the "next thing due"), or the balance for a free-amount (FLEXIBLE) fee. */
  const defaultAmountFor = (fee: PendingFeeItem) => (fee.payableAmounts && fee.payableAmounts.length > 0 ? fee.payableAmounts[0] : fee.balance);

  const toggleRequired = (id: number) => {
    setCheckedRequired(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const fee = payFeesData?.requiredFees.find(f => f.studentFeeItemId === id);
        if (fee) setAmounts(a => ({ ...a, [id]: defaultAmountFor(fee) }));
      }
      return next;
    });
  };

  const toggleOptional = (id: number) => {
    setCheckedOptional(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const fee = payFeesData?.optionalFees.find(f => f.studentFeeItemId === id);
        if (fee) setAmounts(a => ({ ...a, [id]: defaultAmountFor(fee) }));
      }
      return next;
    });
  };

  const requiredFees = payFeesData?.requiredFees ?? [];
  const optionalFees = payFeesData?.optionalFees ?? [];
  const selectedRequired = requiredFees.filter(f => checkedRequired.has(f.studentFeeItemId));
  const selectedOptional = optionalFees.filter(f => checkedOptional.has(f.studentFeeItemId));
  const allSelected = [...selectedRequired, ...selectedOptional];
  const totalCost = allSelected.reduce((sum, f) => sum + (amounts[f.studentFeeItemId] ?? f.balance), 0);

  const handlePay = () => {
    if (!payFeesData || allSelected.length === 0) return;

    recordPayment.mutate(
      {
        studentFeeId: payFeesData.studentFeeId,
        items: allSelected.map(fee => ({
          studentFeeItemId: fee.studentFeeItemId,
          amount: amounts[fee.studentFeeItemId] ?? fee.balance,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Payment recorded successfully");
          setCheckedRequired(new Set());
          setCheckedOptional(new Set());
          setAmounts({});
        },
        onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to record payment"),
      },
    );
  };

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Fees</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <StudentFilter parentId={user?.id} />
      </div>

      {loadingTerms || !terms ? (
        <Skeleton className="bg-bg-input-soft h-8 w-40 rounded-md" />
      ) : (
        <Select
          value={termSelected ? String(termSelected.id) : ""}
          onValueChange={value => {
            const term = terms.find(t => String(t.id) === value);
            setTermSelected(term ?? null);
          }}
        >
          <SelectTrigger className="border-border-darker flex h-8! items-center gap-2 border">
            <SelectValue className="text-text-default flex font-medium">
              <Calendar fill="var(--color-icon-default-muted)" className="size-4" />
              <p className="text-text-default text-sm">
                {termSelected ? `${termSelected.academicSessionName} ${termSelected.term.toLowerCase()}` : "Select Term"}
              </p>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            {terms.map(t => (
              <SelectItem key={t.id} className="text-text-default" value={String(t.id)}>
                {t.academicSessionName} {t.term.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {!selectedStudentId && (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="text-text-default text-sm font-semibold">No Student Selected</div>

            <div className="text-text-muted text-xs">Select a student above to pay their fees</div>
          </div>
        </div>
      )}

      {selectedStudentId && loadingPayFeesData && (
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
          <Skeleton className="bg-bg-input-soft h-100 flex-1 rounded-md" />
          <Skeleton className="bg-bg-input-soft h-100 w-full rounded-md md:w-91" />
        </div>
      )}

      {selectedStudentId && isErrorPayFeesData && (
        <div className="flex items-center justify-center p-10">
          <ErrorComponent title="Could not load fees to pay" description="This is our problem, we are looking into it so as to serve you better" />
        </div>
      )}

      {selectedStudentId && !loadingPayFeesData && !isErrorPayFeesData && payFeesData && requiredFees.length === 0 && optionalFees.length === 0 && (
        <PageEmptyState
          title="No Fees to Pay"
          description="There are no outstanding fees for this student this term"
          buttonText="Go Back"
          url="/parents/parent-fees"
        />
      )}

      {selectedStudentId && !loadingPayFeesData && !isErrorPayFeesData && payFeesData && (requiredFees.length > 0 || optionalFees.length > 0) && (
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
          <div className="flex flex-1 flex-col gap-4">
            {requiredFees.length > 0 && (
              <div className="border-border-default flex flex-col gap-3 rounded-md border p-4">
                <p className="text-text-default text-sm font-semibold">Required Fees</p>
                <div className="flex flex-col gap-2">
                  {requiredFees.map(fee => (
                    <FeeItemRow
                      key={fee.studentFeeItemId}
                      fee={fee}
                      checked={checkedRequired.has(fee.studentFeeItemId)}
                      onCheck={toggleRequired}
                      amount={amounts[fee.studentFeeItemId] ?? 0}
                      onAmountChange={(id, value) => setAmounts(a => ({ ...a, [id]: value }))}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-text-default text-sm font-medium">Total Balance Required</p>
                  <p className="text-text-success text-sm font-semibold">₦{requiredFees.reduce((sum, f) => sum + f.balance, 0).toLocaleString()}</p>
                </div>
              </div>
            )}

            {optionalFees.length > 0 && (
              <div className="border-border-default flex flex-col gap-3 rounded-md border p-4">
                <div className="flex flex-col gap-0.5">
                  <p className="text-text-default text-md font-semibold">+ Add Optional Fees</p>
                  <p className="text-text-subtle text-xs">Select any optional fees you&apos;d like to pay now</p>
                </div>
                <div className="flex flex-col gap-2">
                  {optionalFees.map(fee => (
                    <FeeItemRow
                      key={fee.studentFeeItemId}
                      fee={fee}
                      checked={checkedOptional.has(fee.studentFeeItemId)}
                      onCheck={toggleOptional}
                      amount={amounts[fee.studentFeeItemId] ?? 0}
                      onAmountChange={(id, value) => setAmounts(a => ({ ...a, [id]: value }))}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-bg-subtle border-border-default rounded-md border p-1">
            <div className="border-border-default bg-bg-card flex w-full flex-col gap-4 rounded-md border p-4 md:w-91">
              <p className="text-text-default text-sm font-semibold">Summary</p>

              <div className="flex flex-col gap-3">
                {allSelected.map(fee => (
                  <div key={fee.studentFeeItemId} className="flex items-center justify-between">
                    <p className="text-text-subtle text-sm">{fee.name}</p>
                    <p className="text-text-default text-sm font-medium">₦{(amounts[fee.studentFeeItemId] ?? fee.balance).toLocaleString()}</p>
                  </div>
                ))}

                {allSelected.length === 0 && <p className="text-text-muted text-xs">No fees selected</p>}
              </div>

              {allSelected.length > 0 && (
                <>
                  <div className="border-border-default border-t pt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-text-subtle text-sm font-medium">Total Cost</p>
                      <p className="text-text-default text-sm font-medium">₦{totalCost.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-bg-basic-gray-subtle border-border-default flex items-start gap-2 rounded-md border px-3 py-2.5">
                    <Information fill="var(--color-icon-default)" className="size-10" />
                    <p className="text-text-subtle text-xs leading-relaxed">
                      You&apos;ll be redirected to a secure payment gateway to complete this transaction.
                    </p>
                  </div>

                  <Button
                    onClick={handlePay}
                    disabled={recordPayment.isPending || totalCost <= 0}
                    className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full"
                  >
                    {recordPayment.isPending ? "Processing..." : `Pay ₦${totalCost.toLocaleString()}`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
