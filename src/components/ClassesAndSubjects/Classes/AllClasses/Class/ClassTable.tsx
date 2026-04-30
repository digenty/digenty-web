"use client";

import { Eye, Key, Notification } from "@digenty/icons";
import { useState } from "react";

import { Avatar } from "@/components/Avatar";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { ClassTableColumns } from "../../Column";
import { ClassProps } from "../../types";

export const ClassTable = ({
  classData,
  isLoading,
  isError,
  classId,
  armId,
  classArmName,
}: {
  isError: boolean;
  isLoading: boolean;
  classData: [];
  classId: number;
  armId: number;
  classArmName: string;
}) => {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(false);

  return (
    <div className="px-4 py-3 md:px-8">
      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Subjects"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {!isError && !isLoading && classData.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Subject Report" description="No subject report available for this class yet" buttonText="Go to the Home page" />
        </div>
      )}

      {!isLoading && !isError && classData.length > 0 && (
        <>
          <div className="hidden md:block">
            <DataTable
              pageSize={10}
              columns={ClassTableColumns(armId, classId, classArmName)}
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
              {classData.map((item: ClassProps) => (
                <div key={item.subjectId} className="border-border-default bg-bg-subtle rounded-sm border">
                  <div className="border-border-default border-b">
                    <div className="flex h-11 items-center justify-between p-3">
                      <div className="text-text-default text-sm font-medium capitalize">{item.subjectName ? item.subjectName.toLowerCase() : ""}</div>
                      <Button onClick={() => setAction(true)}>
                        <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-text-muted text-sm font-medium">Subject Teacher</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6" />
                        <span className="text-text-default text-sm font-medium">{item.subjectTeacherName || "--"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-border-default border-b">
                    <div className="flex items-center justify-between p-3">
                      <span className="text-text-muted text-sm font-medium">Status</span>
                      <Badge
                        // className={`capitalize ${item.status === "SUBMITTED" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "REQUESTED_EDIT_ACCESS" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "NOT_SUBMITTED" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} ${item.status === "PENDING_APPROVAL" ? "bg-bg-badge-orange text-bg-basic-orange-strong" : null} border-border-default rounded-md border p-1 text-xs font-medium`}
                        className={`capitalize ${item.status === "SUBMITTED" || item.status === "APPROVED_EDIT_ACCESS" ? "bg-bg-badge-green text-bg-basic-green-strong" : ""} ${item.status === "REQUESTED_EDIT_ACCESS" ? "bg-bg-badge-lime text-bg-basic-lime-strong" : ""} ${item.status === "NOT_SUBMITTED" ? "bg-bg-badge-red text-bg-basic-red-strong" : ""} border-border-default rounded-md border p-1 text-xs font-medium`}
                      >
                        {item.status ? item.status.replaceAll("_", " ").toLowerCase() : ""}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </>
          </div>
        </>
      )}
    </div>
  );
};
