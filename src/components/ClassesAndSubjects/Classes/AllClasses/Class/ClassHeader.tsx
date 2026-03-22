"use client";

import { Avatar } from "@/components/Avatar";
import FileList2 from "@/components/Icons/FileList2";
import { Key } from "@/components/Icons/Key";
import { Notification } from "@/components/Icons/Notification";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EditModal, NotifyTeacherModal } from "../AllClassesModal";

export const ClassHeader = ({ isLoading, classData, armId, classId }: { isLoading: boolean; classData: []; armId: string; classId: string }) => {
  const router = useRouter();
  const params = useSearchParams();
  const classArmName = params.get("classArmName") || "";
  const [openNotify, setOpenNotify] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);

  useBreadcrumb([
    { label: "All Classes", url: "/classes-and-subjects/all-classes" },
    { label: classArmName.replaceAll("-", " "), url: "" },
  ]);

  return (
    <>
      {openEdit && <EditModal openEditRequestModal={openEdit} setEditRequestModal={setOpenEdit} />}
      {openNotify && <NotifyTeacherModal openNotifyModal={openNotify} setOpenNotifyModal={setOpenNotify} />}
      <div className="border-border-default border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 md:py-3">
          <div className="flex flex-col gap-1 md:pl-8">
            <h2 className="border-border-default text-text-default border-b px-4 py-2 text-lg font-semibold md:border-none md:p-0">
              {classArmName.replaceAll("-", " ")}
            </h2>
            <div className="border-border-default flex items-center gap-1 border-b px-4 py-2 md:border-none md:p-0">
              <Avatar className="size-5" /> <span className="text-text-subtle text-sm font-normal">Damilare John</span>
            </div>
          </div>
          <div className="space-between flex items-center gap-2 px-4 py-2 pr-4 md:gap-1 md:border-none md:p-0 md:pr-8">
            {isLoading || classData.length == 0 ? (
              <Skeleton className="bg-bg-input-soft h-8 w-40" />
            ) : (
              <Button
                onClick={() => setOpenEdit(true)}
                className="bg-bg-state-secondary border-border-default text-text-default hidden h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium md:flex"
              >
                <Key fill="var(--color-icon-default-muted)" />
                Manage Edit Request
              </Button>
            )}
            {isLoading || classData.length == 0 ? (
              <Skeleton className="bg-bg-input-soft h-8 w-40" />
            ) : (
              <Button
                onClick={() => setOpenNotify(true)}
                className="bg-bg-state-secondary border-border-default text-text-default w-fill flex h-8 items-center gap-1 rounded-md border text-sm font-medium md:w-46"
              >
                <Notification fill="var(--color-icon-default-muted)" />
                Notify Class Teacher
              </Button>
            )}
            {isLoading || classData.length == 0 ? (
              <Skeleton className="bg-bg-input-soft h-8 w-40" />
            ) : (
              <Button
                onClick={() => router.push(`/classes-and-subjects/all-classes/${classId}/arm/${armId}/class-report?classArmName=${classArmName}`)}
                className="bg-bg-state-secondary border-border-default text-text-default w-fill flex h-8 items-center gap-1 rounded-md border text-sm font-medium md:w-32.5"
              >
                <FileList2 fill="var(--color-icon-default-muted)" /> Class Report
              </Button>
            )}

            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger
                onClick={() => setOpen(true)}
                className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-8 cursor-pointer content-center items-center justify-center rounded-md border focus-visible:ring-0 focus-visible:outline-none md:hidden"
              >
                <MoreHorizontalIcon className="text-icon-default-muted" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
                <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3">
                  <Button
                    onClick={() => setOpenEdit(true)}
                    className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium"
                  >
                    <Key fill="var(--color-icon-default)" />
                    Manage Edit Request
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};
