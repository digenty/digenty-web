"use client";
import { DeleteBin, Edit, FileCopy } from "@digenty/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";
import { useDeleteFeeGroup } from "@/hooks/queryHooks/useFee";
import { getStatusBadge } from "@/components/Status";
import { FeeGroupProp } from "./feeGroupType";

const RenderOptions = ({ row }: { row: Row<FeeGroupProp> }) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { mutate: deleteFeeGroup, isPending } = useDeleteFeeGroup();

  const handleDelete = () => {
    deleteFeeGroup(row.original.id, {
      onSuccess: () => {
        toast.success("Fee group deleted");
        setShowDelete(false);
      },
      onError: (err: unknown) => {
        toast.error((err as { message?: string })?.message ?? "Failed to delete fee group");
        setShowDelete(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => { e.stopPropagation(); router.push(`/staff/fees/fee-group/${row.original.id}`); }}
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View fee group</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => { e.stopPropagation(); router.push(`/staff/fees/fee-group/${row.original.id}/edit`); }}
          >
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit fee group</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => { e.stopPropagation(); setOpen(false); setShowDelete(true); }}
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete fee group</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={showDelete}
        setOpen={setShowDelete}
        title="Delete Fee Group?"
        ActionButton={
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="hover:bg-bg-state-destructive! bg-bg-state-disabled! text-text-hint! hover:text-text-white-default! h-7!"
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        }
      >
        <div className="px-6 py-4 text-text-subtle text-sm font-medium">
          Are you sure you want to permanently delete this fee group? This action cannot be undone.
        </div>
      </Modal>
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
    accessorKey: "id",
    header: () => <div className="text-text-muted text-sm font-medium"></div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.id}</span>,
  },

  {
    accessorKey: "feeGroupName",
    header: () => <div className="text-text-muted text-sm font-medium">Fee Group Name</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.name}</span>,
    size: 100,
  },

  {
    accessorKey: "feeNames",
    header: () => <div className="text-text-muted text-sm font-medium">Fee</div>,
    cell: ({ row }) => {
      const names = row.original.feeNames ?? [];
      return (
        <div className="flex flex-wrap gap-2">
          {names[0] && <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{names[0]}</Badge>}
          {names[1] && <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{names[1]}</Badge>}
          {names.length > 2 && <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{names.length - 2}</Badge>}
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
