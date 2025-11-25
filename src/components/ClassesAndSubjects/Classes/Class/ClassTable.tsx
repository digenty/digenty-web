"use client";

import React, { useState } from "react";
import { ClassProps } from "../types";
import { ClassTableColumns } from "../AllClasses/Column";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { MobileDrawer } from "@/components/MobileDrawer";
import Eye from "@/components/Icons/Eye";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/Avatar";
import { Notification } from "@/components/Icons/Notification";
import { Key } from "@/components/Icons/Key";

const classItems: ClassProps = {
  id: 1,
  subject: "Mathematics",
  teacherName: "Damilare John",
  status: "Submitted",
};

const classData: ClassProps[] = Array.from({ length: 6 }, (_, index) => ({
  ...classItems,
  id: index + 1,
}));

export const ClassTable = () => {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(false);
  return (
    <div className="px-4 py-3">
      <div className="hidden md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={ClassTableColumns}
          data={classData}
          totalCount={classData.length}
          page={page}
          setCurrentPage={setPage}
          showPagination={false}
        />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {action && (
          <MobileDrawer open={action} setIsOpen={setAction} title="Actions">
            <div className="flex flex-col gap-2 px-4 py-3">
              <Button className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2">
                <div className="flex items-center gap-1">
                  <Eye fill="var(--color-icon-default-muted)" /> <span className="text-text-default text-sm font-medium">View Class</span>
                </div>
              </Button>

              <Button className="border-border-darker bg-bg-state-secondary flex justify-center rounded-md border px-3.5 py-2">
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
        <>
          {" "}
          {classData.map(item => (
            <div key={item.id} className="border-border-default bg-bg-subtle rounded-sm border">
              <div className="border-border-default border-b">
                <div className="flex h-11 items-center justify-between p-3">
                  <div className="text-text-default text-sm font-medium">{item.subject}</div>
                  <Button onClick={() => setAction(true)}>
                    <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                  </Button>
                </div>
              </div>
              <div className="border-border-default border-b">
                <div className="flex items-center justify-between p-3">
                  <span className="text-text-muted text-sm font-medium">Subject Teacher</span>
                  <div className="flex items-center gap-2">
                    <Avatar username={item.teacherName} className="size-6" />
                    <span className="text-text-default text-sm font-medium">{item.teacherName}</span>
                  </div>
                </div>
              </div>

              <div className="border-border-default border-b">
                <div className="flex items-center justify-between p-3">
                  <span className="text-text-muted text-sm font-medium">Status</span>
                  <Badge
                    className={`${item.status === "Submitted" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "Edit Request" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "Not Submitted" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "Pending Approval" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : null} border-border-default rounded-md border p-1 text-xs font-medium`}
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};
