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
import { useDeleteFeeItem } from "@/hooks/queryHooks/useFee";
import { FeeItemProp } from "./feeItemType";
import { getStatusBadge } from "@/components/Status";

const RenderOptions = ({ row }: { row: Row<FeeItemProp> }) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { mutate: deleteFeeItem, isPending } = useDeleteFeeItem();

  const handleDelete = () => {
    deleteFeeItem(row.original.id, {
      onSuccess: () => {
        toast.success("Fee item deleted");
        setShowDelete(false);
      },
      onError: (err: unknown) => {
        toast.error((err as { message?: string })?.message ?? "Failed to delete fee item");
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
            onClick={e => { e.stopPropagation(); router.push(`/staff/fees/fee-item/${row.original.id}`); }}
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View fee item</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => { e.stopPropagation(); router.push(`/staff/fees/fee-item/${row.original.id}`); }}
          >
            <Edit fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Edit fee item</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => { e.stopPropagation(); setOpen(false); setShowDelete(true); }}
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete fee item</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={showDelete}
        setOpen={setShowDelete}
        title="Delete Fee Item?"
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
          Are you sure you want to permanently delete this fee item? This action cannot be undone.
        </div>
      </Modal>
    </>
  );
};

export const FeeItemsColumns: ColumnDef<FeeItemProp>[] = [
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
    accessorKey: "feeName",
    header: () => <div className="text-text-muted text-sm font-medium">Fee Name</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.feeName}</span>,
    size: 100,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium"></div>,
    cell: ({ row }) => <span className="">{getStatusBadge(row.original.status)}</span>,
  },

  {
    accessorKey: "applyTo",
    header: () => <div className="text-text-muted text-sm font-medium">Apply To</div>,
    cell: ({ row }) => {
      const item = row.original.applyTo;
      if (!item) return null;
      return (
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{item.school}</Badge>
          <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{item.count}</Badge>
        </div>
      );
    },
    size: 300,
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-text-muted text-sm font-medium">TotalAmount</div>,
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
