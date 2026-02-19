import { ColumnDef, Row } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import GraduationCap from "@/components/Icons/GraduationCap";
import { BranchEditRequestTypes } from "./types";

const RenderOptions = ({
  row,
  decision,
  onDecision,
}: {
  row: Row<BranchEditRequestTypes>;
  decision: "accepted" | "rejected" | null;
  onDecision: (id: number, value: "accepted" | "rejected") => void;
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={e => {
          e.stopPropagation();
          onDecision(row.original.editRequestId, "rejected");
        }}
        disabled={decision === "accepted"}
        className={`bg-bg-state-secondary flex h-7 w-20 items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
          decision === "accepted"
            ? "border-border-disabled bg-bg-disabled text-text-disabled cursor-not-allowed! opacity-50"
            : decision === "rejected"
              ? "border-border-default bg-bg-state-secondary text-text-default hover:bg-bg-state-secondary-hover!"
              : "border-border-default bg-bg-state-secondary text-text-default hover:bg-bg-state-secondary!"
        }`}
      >
        <span className="text-text-destructive text-xs font-semibold">✕</span>
        <span>Reject</span>
      </Button>

      <Button
        onClick={e => {
          e.stopPropagation();
          onDecision(row.original.editRequestId, "accepted");
        }}
        disabled={decision === "rejected"}
        className={`bg-bg-state-secondary flex h-7 w-fit items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
          decision === "rejected"
            ? "border-border-disabled bg-bg-disabled text-text-disabled cursor-not-allowed opacity-50"
            : decision === "accepted"
              ? "border-border-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! text-text-default"
              : "border-border-default text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover!"
        }`}
      >
        <span className="text-text-success text-xs font-semibold">✓</span>
        <span>Approve</span>
      </Button>
    </div>
  );
};

export const createManageEditTableColumns = (
  decisions: Record<number, "accepted" | "rejected" | null>,
  onDecision: (id: number, value: "accepted" | "rejected") => void,
): ColumnDef<BranchEditRequestTypes>[] => [
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
        <span className="text-text-default flex cursor-pointer items-center gap-1 text-sm font-normal">
          {row.original.classArmName} {row.original.subjectName}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    accessorKey: "reason",
    header: () => <div className="text-text-muted text-sm font-medium">Reason</div>,
    cell: ({ row }) => <span className="text-text-muted cursor-pointer text-sm font-normal">{row.original.reason}</span>,
    size: 32,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-text-muted text-sm font-medium">Date/Time</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.dateCreated}</span>,
    size: 32,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => <RenderOptions row={row} decision={decisions[row.original.editRequestId] || null} onDecision={onDecision} />,
    size: 200,
  },
];
