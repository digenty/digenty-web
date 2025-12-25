"use client";

import React, { useState } from "react";
import { AllClassesMainTableProps } from "../types";
import { DataTable } from "@/components/DataTable";
import { AllClassessTableMainColumns } from "../Column";
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
import Calendar from "@/components/Icons/Calendar";
import { Label } from "@/components/ui/label";
import { SelectContent } from "@/components/ui/select";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

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
  const [isLevelFilterOpen, setIsLevelFilterOpen] = useState(false);
  const [openMobileDrawer, setOpenMobilerDrawer] = useState(false);
  const [openNotifyModalMobile, setOpenNotifyModalMobile] = useState(false);
  const [openApproveModalMobile, setOpenApproveModalMobile] = useState(false);
  const router = useRouter();

  useBreadcrumb([
    { label: "All Classes", url: "/classes-and-subjects/all-classes" },
    { label: `JSS 1A`, url: "" },
  ]);

  return (
    <div className="px-4 py-3 md:px-8">
      <div className="mb-4 flex h-8 w-full items-center gap-3 md:w-92">
        <SearchInput className="bg-bg-input-soft h-7! border-none md:h-8!" />
        <DropdownMenu open={isLevelFilterOpen} onOpenChange={setIsLevelFilterOpen}>
          <DropdownMenuTrigger asChild>
            <div>
              <Button className="text-text-muted border-border-darker bg-bg-state-secondary hidden h-8 w-20 items-center gap-1 rounded-full border border-dashed px-2.5 py-1.5 text-sm md:flex">
                <Filter fill="var(--color-icon-default-muted)" /> Level
              </Button>
              <div className="bg-bg-input-soft flex h-8 items-center gap-1 rounded-sm px-2.5 py-1.5 text-sm md:hidden">
                <Filter fill="var(--color-icon-default-muted)" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden py-2.5 shadow-sm md:block">
            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">All</DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">Primary School</DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">Secondary School</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <MobileDrawer open={isLevelFilterOpen} setIsOpen={setIsLevelFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <p className="text-text-default px-3 text-sm">All</p>

              <p className="text-text-default px-3 text-sm">Primary School</p>

              <p className="text-text-default px-3 text-sm">Secondary School</p>
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle h-8! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button className="bg-bg-state-primary text-text-white-default h-8! rounded-md! px-4 py-2 text-sm tracking-[0.1rem]">
                <span>Apply</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
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
      <div className="flex flex-col gap-4 pb-8 md:hidden">
        <>
          {openNotifyModalMobile && <NotifyTeacherModal openNotifyModal={openNotifyModalMobile} setOpenNotifyModal={setOpenNotifyModalMobile} />}
          {openApproveModalMobile && <ApproveModal openApproveModal={openApproveModalMobile} setOpenApproveModal={setOpenApproveModalMobile} />}

          {openMobileDrawer && (
            <MobileDrawer open={openMobileDrawer} setIsOpen={setOpenMobilerDrawer} title="Actions">
              <div className="flex flex-col gap-2 px-4 py-3">
                <Button
                  // onClick={() => router.push(`/classes-and-subjects/all-classes/${item.id}`)}
                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <Eye fill="var(--color-icon-default-muted)" /> <span className="text-text-default text-sm font-medium">View Class</span>
                  </div>
                </Button>
                <Button
                  onClick={() => setOpenApproveModalMobile(true)}
                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <CheckboxCircle fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Approve Submission</span>
                  </div>
                </Button>
                <Button
                  onClick={() => setOpenNotifyModalMobile(true)}
                  className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2"
                >
                  <div className="flex items-center gap-1">
                    <Notification fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Notify Class Teacher</span>
                  </div>
                </Button>

                <Button className="border-border-darker bg-bg-state-secondary flex h-8! justify-center rounded-md border px-3.5 py-2">
                  <div className="flex items-center gap-1">
                    <Key fill="var(--color-icon-default-muted)" className="size-4" />
                    <span className="text-text-default text-sm font-medium">Manage Edit Requests</span>
                  </div>
                </Button>
              </div>
            </MobileDrawer>
          )}

          {allClassesTableData.map(item => (
            <div key={item.id} className="border-border-default bg-bg-subtle rounded-md border">
              <div className="border-border-default border-b">
                <div className="flex h-9.5 items-center justify-between p-3">
                  <div className="text-text-default text-sm font-medium">{item.className}</div>
                  <Button onClick={() => setOpenMobilerDrawer(true)}>
                    <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                  </Button>
                </div>
              </div>
              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-[7px]">
                  <span className="text-text-muted text-sm font-medium">Class Teacher</span>
                  <div className="flex items-center gap-2">
                    <Avatar username={item.teacherName} className="size-6" />
                    <span className="text-text-default text-sm font-medium">{item.teacherName}</span>
                  </div>
                </div>
              </div>
              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-[7px]">
                  <span className="text-text-muted text-sm font-medium">Subject Sheet</span>
                  <span className="text-text-default text-sm font-medium">
                    {item.subjectSheet}/{item.subjectSheet}
                  </span>
                </div>
              </div>
              <div className="border-border-default border-b">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-text-muted text-sm font-medium">Status</span>
                  <Badge
                    className={`h-5! ${item.status === "Approved" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "Edit Request" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "Not Submitted" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "Pending Approval" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : null} border-border-default rounded-md border p-1 text-xs font-medium`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-text-muted text-sm font-medium">Edit Requests</span>
                <span className="text-text-default text-sm font-medium">{item.editRequest}</span>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};
