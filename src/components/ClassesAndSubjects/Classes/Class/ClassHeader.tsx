"use client";

import { Avatar } from "@/components/Avatar";
import { Key } from "@/components/Icons/Key";
import { Notification } from "@/components/Icons/Notification";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { EditModal, NotifyTeacherModal } from "../AllClasses/AllClassesModal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import FileList2 from "@/components/Icons/FileList2";
import { useRouter } from "next/navigation";

export const ClassHeader = () => {
  const router = useRouter();
  const [openNotify, setOpenNotify] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      {openEdit && <EditModal openEditRequestModal={openEdit} setEditRequestModal={setOpenEdit} />}
      {openNotify && <NotifyTeacherModal openNotifyModal={openNotify} setOpenNotifyModal={setOpenNotify} />}
      <div className="border-border-default border-b">
        <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-col gap-1">
            <h2 className="border-border-default text-text-default border-b px-4 py-2 text-lg font-semibold md:border-none md:p-0">JSS 1A</h2>
            <div className="border-border-default flex items-center gap-1 border-b px-4 py-2 md:border-none md:p-0">
              <Avatar className="size-4" /> <span className="text-text-subtle text-sm font-normal">Damilare John</span>
            </div>
          </div>
          <div className="border-border-default space-between flex items-center gap-2 border-b px-4 pb-2 md:gap-1 md:border-none md:p-0">
            <Button
              onClick={() => setOpenEdit(true)}
              className="bg-bg-state-secondary border-border-default text-text-default hidden h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium md:flex"
            >
              <Key fill="var(--color-icon-default)" />
              Manage Edit Request
            </Button>
            <Button
              onClick={() => setOpenNotify(true)}
              className="bg-bg-state-secondary border-border-default text-text-default w-fill flex h-8 items-center gap-1 rounded-md border text-sm font-medium md:w-46"
            >
              <Notification fill="var(--color-icon-default)" />
              Notify Class Teacher
            </Button>
            <Button
              onClick={() => router.push("/classes-and-subjects/classes/1/class-report")}
              className="bg-bg-state-secondary border-border-default text-text-default w-fill flex h-8 items-center gap-1 rounded-md border text-sm font-medium md:w-32.5"
            >
              {" "}
              <FileList2 fill="var(--color-icon-default)" /> Class Report
            </Button>

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
