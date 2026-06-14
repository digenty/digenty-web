"use client";
import { DeleteBin } from "@digenty/icons";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontalIcon, TriangleAlertIcon } from "lucide-react";
import { ClassFeeTypes } from "./classTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { useRouter } from "next/navigation";
import { useDeleteFee } from "@/hooks/queryHooks/useFee";
import { toast } from "sonner";

const RenderOptions = ({ row }: { row: Row<ClassFeeTypes> }) => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const { mutate: deleteFee, isPending: deleting } = useDeleteFee();

  const { id, classname } = row.original;

  const handleDelete = () => {
    deleteFee(id, {
      onSuccess: () => {
        toast.success("Class fee deleted");
        setDeleteOpen(false);
      },
      onError: (error: unknown) => toast.error((error as { message?: string })?.message ?? "Failed to delete class fee"),
    });
  };

  return (
    <>
      <Modal
        open={deleteOpen}
        setOpen={setDeleteOpen}
        title="Delete Class Fee?"
        ActionButton={
          <Button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default h-7! rounded-md px-2 py-1 text-sm disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete Class Fee"}
          </Button>
        }
      >
        <div className="flex flex-col gap-4 px-4 py-4">
          <p className="text-text-subtle text-sm">
            Are you sure you want to delete the fee for <span className="text-text-default font-medium">{classname}</span>? This action cannot be
            undone.
          </p>
          <div className="bg-bg-badge-warning border-border-warning flex items-start gap-3 rounded-md border p-3">
            <TriangleAlertIcon className="text-icon-warning mt-0.5 size-4 shrink-0" />
            <p className="text-text-default text-sm">
              Deleting this class fee will remove all associated fee configurations. Issued invoices won&apos;t be affected.
            </p>
          </div>
        </div>
      </Modal>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem
            onClick={evt => { evt.stopPropagation(); router.push(`/staff/fees/${id}`); }}
            className="gap-2.5 px-3"
          >
            <EyeIcon className="text-icon-default-subtle size-4" />
            <span>View class fee</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border-border-default bg-border-default" />
          <DropdownMenuItem
            onClick={evt => { evt.stopPropagation(); setOpen(false); setDeleteOpen(true); }}
            className="gap-2.5 px-3"
          >
            <DeleteBin fill="var(--color-icon-destructive)" className="size-4" />
            <span className="text-icon-destructive">Delete class fee</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
    accessorKey: "feeNames",
    header: () => <div className="text-text-muted text-sm font-medium">Fees</div>,
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
