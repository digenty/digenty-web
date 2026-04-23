import { Avatar } from "@/components/Avatar";
import AlertFill from "@/components/Icons/AlertFill";
import { Bank } from "@/components/Icons/Bank";
import BankCard from "@/components/Icons/BankCard";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import Download2 from "@/components/Icons/Download2";
import { FileCopy } from "@/components/Icons/FileCopy";
import { LogoMark } from "@/components/Icons/LogoMark";
import { OverviewCard } from "@/components/OverviewCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

const mockFees = [
  {
    id: 1,
    title: "Tuition",
    paid: 50000,
    amount: 150000,
    balance: 75000,
  },
  {
    id: 2,
    title: "Tuition",
    paid: 75000,
    amount: 150000,
    balance: 75000,
  },
];
const optionalFeesMock = [
  {
    id: 1,
    title: "Tuition",
    paid: 50000,
    amount: 150000,
    balance: 75000,
  },
  {
    id: 2,
    title: "Tuition",
    paid: 75000,
    amount: 150000,
    balance: 75000,
  },
];

export const FeesBreakdown = () => {
  const [openId, setOpenId] = useState<number | null>(null);

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
          value="₦200,280"
        />
        <OverviewCard
          title="Total Paid"
          Icon={() => (
            <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦50,000"
        />
        <OverviewCard
          title="students"
          Icon={() => (
            <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="₦50,000"
          className="col-span-2 md:col-span-1"
        />
      </div>

      <div className="">
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
                    <Avatar className="size-4" />
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
                  <span className="text-text-muted text-sm font-normal">First Term</span>
                </div>
                <div className="mt-0.5 flex items-center justify-between">
                  <span className="text-text-muted text-sm font-normal">GFA/2023/01045</span>
                  <span className="text-text-default text-sm font-medium">(2025/2026)</span>
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

            <div className="flex flex-col">
              {mockFees.map(fee => {
                const progressPercentage = Math.min((fee.paid / fee.amount) * 100, 100);
                return (
                  <div key={fee.id} className="border-border-default flex w-full flex-col gap-3 rounded-sm border p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-text-default text-sm">{fee.title}</div>
                      <div className="text-text-default text-sm">₦{fee.amount.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-text-default text-sm">₦{fee.paid.toLocaleString()}</div>
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
            </div>

            <div className="border-border-default flex items-center justify-between border-b pb-5">
              <div className="text-text-informative text-sm font-medium">Total Required Balance</div>
              <div className="text-text-default text-sm font-semibold">₦50,000</div>
            </div>

            <div className="text-text-default text-sm font-semibold">Optional Fees</div>

            <div className="flex flex-col gap-2">
              {optionalFeesMock.map(fee => {
                const progressPercentage = Math.min((fee.paid / fee.amount) * 100, 100);
                const isOpen = openId === fee.id;

                return (
                  <div
                    key={fee.id}
                    className="border-border-default flex w-full cursor-pointer flex-col gap-3 rounded-sm border p-4"
                    onClick={() => setOpenId(isOpen ? null : fee.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-text-default text-sm">{fee.title}</div>
                      <div className="text-text-default text-sm">₦{fee.amount.toLocaleString()}</div>
                    </div>

                    {isOpen && (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="text-text-default text-sm">₦{fee.paid.toLocaleString()}</div>
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
            </div>

            <div className="border-border-default flex items-center justify-between border-b pb-5">
              <div className="text-text-informative text-sm font-medium">Total Optional Balance</div>
              <div className="text-text-default text-sm font-semibold">₦50,000</div>
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
      </div>
    </div>
  );
};
