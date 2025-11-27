"use client ";

import { ColumnDef, Row } from "@tanstack/react-table";
import { AllClassesMainTableProps, ClassProps } from "./types";
import { DropdownMenuSeparator, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import Eye from "@/components/Icons/Eye";
import { Badge } from "@/components/ui/badge";
import { ApproveModal, EditModal, NotifyTeacherModal } from "./AllClasses/AllClassesModal";
import { Avatar } from "@/components/Avatar";
import { Key } from "@/components/Icons/Key";
import { useRouter } from "next/navigation";
import { Notification } from "@/components/Icons/Notification";
import { Button } from "@/components/ui/button";
import { CheckboxCircle } from "@/components/Icons/CheckboxCircle";

const RenderOptions = (row: Row<AllClassesMainTableProps>) => {
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
            onClick={() => router.push(`/classes-and-subjects/all-classes/${row.original.id}`)}
          >
            <Eye fill="var(--color-icon-default-subtle)" />
            <span>View class</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3" onClick={() => setOpenApproveModal(true)}>
            <CheckboxCircle fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Approve submission</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3" onClick={() => setOpenNotifyModal(true)}>
            <Notification fill="var(--color-icon-default-subtle)" className="size-4" />
            <span>Notify class teacher</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">
            <Key fill="var(--color-icon-default-subtle)" className="size-4" />
            <span className="">Manage edit requests</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const RenderModals = (row: Row<ClassProps>) => {
  const router = useRouter();
  const [openNotifyMobile, setOpenNotifyMobile] = useState(false);
  const [openEditMobile, setOpenEditMobile] = useState(false);
  return (
    <>
      {openNotifyMobile && <NotifyTeacherModal openNotifyModal={openNotifyMobile} setOpenNotifyModal={setOpenNotifyMobile} />}
      {openEditMobile && <EditModal openEditRequestModal={openEditMobile} setEditRequestModal={setOpenEditMobile} />}

      <div className="flex items-center gap-1">
        <Button
          onClick={() => setOpenEditMobile(true)}
          className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium"
        >
          <Key fill="var(--color-icon-default)" />
          Manage Edit Request
        </Button>
        <Button
          onClick={() => setOpenNotifyMobile(true)}
          className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-34 items-center gap-1 rounded-md border text-sm font-medium"
        >
          <Notification fill="var(--color-icon-default)" />
          Notify Teacher
        </Button>
        <Button
          onClick={() => router.push(`/classes-and-subjects/all-classes/class-report`)}
          className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-20 items-center gap-1 rounded-md border text-sm font-medium"
        >
          <Eye fill="var(--color-icon-default)" /> View
        </Button>
      </div>
    </>
  );
};
//  Table for AllClass
export const AllClassessTableMainColumns: ColumnDef<AllClassesMainTableProps>[] = [
  {
    accessorKey: "class",
    header: () => <div className="text-text-muted text-sm font-medium">Class</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.className}</span>,
  },
  {
    accessorKey: "classTeacher",
    header: () => <div className="text-text-muted text-sm font-medium">Class Teacher</div>,
    cell: ({ row }) => (
      <div className="items center flex gap-2">
        <Avatar username={row.original.teacherName} className="size-5" />
        <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.teacherName}</span>{" "}
      </div>
    ),
  },
  {
    accessorKey: "subjectSheet",
    header: () => <div className="text-text-muted text-sm font-medium">Subject Sheet</div>,
    cell: ({ row }) => (
      <span className="text-text-default cursor-pointer text-sm font-medium">
        {row.original.subjectSheet}/{row.original.subjectSheet}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;

      const statusStyles: Record<AllClassesMainTableProps["status"], string> = {
        Approved: "bg-bg-badge-green text-bg-basic-green-strong ",
        "Pending Approval": "bg-bg-badge-orange text-bg-basic-orange-strong ",
        "Not Submitted": "bg-bg-badge-red text-bg-basic-red-strong ",
        "Edit Request": "bg-bg-badge-lime text-bg-basic-lime-strong ",
      };

      return <Badge className={`border-border-default rounded-md border p-1 text-xs font-medium ${statusStyles[status]} `}>{status}</Badge>;
    },
  },
  {
    accessorKey: "editRequest",
    header: () => <div className="text-text-muted text-sm font-medium">Edit Request</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.editRequest}</span>,
  },

  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderOptions(row),
    size: 11,
  },
];

//  Table for Class
export const ClassTableColumns: ColumnDef<ClassProps>[] = [
  {
    accessorKey: "subject",
    header: () => <div className="text-text-muted text-sm font-medium">Subject</div>,
    cell: ({ row }) => <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.subject}</span>,
    size: 252,
  },
  {
    accessorKey: "teacherName",
    header: () => <div className="text-text-muted text-sm font-medium">Teacher</div>,
    cell: ({ row }) => (
      <div className="items center flex gap-2">
        <Avatar username={row.original.teacherName} className="size-5" />
        <span className="text-text-default cursor-pointer text-sm font-medium">{row.original.teacherName}</span>{" "}
      </div>
    ),
    size: 252,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-text-muted text-sm font-medium">Status</div>,
    cell: ({ row }) => (
      <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default w-17 rounded-md border p-0.5 text-xs font-medium">
        {row.original.status}
      </Badge>
    ),
    size: 252,
  },
  {
    id: "actions",
    header: () => <div className="text-text-muted cursor-pointer text-sm font-medium"></div>,
    cell: ({ row }) => RenderModals(row),
  },
];
