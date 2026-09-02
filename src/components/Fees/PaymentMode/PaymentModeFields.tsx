"use client";

import type { FeePaymentMode } from "@/api/fee";
import { DateRangePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Close } from "@digenty/icons";

export interface InstallmentRowInput {
  percentage: number | "";
  dueDate: Date | undefined;
  label: string;
}

export const emptyInstallmentRow: InstallmentRowInput = { percentage: "", dueDate: undefined, label: "" };

const MODES: { value: FeePaymentMode; title: string; description: string }[] = [
  { value: "FULL", title: "Pay in full", description: "Parents must pay the whole amount at once." },
  { value: "FLEXIBLE", title: "Flexible", description: "Parents can pay any amount, any number of times, until it's settled." },
  { value: "INSTALLMENT", title: "Instalments", description: "Parents pay on a fixed schedule — whole instalments only." },
];

const MIN_ROWS = 2;
const MAX_ROWS = 12;

interface PaymentModeFieldsProps {
  mode: FeePaymentMode;
  installments: InstallmentRowInput[];
  onModeChange: (mode: FeePaymentMode) => void;
  onInstallmentsChange: (rows: InstallmentRowInput[]) => void;
  error?: string;
  disabled?: boolean;
}

export const PaymentModeFields = ({ mode, installments, onModeChange, onInstallmentsChange, error, disabled }: PaymentModeFieldsProps) => {
  const total = installments.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0);
  const totalRounded = Math.round(total * 100) / 100;

  const updateRow = (index: number, patch: Partial<InstallmentRowInput>) => {
    onInstallmentsChange(installments.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    if (installments.length >= MAX_ROWS) return;
    onInstallmentsChange([...installments, { ...emptyInstallmentRow }]);
  };

  const removeRow = (index: number) => {
    if (installments.length <= MIN_ROWS) return;
    onInstallmentsChange(installments.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-text-default text-sm font-medium">Payment Mode</Label>
        <p className="text-text-subtle text-xs">Click a card below to choose how parents are allowed to pay this fee.</p>
        <div className="border-border-default flex flex-col gap-2 rounded-md border p-1 md:flex-row">
          {MODES.map(m => {
            const active = mode === m.value;
            return (
              <button
                key={m.value}
                type="button"
                disabled={disabled}
                onClick={() => onModeChange(m.value)}
                className={cn(
                  "flex flex-1 cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                  active ? "bg-bg-state-primary text-text-white-default" : "hover:bg-bg-state-soft",
                )}
              >
                <span className="text-sm font-medium">{m.title}</span>
                <span className={cn("text-xs font-normal", active ? "text-text-white-default/80" : "text-text-subtle")}>{m.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      {mode === "INSTALLMENT" && (
        <div className="border-border-default flex flex-col gap-3 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div className="text-text-default text-sm font-medium">Instalment Schedule</div>
            <span
              className={cn(
                "rounded-sm px-2 py-0.5 text-xs font-medium",
                totalRounded === 100 ? "text-bg-basic-green-strong bg-bg-badge-green" : "text-bg-basic-red-strong bg-bg-badge-red",
              )}
            >
              {totalRounded}% of 100%
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {installments.map((row, i) => (
              <div key={i} className="border-border-default flex flex-col gap-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-xs font-medium">Instalment {i + 1}</span>
                  {installments.length > MIN_ROWS && !disabled && (
                    <button type="button" onClick={() => removeRow(i)} className="cursor-pointer">
                      <Close fill="var(--color-icon-default-muted)" className="size-3.5" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                  <div className="flex w-full flex-col gap-1">
                    <Label className="text-text-muted text-xs font-normal">Percentage</Label>
                    <Input
                      type="number"
                      value={row.percentage}
                      disabled={disabled}
                      onChange={e => updateRow(i, { percentage: e.target.value === "" ? "" : Number(e.target.value) })}
                      className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                      placeholder="0%"
                    />
                  </div>
                  <div className="w-full">
                    <Label className="text-text-muted mb-1 text-xs font-normal">Due Date</Label>
                    <DateRangePicker date={row.dueDate} setDate={date => updateRow(i, { dueDate: date })} />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <Label className="text-text-muted text-xs font-normal">Label (optional)</Label>
                    <Input
                      value={row.label}
                      disabled={disabled}
                      onChange={e => updateRow(i, { label: e.target.value })}
                      className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                      placeholder="e.g. First instalment"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            disabled={disabled || installments.length >= MAX_ROWS}
            onClick={addRow}
            className="bg-bg-state-soft! text-text-subtle hover:bg-bg-state-soft-hover! w-fit text-sm"
          >
            + Add instalment
          </Button>

          {error && <span className="text-text-destructive text-xs">{error}</span>}
        </div>
      )}
    </div>
  );
};
