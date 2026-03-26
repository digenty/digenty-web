"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import Printer from "@/components/Icons/Printer";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { getStatusBadge, staffStatusBadge } from "@/components/Status";
import ShareBox from "@/components/Icons/ShareBox";
import { SearchInput } from "@/components/SearchInput";
import { Badge } from "@/components/ui/badge";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/useIsMobile";
import Image from "next/image";
import { AddFill } from "@/components/Icons/AddFill";
import { StaffProps } from "../Staffs";
import { SettingPermissionModalExport } from "../SettingPermissionModalExport";
import { StaffColumns } from "../StaffTableColumns";
import { StaffList } from "..";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { UserForbid } from "@/components/Icons/UserForbid";

export const SubjectTeachers = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [selectedRows, setSelectedRows] = useState<StaffProps[]>([]);
  const isMobile = useIsMobile();
  const router = useRouter();
  const [openExport, setOpenExport] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const filterBranch = [
    {
      branch: "Lawanson",
    },
    {
      branch: "Ilasamaja",
    },
  ];
  const pageSize = 7;

  return (
    <div>
      {openExport && <SettingPermissionModalExport open={openExport} setOpen={setOpenExport} />}

      <div className="flex flex-col gap-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-text-default text-xl font-semibold">Subject Teacher</div>

          <div className="flex gap-2">
            <Button className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex">
              <DeleteBin fill="var(--color-icon-default-muted)" /> Delete
            </Button>
            <Button className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex">
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-1">
            <SearchInput className="border-border-default border text-sm" />

            <DropdownMenu open={openFilter} onOpenChange={setOpenFilter}>
              <DropdownMenuTrigger asChild>
                <Badge className="border-border-darker bg-bg-state-secondary text-text-muted hidden cursor-pointer items-center rounded-full border border-dashed md:flex">
                  <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} className="size-7 p-1.5" />
                  Status
                </Badge>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-bg-card border-border-default text-text-default hidden w-48 py-2.5 shadow-sm md:block">
                <div className="flex flex-col gap-1 px-1 py-2">
                  {filterBranch.map((br, i) => (
                    <div key={i} className="hover:bg-bg-state-ghost-hover flex w-full cursor-pointer items-center gap-2 rounded-md p-2 text-sm">
                      <span className="text-text-default font-normal">{br.branch}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between gap-1">
            <Button onClick={() => setOpenFilter(true)} className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden">
              <Image src="/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
            </Button>

            <Button
              onClick={() => setOpenExport(true)}
              className="border-border-darker text-text-default hidden h-8 items-center rounded-md border px-2.5 text-sm font-medium md:flex"
            >
              <ShareBox fill="var(--color-icon-default-muted)" /> Export
            </Button>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => router.push("/settings/permissions/add-staff")}
                className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default flex h-8 w-31 items-center gap-1 rounded-md"
              >
                <AddFill fill="var(--color-icon-white-default)" />
                Add Staff
              </Button>

              <Button
                onClick={() => setOpenAction(true)}
                className="bg-bg-state-soft text-text-muted flex h-7 w-7 cursor-pointer p-0! text-center focus-visible:ring-0! md:hidden"
              >
                <Ellipsis className="size-5" />
              </Button>
            </div>
          </div>

          {openAction && (
            <MobileDrawer open={openAction} setIsOpen={setOpenAction} title="Actions">
              <div className="flex w-full flex-col gap-4 px-3 py-4">
                <div className="flex flex-col items-center gap-2" onClick={() => setOpenExport(true)}>
                  <div className="text-text-default hover:bg-bg-state-ghost-hover border-border-darker flex w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                    <ShareBox className="size-4" fill="var(--color-icon-default-muted)" />
                    Export
                  </div>
                </div>
              </div>
            </MobileDrawer>
          )}

          {isMobile && (
            <MobileDrawer open={openFilter} setIsOpen={setOpenFilter} title="Filter">
              <div className="flex w-full flex-col gap-2 px-6 py-4">
                {filterBranch.map((br, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="flex w-full items-center gap-2 p-2 text-sm">
                      <span className="text-text-default font-normal">{br.branch}</span>
                    </div>
                  </div>
                ))}
              </div>

              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-8 rounded-md! px-2.5 py-1 text-sm font-medium">Cancel</Button>
                  </DrawerClose>

                  <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-8 rounded-md px-2.5 py-1 text-sm">
                    Apply
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          )}
        </div>

        <div className="hidden p-4 md:block">
          <DataTable
            columns={StaffColumns}
            data={StaffList}
            totalCount={StaffList.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            clickHandler={() => {}}
            showPagination={true}
          />
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {StaffList.slice(0, visibleCount).map(stf => {
            return (
              <div key={stf.id} className="border-border-default bg-bg-subtle rounded-md border">
                <div className="border-border-default flex h-[38px] items-center justify-between border-b px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5" url="" />
                    <span className="text-text-default text-sm font-medium">{stf.staffName}</span>
                  </div>
                  <Button onClick={() => setIsOpen(true)} className="text-text-muted cursor-pointer p-0! focus-visible:ring-0!">
                    <Ellipsis className="size-5" />
                  </Button>
                  <MobileDrawer open={isOpen} setIsOpen={setIsOpen} title="Actions">
                    <div className="flex w-full flex-col gap-4 px-3 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                          <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Staff
                        </div>
                        <div
                          role="button"
                          onClick={() => router.push("/invoices/edit-invoice")}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <Printer fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Staff
                        </div>

                        <div className="hover:bg-bg-muted border-border-darker text-text-destructive flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm">
                          <UserForbid fill="var(--color-icon-destructive)" className="size-4" /> Deactivate Staff
                        </div>
                      </div>
                    </div>
                  </MobileDrawer>
                </div>

                <div className="">
                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Role</span>
                    <span className="text-text-default text-sm font-medium">{staffStatusBadge(stf.role)}</span>
                  </div>
                </div>
                <div className="">
                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Branch</span>
                    <span className="text-text-default text-sm font-medium">{stf.branch}</span>
                  </div>
                </div>

                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Status</span>
                  {getStatusBadge(stf.status)}
                </div>
              </div>
            );
          })}

          {visibleCount < StaffList.length && (
            <Button
              onClick={() => setVisibleCount(StaffList.length)}
              className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
