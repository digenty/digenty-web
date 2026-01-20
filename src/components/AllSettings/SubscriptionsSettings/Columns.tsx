import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionHistoryProps, SubscriptionPlanProps } from "./type";
import { Badge } from "@/components/ui/badge";
import { Check } from "@/components/Icons/Check";
import { Button } from "@/components/ui/button";
import { paymentStatus } from "@/components/Status";
import Eye from "@/components/Icons/Eye";
import Download2 from "@/components/Icons/Download2";

const renderFeatureValue = (value: boolean | string) => {
  if (value === true) {
    return (
      <span className="text-text-default flex items-center gap-2 text-sm">
        {" "}
        <Check fill="var(--color-icon-default)" /> Included
      </span>
    );
  }

  if (value === false) {
    return <span className="text-text-default">x</span>;
  }

  return (
    <>{value === "Unlimited" && <Badge className="text-text-subtle bg-bg-badge-default border-border-default rounded-md border">Unlimited</Badge>} </>
  );
};

export const SubscriptionColumns: ColumnDef<SubscriptionPlanProps>[] = [
  {
    accessorKey: "feature",
    header: () => <div className="w-52!"></div>,
    cell: ({ row }) => (
      <div className="text-text-default block w-52 overflow-hidden p-4 text-sm font-medium text-ellipsis whitespace-normal">
        {row.original.feature}
      </div>
    ),
  },

  {
    accessorKey: "freemium",
    header: () => (
      <div className="flex w-52! flex-col justify-between gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Freemium</div>
          <div className="flex items-center gap-1">
            <div className="text-text-default text-md font-medium">₦0</div>
            <div className="text-text-muted text-xs">per student/ one term trial</div>
          </div>
        </div>
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-fit rounded-md text-sm font-medium">
          Start Trial
        </Button>
      </div>
    ),
    cell: ({ row }) => renderFeatureValue(row.original.freemium),
  },

  {
    accessorKey: "standard",
    header: () => (
      <div className="flex w-52! flex-col justify-between gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-sm font-medium">Standard</div>
          <div className="flex items-center gap-1">
            <div className="text-text-default text-md font-medium">₦300</div>
            <div className="text-text-muted text-xs">per student</div>
          </div>
        </div>
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-fit rounded-md text-sm font-medium">
          Subscribe
        </Button>
      </div>
    ),
    cell: ({ row }) => renderFeatureValue(row.original.standard),
  },
  {
    accessorKey: "advanced",
    header: () => (
      <div className="flex w-52! flex-col justify-between gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-text-default text-sm font-medium">Advanced</div>
            <Badge className="border-border-default bg-bg-badge-lime text-bg-basic-lime-strong rounded-md border">Coming Soon</Badge>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-text-default text-md font-medium">₦500</div>
            <div className="text-text-muted text-xs">per student</div>
          </div>
        </div>
        <Button className="bg-bg-state-disabled text-text-hint w-fit rounded-md text-sm font-medium">Subscribe</Button>
      </div>
    ),
    cell: ({ row }) => renderFeatureValue(row.original.advanced),
  },
  {
    accessorKey: "premium",
    header: () => (
      <div className="flex w-52! flex-col justify-between gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-text-default text-sm font-medium">Premium</div>
            <Badge className="border-border-default bg-bg-badge-lime text-bg-basic-lime-strong rounded-md border">Coming Soon</Badge>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-text-default text-md font-medium">₦800</div>
            <div className="text-text-muted text-xs">per student</div>
          </div>
        </div>
        <Button className="bg-bg-state-disabled text-text-hint w-fit rounded-md text-sm font-medium">Subscribe</Button>
      </div>
    ),
    cell: ({ row }) => renderFeatureValue(row.original.premium),
  },
];

export const SubscriptionHistoryColumns: ColumnDef<SubscriptionHistoryProps>[] = [
  {
    accessorKey: "period",
    header: () => <div className="text-text-muted text-sm font-medium">Period</div>,
    cell: ({ row }) => <div className="text-text-default font-medium">{row.original.period}</div>,
  },
  {
    accessorKey: "plan",
    header: () => <div className="text-text-muted text-sm font-medium">Plan</div>,
    cell: ({ row }) => <div className="text-text-default font-normal">{row.original.plan}</div>,
  },

  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => <div className="text-text-default font-medium">{paymentStatus(row.original.status)}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <div className="text-text-default font-medium">{row.original.amount.toLocaleString()}</div>,
  },
  {
    accessorKey: "actions",
    header: () => <div></div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-6">
        <Eye fill="var(--color-icon-default-muted)" />
        <Download2 fill="var(--color-icon-default-muted)" />
      </div>
    ),
  },
];
