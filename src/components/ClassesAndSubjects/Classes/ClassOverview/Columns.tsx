"use client";

import Eye from "@/components/Icons/Eye";
import Notification2 from "@/components/Icons/Notification2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClassesStore } from "@/store/classes";
import { ColumnDef, Row } from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { Subject } from ".";
import { Avatar } from "../../../Avatar";

const RenderActions = (row: Row<Subject>) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenNotifyTeacher } = useClassesStore();

  return (
    <div className="flex justify-end gap-4">
      <Button
        className="border-border-darker bg-bg-state-secondary text-text-default h-6! rounded-md border px-1.5! font-medium"
        onClick={() => setOpenNotifyTeacher(true)}
      >
        <Notification2 fill="var(--color-icon-default-muted)" className="size-4" />
        <span className="text-xs">Notify Teacher</span>
      </Button>

      <Button
        className="border-border-darker bg-bg-state-secondary text-text-default h-6! rounded-md border px-1.5! font-medium"
        onClick={() => router.push(`${pathname}/subjects/${row.original.id}`)}
      >
        <Eye fill="var(--color-icon-default-muted)" className="size-4" />
        <span className="text-xs">View</span>
      </Button>
    </div>
  );
};

export const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subjectName",
    header: () => <div className="text-text-muted text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-normal">{row.original.subjectName}</span>,
    size: 600,
  },
  {
    accessorKey: "subjectTeacherName",
    header: () => <div className="text-text-muted text-sm font-medium">Teacher</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url="" />
          <span className="text-text-default cursor-pointer pl-0 text-sm">{row.original.subjectTeacherName}</span>
        </div>
      </div>
    ),
    size: 400,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-4 lg:pr-10">
        <span
          className={cn(
            "border-border-default rounded-md border px-2 py-0.5 text-xs",
            row.original.status === "SUBMITTED"
              ? "bg-bg-badge-green text-bg-basic-green-strong"
              : row.original.status === "IN PROGRESS"
                ? "bg-bg-badge-orange text-bg-basic-orange-strong"
                : "bg-bg-badge-default text-text-subtle",
          )}
        >
          {row.original.status}
        </span>
      </div>
    ),
    size: 400,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderActions(row),
  },
];
