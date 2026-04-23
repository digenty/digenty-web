"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Information from "@/components/Icons/Information";
import { Fee } from "./types";
import { StudentFilter } from "@/parentComponents/FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

const requiredFeesMock: Fee[] = [
  { id: 1, title: "Tuition", paid: 75000, amount: 150000, balance: 75000, minimumDeposit: 50000 },
  { id: 2, title: "Tuition", paid: 75000, amount: 180000, balance: 75000 },
  { id: 3, title: "Tuition", paid: 0, amount: 150000, balance: 150000 },
];

const optionalFeesMock: Fee[] = [
  { id: 4, title: "Tuition", paid: 0, amount: 150000, balance: 150000 },
  { id: 5, title: "Tuition", paid: 0, amount: 150000, balance: 150000 },
  { id: 6, title: "Development Fee", paid: 0, amount: 12000, balance: 12000 },
];
const filterValues = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
const ProgressBar = ({ paid, amount }: { paid: number; amount: number }) => {
  const progressPercentage = Math.min((paid / amount) * 100, 100);
  return (
    <div className="bg-border-default relative h-1 w-full overflow-hidden rounded-full">
      <div className="bg-bg-basic-green-accent h-full transition-all duration-500 ease-in-out" style={{ width: `${progressPercentage}%` }} />
    </div>
  );
};

const RequiredFeeItem = ({ fee, checked, onCheck }: { fee: Fee; checked: boolean; onCheck: (id: number) => void }) => {
  const [amountToPay, setAmountToPay] = useState("");
  const payingNow = parseFloat(amountToPay) || 0;
  const amountAfterPayment = fee.balance - payingNow;

  const handlePayFull = () => {
    setAmountToPay(fee.balance.toString());
  };

  return (
    <div className="border-border-default flex w-full flex-col gap-3 rounded-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={() => onCheck(fee.id)} className="rounded-sm" />
          <p className="text-text-default text-sm">{fee.title}</p>
        </div>
        <p className="text-text-default text-sm font-medium">₦{fee.amount.toLocaleString()}</p>
      </div>

      {fee.paid > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-text-subtle text-sm font-medium">Paid: ₦{fee.paid.toLocaleString()}</p>
            <p className="text-text-muted text-sm">Balance: ₦{fee.balance.toLocaleString()}</p>
          </div>
          <ProgressBar paid={fee.paid} amount={fee.amount} />
        </>
      )}

      {checked && (
        <div className="flex flex-col gap-2">
          <p className="text-text-default text-sm font-medium">Amount to Pay</p>
          <div className="flex items-center gap-2">
            <div className="bg-bg-input-soft! flex h-8 flex-1 items-center gap-1 rounded-md px-3 py-2">
              <span className="text-text-muted text-sm">₦</span>
              <Input
                type="number"
                value={amountToPay}
                onChange={e => setAmountToPay(e.target.value)}
                placeholder="0.00"
                className="text-text-default h-5 border-none! bg-none p-0 text-sm"
              />
            </div>
            <Button size="sm" onClick={handlePayFull} className="bg-bg-input-soft text-text-subtle hover:bg-bg-input-soft text-sm font-medium">
              Pay Full
            </Button>
          </div>
          {fee.minimumDeposit && <p className="text-text-muted text-xs">Minimum deposit: ₦{fee.minimumDeposit.toLocaleString()}</p>}
          <div className="border-border-default rounded-md border">
            <div className="border-border-default flex items-center justify-between border-b p-4">
              <p className="text-text-default text-sm">Paying now</p>
              <p className="text-text-default text-sm">₦{payingNow.toLocaleString()}</p>
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

const OptionalFeeItem = ({ fee, checked, onCheck }: { fee: Fee; checked: boolean; onCheck: (id: number) => void }) => (
  <div className="border-border-default flex w-full items-center justify-between rounded-sm border p-4">
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} onCheckedChange={() => onCheck(fee.id)} className="rounded-sm" />
      <p className="text-text-default text-sm">{fee.title}</p>
    </div>
    <p className="text-text-default text-sm">₦{fee.amount.toLocaleString()}</p>
  </div>
);

export const PayInvoice = () => {
  const [selected, setSelected] = useState(filterValues[0]);
  const [checkedRequired, setCheckedRequired] = useState<Set<number>>(new Set([1]));
  const [checkedOptional, setCheckedOptional] = useState<Set<number>>(new Set());

  const toggleRequired = (id: number) => {
    setCheckedRequired(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleOptional = (id: number) => {
    setCheckedOptional(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectedRequired = requiredFeesMock.filter(f => checkedRequired.has(f.id));
  const selectedOptional = optionalFeesMock.filter(f => checkedOptional.has(f.id));
  const allSelected = [...selectedRequired, ...selectedOptional];
  const totalCost = allSelected.reduce((sum, f) => sum + f.amount, 0);
  const totalBalance = requiredFeesMock.reduce((sum, f) => sum + f.balance, 0);

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Fees</div>
          <div className="text-text-muted text-xs">Manage and view your child&apos;s school fees, payment history, and invoices.</div>
        </div>
        <StudentFilter />
      </div>
      <div className="flex items-center justify-between">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="border-border-darker h-8! w-auto border">
            <SelectValue className="text-text-default flex font-medium">
              <Calendar className="text-icon-black-muted size-4" />
              <p className="text-text-default text-sm">{selected}</p>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            <SelectItem className="text-text-default" value="24/25 Third Term">
              24/25 Third Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 Second Term">
              24/25 Second Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 First Term">
              24/25 First Term
            </SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-full">Pay Online</Button>
      </div>
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-border-default flex flex-col gap-3 rounded-md border p-4">
            <p className="text-text-default text-sm font-semibold">Required Fees</p>
            <div className="flex flex-col gap-2">
              {requiredFeesMock.map(fee => (
                <RequiredFeeItem key={fee.id} fee={fee} checked={checkedRequired.has(fee.id)} onCheck={toggleRequired} />
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-text-default text-sm font-medium">Total Balance Required</p>
              <p className="text-text-success text-sm font-semibold">₦{totalBalance.toLocaleString()}</p>
            </div>
          </div>

          <div className="border-border-default flex flex-col gap-3 rounded-md border p-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-text-default text-md font-semibold">+ Add Optional Fees</p>
              <p className="text-text-subtle text-xs">Select any optional fees you&apos;d like to pay now</p>
            </div>
            <div className="flex flex-col gap-2">
              {optionalFeesMock.map(fee => (
                <OptionalFeeItem key={fee.id} fee={fee} checked={checkedOptional.has(fee.id)} onCheck={toggleOptional} />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg-subtle border-border-default rounded-md border p-1">
          <div className="border-border-default bg-bg-card flex w-full flex-col gap-4 rounded-md border p-4 md:w-91">
            <p className="text-text-default text-sm font-semibold">Summary</p>

            <div className="flex flex-col gap-3">
              {allSelected.map(fee => (
                <div key={fee.id} className="flex items-center justify-between">
                  <p className="text-text-subtle text-sm">{fee.title}</p>
                  <p className="text-text-default text-sm font-medium">₦{fee.amount.toLocaleString()}</p>
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

                <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full">
                  Pay ₦{totalCost.toLocaleString()}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
