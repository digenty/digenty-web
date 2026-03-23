"use client ";

import { Avatar } from "@/components/Avatar";
import { CheckboxCircle } from "@/components/Icons/CheckboxCircle";
import Eye from "@/components/Icons/Eye";
import { Key } from "@/components/Icons/Key";
import { Notification } from "@/components/Icons/Notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApproveModal, EditModal, NotifyTeacherModal } from "./AllClasses/AllClassesModal";
import { AllClassesMainTableProps, ClassProps } from "./types";

const RenderOptions = (row: Row<AllClassesMainTableProps>, branchId: number) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [openNotifyModal, setOpenNotifyModal] = useState(false);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  return (
    <>
      {openNotifyModal && <NotifyTeacherModal openNotifyModal={openNotifyModal} setOpenNotifyModal={setOpenNotifyModal} />}
      {openApproveModal && <ApproveModal openApproveModal={openApproveModal} setOpenApproveModal={setOpenApproveModal} />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger onClick={evt => evt.stopPropagation()} className="cursor-pointer focus-visible:ring-0 focus-visible:outline-none">
          <MoreHorizontalIcon className="text-icon-default-muted size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
          <DropdownMenuItem
            className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3"
            onClick={() =>
              router.push(
                `/classes-and-subjects/all-classes/${row.original.classId}/arm/${row.original.armId}?classArmName=${row.original.classArmName.replaceAll(" ", "-")}`,
              )
            }
          >
            <Eye fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>View class</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={row.original.status === "NOT_SUBMITTED"}
            className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3"
            onClick={() => setOpenApproveModal(true)}
          >
            <CheckboxCircle fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Approve submission</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3" onClick={() => setOpenNotifyModal(true)}>
            <Notification fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Notify class teacher</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/classes-and-subjects/all-branches/${branchId}/manage-edits`)}
            className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3"
          >
            <Key fill="var(--color-icon-default-subtle)" className="size-4" />
            <span className="">Manage edit requests</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const RenderActions = (row: Row<ClassProps>, armId: number, classId: number, classArmName: string) => {
  const router = useRouter();
  const [openNotifyMobile, setOpenNotifyMobile] = useState(false);
  const [openEditMobile, setOpenEditMobile] = useState(false);
  return (
    <>
      {openNotifyMobile && <NotifyTeacherModal openNotifyModal={openNotifyMobile} setOpenNotifyModal={setOpenNotifyMobile} />}
      {openEditMobile && (
        <EditModal openEditRequestModal={openEditMobile} setEditRequestModal={setOpenEditMobile} subjectId={row.original.subjectId} armId={armId} />
      )}

      <div className="flex items-center gap-1">
        <Button
          onClick={() => setOpenEditMobile(true)}
          className="bg-bg-state-secondary border-border-default text-text-default flex h-6 items-center gap-1 rounded-md border px-1.5! text-xs font-medium"
        >
          <Key fill="var(--color-icon-default-muted)" className="size-4" />
          Manage Edit Request
        </Button>
        <Button
          onClick={() => setOpenNotifyMobile(true)}
          className="bg-bg-state-secondary border-border-default text-text-default flex h-6 items-center gap-1 rounded-md border px-1.5! text-xs font-medium"
        >
          <Notification fill="var(--color-icon-default-muted)" className="size-4" />
          Notify Teacher
        </Button>
        <Button
          onClick={() =>
            router.push(
              `/classes-and-subjects/subjects/${row.original.subjectId}/classes/${classId}/arms/${armId}/view-score?classArmName=${classArmName.replaceAll(" ", "-")}&subjectName=${row.original.subjectName.replaceAll(" ", "-")}`,
            )
          }
          className="bg-bg-state-secondary border-border-default text-text-default flex h-6 items-center gap-1 rounded-md border px-1.5! text-xs font-medium"
        >
          <Eye fill="var(--color-icon-default-muted)" /> View
        </Button>
      </div>
    </>
  );
};

//  Table for AllClass
export const AllClassessTableMainColumns = (branchId: number): ColumnDef<AllClassesMainTableProps>[] => [
  {
    accessorKey: "class",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.classArmName}</span>,
  },
  {
    accessorKey: "classTeacher",
    header: () => <div className="text-text-muted text-sm font-medium">Class Teacher</div>,
    cell: ({ row }) => (
      <div className="items center flex gap-2">
        <Avatar className="size-5" />
        <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.classTeacherName}</span>{" "}
      </div>
    ),
  },
  {
    accessorKey: "subjectSheet",
    header: () => <div className="text-text-muted text-sm font-medium">Subject Sheet</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-medium">
        {row.original.numberOfSubmittedSubjects}/{row.original.numberOfSubjects}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      const statusStyles: Record<AllClassesMainTableProps["status"], string> = {
        APPROVED: "bg-bg-badge-green text-bg-basic-green-strong ",
        PENDING_APPROVAL: "bg-bg-badge-orange text-bg-basic-orange-strong ",
        NOT_SUBMITTED: "bg-bg-badge-red text-bg-basic-red-strong ",
        EDIT_REQUEST: "bg-bg-badge-lime text-bg-basic-lime-strong ",
      };

      return (
        <Badge
          className={`border-border-default h-4 rounded-md border px-1 py-2 text-xs font-medium capitalize ${statusStyles[status || "NOT_SUBMITTED"]} `}
        >
          {status ? status.replaceAll("_", " ").toLowerCase() : "not submitted"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "editRequest",
    header: () => <div className="text-text-muted text-sm font-medium">Edit Requests</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.numberOfEditRequest}</span>,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row, branchId),
    size: 11,
  },
];

//  Table for Class
export const ClassTableColumns = (armId: number, classId: number, classArmName: string): ColumnDef<ClassProps>[] => [
  {
    accessorKey: "subjectName",
    header: () => <div className="text-text-muted text-sm font-medium">Subject</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm capitalize">
        {row.original.subjectName ? row.original.subjectName.toLowerCase() : ""}
      </span>
    ),
    size: 252,
  },
  {
    accessorKey: "subjectTeacherName",
    header: () => <div className="text-text-muted text-sm font-medium">Teacher</div>,
    cell: ({ row }) => (
      <div className="items center flex gap-2">
        <Avatar className="size-5" />
        <span className="text-text-default cursor-pointer text-sm">{row.original.subjectTeacherName || "--"}</span>{" "}
      </div>
    ),
    size: 252,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => {
      const statusStyles = {
        SUBMITTED: "bg-bg-badge-green text-bg-basic-green-strong ",
        IN_PROGRESS: "bg-bg-badge-orange text-bg-basic-orange-strong ",
        NOT_SUBMITTED: "bg-bg-badge-red text-bg-basic-red-strong ",
        REQUESTED_EDIT_ACCESS: "bg-bg-badge-lime text-bg-basic-lime-strong ",
      };

      return (
        <Badge
          className={`border-border-default w-auto rounded-md border px-1 py-0.5 text-xs font-medium capitalize ${
            statusStyles[row.original.status || "NOT_SUBMITTED"]
          }`}
        >
          {row.original.status ? row.original.status.replaceAll("_", " ").toLowerCase() : "not submitted"}
        </Badge>
      );
    },
    size: 252,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderActions(row, armId, classId, classArmName),
  },
];
