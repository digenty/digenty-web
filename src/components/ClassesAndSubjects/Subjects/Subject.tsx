"use client";

import { Eye, Question, RequestLoader } from "@digenty/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REPORT_STATUS_CONFIG } from "@/queries/subject";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RequestEdit from "../RequestEditAccess";
import { SubjectProps } from "./types";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

export default function Subject({ subjectName, classes, subjectId }: SubjectProps) {
  const [openRequest, setOpenRequest] = useState<boolean>(false);
  const [classId, setClassId] = useState<number>();
  const [armId, setArmId] = useState<number>();
  const router = useRouter();

  const handleOpen = (): void => {
    setOpenRequest(!openRequest);
  };

  return (
    <div className="">
      {openRequest && <RequestEdit open={openRequest} onOpenChange={setOpenRequest} classId={classId} armId={armId} subjectId={subjectId} />}

      <div className="border-border-default bg-bg-default shadow-light w-full overflow-hidden rounded-xl border">
        <div className="bg-bg-muted border-border-default flex items-center justify-between gap-2 border-b px-4 py-3 md:px-6">
          <h2 className="text-text-default text-md truncate font-semibold">{subjectName}</h2>
          <span className="text-text-muted shrink-0 text-xs font-medium">
            {classes.length} {classes.length === 1 ? "class" : "classes"}
          </span>
        </div>
        <ul className="w-full">
          {classes.map(cl => {
            const statusUpdate = REPORT_STATUS_CONFIG[cl.reportStatus];

            return (
              <li key={cl.classArmName} className="border-border-default hover:bg-bg-muted/50 border-b transition-colors last:border-b-0">
                <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-2 md:px-6 md:py-3">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <p className="text-text-default text-md font-semibold">{cl.classArmName}</p>
                    <Badge
                      className={`border-border-default flex h-5 items-center gap-1 rounded-md border p-1 text-xs font-medium ${statusUpdate.className}`}
                    >
                      {cl.reportStatus === "REQUESTED_EDIT_ACCESS" && <RequestLoader fill="var(--color-bg-basic-orange-strong)" />}
                      {statusUpdate.label}
                    </Badge>
                  </div>

                  <div>
                    {(cl.reportStatus === "NOT_SUBMITTED" || cl.reportStatus === "IN_PROGRESS" || cl.reportStatus === "APPROVED_EDIT_ACCESS") && (
                      <Button
                        onClick={() =>
                          router.push(
                            `/staff/classes-and-subjects/subjects/${subjectId}/classes/${cl.classId}/arms/${cl.armId}/add-score?classArmName=${cl.classArmName.replaceAll(" ", "-")}&subjectName=${subjectName}`,
                          )
                        }
                        className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 w-24 rounded-md px-2 py-1"
                      >
                        Enter Score
                      </Button>
                    )}

                    {cl.reportStatus === "SUBMITTED" ? (
                      <div className="flex gap-2 md:items-center md:justify-between md:gap-1">
                        <PermissionCheck permissionUtility={canManageClassesAndSubjects}>
                          <Button
                            onClick={() => {
                              setArmId(cl.armId);
                              setClassId(cl.classId);
                              handleOpen();
                            }}
                            className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! shadow-light h-7 w-44 rounded-md border px-2 py-1 text-sm font-medium"
                          >
                            <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                          </Button>
                        </PermissionCheck>
                        <Button
                          onClick={() =>
                            router.push(
                              `/staff/classes-and-subjects/subjects/${subjectId}/classes/${cl.classId}/arms/${cl.armId}/add-score?classArmName=${cl.classArmName.replaceAll(" ", "-")}&subjectName=${subjectName}`,
                            )
                          }
                          className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! shadow-light h-7 w-18 rounded-md border px-2 py-1 text-sm font-medium"
                        >
                          <Eye fill="var(--color-icon-default-muted)" /> View
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}

                    {cl.reportStatus === "REQUESTED_EDIT_ACCESS" ? (
                      <Button
                        onClick={() =>
                          router.push(
                            `/staff/classes-and-subjects/subjects/${subjectId}/classes/${cl.classId}/arms/${cl.armId}/add-score?classArmName=${cl.classArmName.replaceAll(" ", "-")}&subjectName=${subjectName}`,
                          )
                        }
                        className="border-border-darker text-text-default bg-bg-state-secondary shadow-light h-7 w-18 rounded-md border px-2 py-1 text-sm font-medium"
                      >
                        <Eye fill="var(--color-icon-default-muted)" /> View
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
