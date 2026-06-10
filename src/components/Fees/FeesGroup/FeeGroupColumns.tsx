"use client";
import { DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon, TriangleAlertIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";

import { useDeleteFeeGroup } from "@/hooks/queryHooks/useFee";
import { FeeGroupProp } from "./feeGroupType";

const RenderOptions = ({ row }: { row: Row<FeeGroupProp> }) => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const router = useRouter();
  const { mutate: deleteFeeGroup, isPending: deleting } = useDeleteFeeGroup();

  const { feeGroupId, name } = row.original;

  const handleDelete = () => {
    deleteFeeGroup(feeGroupId, {
      onSuccess: () => {
        toast.success("Fee group deleted");
        setDeleteOpen(false);
      },
      onError: (error: unknown) => {
        toast.error((error as { message?: string })?.message ?? "Failed to delete fee group");
      },
    });
  };

  return (
    <>
      <Modal
        open={deleteOpen}
        setOpen={open => {
          setDeleteOpen(open);
          if (!open) setUnderstood(false);
        }}
        title="Delete Fee Group?"
        ActionButton={
          <Button
            onClick={handleDelete}
            disabled={!understood || deleting}
            className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-7! rounded-md px-2 py-1 text-sm disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete Fee Group"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          <p className="text-text-subtle text-sm">
            Are you sure you want to permanently delete this fee group? This action cannot be undone.
          </p>

          <div className="bg-bg-badge-warning border-border-warning flex items-start gap-3 rounded-md border p-3">
            <TriangleAlertIcon className="text-icon-warning mt-0.5 size-4 shrink-0" />
            <p className="text-text-default text-sm">
              Deleting this fee group will remove it from your available groups. It won&apos;t be available for future invoices but won&apos;t affect issued invoices.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-2">
            <Checkbox checked={understood} onCheckedChange={v => setUnderstood(!!v)} className="mt-0.5" />
            <span className="text-text-default text-sm">I understand that deleting this fee group is permanent and cannot be undone.</span>
          </label>
        </div>
      </Modal>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={() => {
              setOpen(false);
              router.push(`/staff/fees/fee-group/${feeGroupId}`);
            }}
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View fee group</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={() => {
              setOpen(false);
              router.push(`/staff/fees/add-fee-to-group?id=${feeGroupId}`);
            }}
          >
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit fee group</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2.5 px-3">
            <FileCopy fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Duplicate fee group</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={() => {
              setOpen(false);
              setDeleteOpen(true);
            }}
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete fee group</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const FeeGroupColumn: ColumnDef<FeeGroupProp>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30,
  },

  {
    accessorKey: "name",
    header: () => <div className="text-text-muted text-sm font-medium">Fee Group Name</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.name}</span>,
    size: 100,
  },

  {
    accessorKey: "feeNames",
    header: () => <div className="text-text-muted text-sm font-medium">Fee</div>,
    cell: ({ row }) => {
      const feeNames = row.original.feeNames ?? [];

      if (feeNames.length === 0) return null;

      const visible = feeNames.slice(0, 3);
      const extra = feeNames.length - visible.length;

      return (
        <div className="flex flex-wrap gap-2">
          {visible.map((name, i) => (
            <Badge key={`${name}-${i}`} className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">
              {name}
            </Badge>
          ))}
          {extra > 0 && (
            <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{extra}</Badge>
          )}
        </div>
      );
    },
    size: 300,
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-text-muted text-sm font-medium">Total Amount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">₦{row.original.totalAmount.toLocaleString()}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
