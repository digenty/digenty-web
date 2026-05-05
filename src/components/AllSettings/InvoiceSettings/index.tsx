"use client";

import { Edit } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetInvoiceSettings } from "@/hooks/queryHooks/useInvoice";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";

const Row = ({ label, value }: { label: string; value?: string | number | boolean }) => (
  <div className="border-border-default flex items-center justify-between border-b py-3">
    <span className="text-text-subtle text-sm">{label}</span>
    <span className="text-text-default text-sm font-medium">{String(value ?? "—")}</span>
  </div>
);

export const InvoiceSetting = () => {
  const router = useRouter();
  const { branchIds } = useLoggedInUser();
  const branchId = branchIds?.[0];
  const { data: settings, isPending } = useGetInvoiceSettings(branchId);

  return (
    <div className="mx-auto my-6 flex w-full max-w-171 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-text-default text-lg font-semibold">Invoice Settings</div>
          <Button
            onClick={() => router.push("/staff/settings/invoice/edit")}
            className="bg-bg-state-secondary! border-border-darker text-text-default rounded-md border"
          >
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        </div>

        {isPending ? (
          <Skeleton className="bg-bg-input-soft h-96 w-full" />
        ) : (
          <>
            {/* School Logo */}
            <div>
              <div className="text-text-default mb-3 text-sm font-medium">School Logo</div>
              <div className="border-border-default border-b pb-4">
                <Avatar className="size-10" url={settings?.schoolLogoUrl ?? undefined} />
              </div>
            </div>

            {/* Invoice Numbering */}
            <div className="text-text-default text-lg font-semibold">Invoice Numbering</div>
            <div className="border-border-default rounded-md border px-4">
              <Row label="Invoice Prefix" value={settings?.invoicePrefix} />
              <Row label="Number Format" value={settings?.numberFormat} />
              <Row label="Starting Number" value={settings?.startingNumber} />
              <Row label="Padding" value={settings?.padding ? `${settings.padding} Digits` : undefined} />
            </div>

            {settings?.nextInvoiceNumber && (
              <div className="border-border-default bg-bg-basic-blue-subtle flex w-full items-center gap-2 rounded-md border px-3 py-2.5">
                <div className="bg-bg-basic-blue-accent border-border-default h-6 w-1 border-2" />
                <div className="text-text-subtle text-sm">Next Invoice Number: {settings.nextInvoiceNumber}</div>
              </div>
            )}

            {/* Basic Settings */}
            <div className="text-text-default text-lg font-semibold">Basic Settings</div>
            <div className="border-border-default rounded-md border px-4">
              <Row label="Default Due Date" value={settings?.defaultDueDate} />
              <Row label="Default Invoice Note" value={settings?.defaultNote} />
            </div>

            {/* Reminders */}
            <div className="text-text-default text-lg font-semibold">Invoice Reminders</div>
            <div className="border-border-default rounded-md border px-4">
              <Row label="Remind Before Due Date" value={settings?.remindBeforeDays !== undefined ? `${settings.remindBeforeDays} Days` : undefined} />
              <Row label="Remind After Due Date" value={settings?.remindAfterDays !== undefined ? `${settings.remindAfterDays} Days` : undefined} />
              <Row label="Repeat Reminders" value={settings?.repeatReminders ? "Yes" : "No"} />
              {settings?.repeatReminders && <Row label="Repeat Every" value={settings?.repeatEveryDays !== undefined ? `${settings.repeatEveryDays} Days` : undefined} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
