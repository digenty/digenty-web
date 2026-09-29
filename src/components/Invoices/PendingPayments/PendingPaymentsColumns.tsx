import { ColumnDef } from "@tanstack/react-table";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageInvoices } from "@/lib/permissions/invoices";
import { PendingPaymentEntry } from "@/api/invoice";
import { getPaymentMethodIcon } from "@/components/Invoices/InvoiceId/InvoiceIdColumns";
import { formatDate } from "@/lib/utils";

const methodLabels: Record<string, string> = {
  BANK_TRANSFER: "Bank Transfer",
  BANK_TRANSFER_TERMINAL: "Bank Transfer Terminal",
  CASH: "Cash",
  POS: "POS",
  CHEQUE: "Cheque",
  ONLINE: "Online",
};

export const getPendingPaymentsColumns = (
  onApprove: (payment: PendingPaymentEntry) => void,
  onReject: (payment: PendingPaymentEntry) => void,
): ColumnDef<PendingPaymentEntry>[] => [
  {
    accessorKey: "studentName",
    header: () => <div className="text-text-muted text-sm font-medium">Student</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-6" url={row.original.studentAvatar ?? undefined} />
        <div className="flex flex-col">
          <span className="text-text-default text-sm font-medium">{row.original.studentName}</span>
          <span className="text-text-muted text-xs">{row.original.invoiceNumber}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-text-muted text-sm font-medium">Amount</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">₦{row.original.amount.toLocaleString()}</span>,
  },
  {
    accessorKey: "method",
    header: () => <div className="text-text-muted text-sm font-medium">Method</div>,
    cell: ({ row }) => (
      <span className="text-text-muted flex items-center gap-1 text-sm font-normal">
        {getPaymentMethodIcon(methodLabels[row.original.method] ?? row.original.method)}
        {methodLabels[row.original.method] ?? row.original.method}
      </span>
    ),
  },
  {
    accessorKey: "submittedAt",
    header: () => <div className="text-text-muted text-sm font-medium">Submitted</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-normal">{formatDate(row.original.submittedAt)}</span>,
  },
  {
    accessorKey: "proofUrl",
    header: () => <div className="text-text-muted text-sm font-medium">Proof</div>,
    cell: ({ row }) =>
      row.original.proofUrl ? (
        <a
          href={row.original.proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-text-informative text-sm font-medium underline"
        >
          View proof
        </a>
      ) : (
        <span className="text-text-muted text-sm">—</span>
      ),
  },
  {
    id: "actions",
    header: () => <div />,
    cell: ({ row }) => (
      <PermissionCheck permissionUtility={canManageInvoices}>
        <div className="flex items-center gap-2">
          <Button
            onClick={e => {
              e.stopPropagation();
              onApprove(row.original);
            }}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! rounded-md px-2.5 py-1 text-sm"
          >
            Approve
          </Button>
          <Button
            onClick={e => {
              e.stopPropagation();
              onReject(row.original);
            }}
            className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-7! rounded-md px-2.5 py-1 text-sm"
          >
            Reject
          </Button>
        </div>
      </PermissionCheck>
    ),
  },
];
