"use client";

import React, { useState } from "react";
import { AllClassesMainTableProps } from "../types";
import { DataTable } from "@/components/DataTable";
import { AllClassessTableMainColumns } from "./Column";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Filter } from "@/components/Icons/Filter";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontalIcon } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import { Notification } from "@/components/Icons/Notification";
import { Key } from "@/components/Icons/Key";
import { CheckboxCircle } from "@/components/Icons/CheckboxCircle";
import { useRouter } from "next/navigation";
import { ApproveModal, NotifyTeacherModal } from "./AllClassesModal";

const allClassesTableData: AllClassesMainTableProps[] = [
  {
    id: 1,
    className: "JSS 1A",
    teacherName: "Damilare John",
    subjectSheet: 13,
    editRequest: "-",
    status: "Approved",
  },
  {
    id: 2,
    className: "JSS 1A",
    teacherName: "Damilare John",
    subjectSheet: 13,
    editRequest: "-",
    status: "Pending Approval",
  },
  {
    id: 3,
    className: "JSS 1A",
    teacherName: "Damilare John",
    subjectSheet: 13,
    editRequest: "-",
    status: "Not Submitted",
  },
  {
    id: 4,
    className: "JSS 1A",
    teacherName: "Damilare John",
    subjectSheet: 13,
    editRequest: "1 Pending",
    status: "Edit Request",
  },
];

export const AllClassesMainTable = () => {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(false);
  const [openNotifyModalMobile, setOpenNotifyModalMobile] = useState(false);
  const [openApproveModalMobile, setOpenApproveModalMobile] = useState(false);
  const router = useRouter();
  return (
    <div className="px-4 py-3">
      <div className="mb-4 flex h-8 w-full items-center gap-3 md:w-92">
        <SearchInput className="border-border-default bg-bg-input-soft" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Button className="text-text-muted border-border-darker bg-bg-state-secondary hidden h-8 w-20 items-center gap-1 rounded-full border border-dashed px-2.5 py-1.5 text-sm md:flex">
                <Filter fill="var(--color-icon-default-muted)" /> Level
              </Button>
              <div className="bg-bg-input-soft block flex h-8 items-center gap-1 rounded-sm px-2.5 py-1.5 text-sm md:hidden">
                <Filter fill="var(--color-icon-default-muted)" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">All</DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">Primary School</DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">Secondary School</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={AllClassessTableMainColumns}
          data={allClassesTableData}
          totalCount={allClassesTableData.length}
          page={page}
          setCurrentPage={setPage}
          showPagination={false}
        />
      </div>

      {/* Mobile  */}
      <div className="flex flex-col gap-4 md:hidden">
        <>
          {openNotifyModalMobile && <NotifyTeacherModal openNotifyModal={openNotifyModalMobile} setOpenNotifyModal={setOpenNotifyModalMobile} />}
          {openApproveModalMobile && <ApproveModal openApproveModal={openApproveModalMobile} setOpenApproveModal={setOpenApproveModalMobile} />}

          {allClassesTableData.map(item => (
            <>
              {action && (
                <MobileDrawer open={action} setIsOpen={setAction} title="Actions">
                  <div className="flex flex-col gap-2 px-4 py-3">
                    <Button
                      onClick={() => router.push(`/classes-and-subjects/all-classes/${item.id}`)}
                      className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <Eye fill="var(--color-icon-default-muted)" /> <span className="text-text-default text-sm font-medium">View Class</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setOpenApproveModalMobile(true)}
                      className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <CheckboxCircle fill="var(--color-icon-default-muted)" className="size-4" />
                        <span className="text-text-default text-sm font-medium">Approve Submission</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() => setOpenNotifyModalMobile(true)}
                      className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2"
                    >
                      <div className="flex items-center gap-1">
                        <Notification fill="var(--color-icon-default-muted)" className="size-4" />
                        <span className="text-text-default text-sm font-medium">Notify Class Teacher</span>
                      </div>
                    </Button>

                    <Button className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2">
                      <div className="flex items-center gap-1">
                        <Key fill="var(--color-icon-default-muted)" className="size-4" />
                        <span className="text-text-default text-sm font-medium">Manage Edit Requests</span>
                      </div>
                    </Button>
                  </div>
                </MobileDrawer>
              )}
              <div key={item.id} className="border-border-default bg-bg-subtle rounded-sm border">
                <div className="border-border-default border-b">
                  <div className="flex h-11 items-center justify-between p-3">
                    <div className="text-text-default text-sm font-medium">{item.className}</div>
                    <Button onClick={() => setAction(true)}>
                      <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                    </Button>
                  </div>
                </div>
                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-text-muted text-sm font-medium">Class Teacher</span>
                    <div className="flex items-center gap-2">
                      <Avatar username={item.teacherName} className="size-6" />
                      <span className="text-text-default text-sm font-medium">{item.teacherName}</span>
                    </div>
                  </div>
                </div>
                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-text-muted text-sm font-medium">Subject Sheet</span>
                    <span className="text-text-default text-sm font-medium">
                      {item.subjectSheet}/{item.subjectSheet}
                    </span>
                  </div>
                </div>
                <div className="border-border-default border-b">
                  <div className="flex items-center justify-between p-3">
                    <span className="text-text-muted text-sm font-medium">Status</span>
                    <Badge
                      className={`${item.status === "Approved" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "Edit Request" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "Not Submitted" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "Pending Approval" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : null} border-border-default rounded-md border p-1 text-xs font-medium`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-text-muted text-sm font-medium">Edit Request</span>
                  <span className="text-text-default text-sm font-medium">{item.editRequest}</span>
                </div>
              </div>
            </>
          ))}
        </>
      </div>
    </div>
  );
};
