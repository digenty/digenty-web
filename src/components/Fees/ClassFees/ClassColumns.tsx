"use client";
import { DeleteBin } from "@digenty/icons";
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
import { useDeleteFee } from "@/hooks/queryHooks/useFee";
import { ClassFeeTypes } from "./types";

const RenderOptions = ({ row }: { row: Row<ClassFeeTypes> }) => {
  const [open, setOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { mutate: deleteFee, isPending } = useDeleteFee();

  const handleDelete = () => {
    deleteFee(row.original.id, {
      onSuccess: () => {
        toast.success("Class fee deleted");
        setShowDelete(false);
      },
      onError: (err: unknown) => {
        toast.error((err as { message?: string })?.message ?? "Failed to delete class fee");
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
            onClick={e => {
              e.stopPropagation();
              router.push(`/staff/fees/${row.original.id}`);
            }}
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View class fee</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />
          <DropdownMenuItem
            className="gap-2.5 px-3"
            onClick={e => {
              e.stopPropagation();
              setOpen(false);
              setShowDelete(true);
            }}
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete class fee</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={showDelete}
        setOpen={setShowDelete}
        title="Delete Class Fee?"
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
        <div className="text-text-subtle px-6 py-4 text-sm font-medium">
          Are you sure you want to permanently delete this class fee? This action cannot be undone.
        </div>
      </Modal>
    </>
  );
};

export const columnsClassFees: ColumnDef<ClassFeeTypes>[] = [
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
    header: () => <div className="text-text-muted text-sm font-medium">ID</div>,
    cell: ({ row }) => <span className="text-text-default text-sm">{row.original.id}</span>,
  },

  {
    accessorKey: "classname",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default text-sm font-medium">{row.original.classname}</span>,
    size: 100,
  },

  {
    accessorKey: "fee",
    header: () => <div className="text-text-muted text-sm font-medium">Fees</div>,
    cell: ({ row }) => {
      const fee = row.original.fee;
      if (!fee) return null;
      return (
        <div className="flex flex-wrap gap-2">
          {fee.tution && (
            <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{fee.tution}</Badge>
          )}
          {fee.item && (
            <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">{fee.item}</Badge>
          )}
          {fee.count > 0 && (
            <Badge className="bg-bg-badge-default! border-border-default text-text-subtle rounded-md border text-xs font-medium">+{fee.count}</Badge>
          )}
        </div>
      );
    },
    size: 300,
  },

  {
    accessorKey: "totalAmount",
    header: () => <div className="text-text-muted text-sm font-medium">TotalAmount</div>,
    cell: ({ row }) => <div className="text-text-default text-sm font-medium">{row.original.totalAmount}</div>,
    size: 140,
  },

  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <RenderOptions row={row} />,
    size: 60,
  },
];
