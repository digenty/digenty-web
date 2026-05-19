import { GraduationCap, Message3 } from "@digenty/icons";
import { ColumnDef, Row } from "@tanstack/react-table";

import { EditRequestResponseTypes } from "@/api/types";
import { Avatar } from "@/components/Avatar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRelativeDate } from "@/lib/utils";

const RenderOptions = ({
  row,
  openModal,
}: {
  row: Row<EditRequestResponseTypes>;
  openModal: (request: EditRequestResponseTypes, action: "accepted" | "rejected") => void;
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={e => {
          e.stopPropagation();
          openModal(row.original, "rejected");
        }}
        className="bg-bg-state-secondary border-border-default flex h-7 w-20 items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors"
      >
        <span className="text-text-destructive text-xs font-semibold">✕</span>
        <span className="text-text-default">Reject</span>
      </Button>

      <Button
        onClick={e => {
          e.stopPropagation();
          openModal(row.original, "accepted");
        }}
        className="bg-bg-state-secondary border-border-default flex h-7 w-fit items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors"
      >
        <span className="text-text-success text-xs font-semibold">✓</span>
        <span className="text-text-default">Approve</span>
      </Button>
    </div>
  );
};

export const createManageEditTableColumns = (
  requestStatus: Record<number, "accepted" | "rejected" | null>,
  openModal: (request: EditRequestResponseTypes, action: "accepted" | "rejected") => void,
): ColumnDef<EditRequestResponseTypes>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value: boolean) => row.toggleSelected(!!value)} aria-label="Select row" />
      </div>
    ),
    size: 26,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "staffName",
    header: () => <div className="text-text-muted text-sm font-medium">Staff Name</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm font-medium">{row.original.teacherName}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "requestedFor",
    header: () => <div className="text-text-muted text-sm font-medium">Requested For</div>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <GraduationCap fill="var(--color-icon-default-muted)" className="size-4" />
        <span className="text-text-default flex cursor-pointer items-center gap-1 text-sm font-normal capitalize">
          {row.original.classArmName} {row.original.subjectName ? row.original.subjectName.toLowerCase() : ""}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "reason",
    header: () => <div className="text-text-muted text-sm font-medium">Reason</div>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-text-default w-40 cursor-pointer truncate text-sm font-medium">{row.original.reason}</span>
        <div className="flex items-center gap-2">
          <Message3 fill="var(--color-icon-default-muted)" className="size-4" />
          <span className="text-text-muted w-40 cursor-pointer truncate text-xs font-normal">{row.original.additionalDetails || "None"}</span>
        </div>
      </div>
    ),
    size: 32,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date/Time</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-normal">
        {row.original.dateCreated ? formatRelativeDate(new Date(row.original.dateCreated)) : "--"}
      </span>
    ),
    size: 32,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => <RenderOptions row={row} openModal={openModal} />,
    size: 200,
  },
];
