"use client";

import Question from "@/components/Icons/Question";
import Eye from "@/components/Icons/Eye";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RequestEdit from "./RequestEdit";
import RequestLoader from "@/components/Icons/RequestLoader";
import { useRouter } from "next/navigation";
import { REPORT_STATUS_CONFIG } from "@/queries/subject";
import { SubjectProps } from "./types";

export default function Subject({ subjectName, classes, subjectId }: SubjectProps) {
  const [openRequest, setOpenRequest] = useState<boolean>(false);
  const router = useRouter();

  const handleOpen = (): void => {
    setOpenRequest(!openRequest);
  };

  return (
    <div className="">
      {openRequest && <RequestEdit open={openRequest} onOpenChange={setOpenRequest} />}

      <div className="flex-start bg-bg-muted flex w-full flex-col gap-1.5 rounded-lg pt-1 pr-1 pb-2 pl-1 md:max-w-219 md:gap-3 md:pt-1 md:pr-3 md:pb-3 md:pl-3">
        <h2 className="text-text-default text-md px-3 pt-1.5 font-semibold md:px-5 md:pt-3">{subjectName}</h2>
        <ul className="bg-bg-card border-border-default w-full rounded-sm border shadow-sm md:max-w-213">
          {classes.map(cl => {
            const statusUpdate = REPORT_STATUS_CONFIG[cl.reportStatus];

            return (
              <li key={cl.classArmName} className="border-border-default border-b">
                <div className="flex flex-col gap-4 px-3 py-4 md:flex-row md:items-center md:justify-between md:gap-2 md:p-2 md:px-6 md:py-3">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <p className="text-text-default text-md font-semibold">{cl.classArmName}</p>
                    <Badge
                      className={`border-border-default flex h-5 items-center gap-1 rounded-md border p-1 text-xs font-medium ${statusUpdate.className}`}
                    >
                      {cl.reportStatus === "REQUEST_EDIT_ACCESS" && <RequestLoader fill="var(--color-bg-basic-orange-strong)" />}
                      {statusUpdate.label}
                    </Badge>
                  </div>

                  <div>
                    {(cl.reportStatus === "NOT_SUBMITTED" || cl.reportStatus === "IN_PROGRESS") && (
                      <Button
                        onClick={() => router.push(`/classes-and-subjects/subjects/${subjectId}/arms/${cl.armId}/add-score`)}
                        className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 w-24 rounded-md px-2 py-1"
                      >
                        Enter Score
                      </Button>
                    )}

                    {cl.reportStatus === "SUBMITTED" ? (
                      <div className="flex gap-2 md:items-center md:justify-between md:gap-1">
                        <Button
                          onClick={handleOpen}
                          className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! shadow-light h-7 w-44 rounded-md border px-2 py-1 text-sm font-medium"
                        >
                          <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                        </Button>
                        <Button
                          onClick={() => router.push(`/classes-and-subjects/subjects/${subjectId}/arms/${cl.armId}/view-score`)}
                          className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! shadow-light h-7 w-18 rounded-md border px-2 py-1 text-sm font-medium"
                        >
                          <Eye fill="var(--color-icon-default-muted)" /> View
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}

                    {cl.reportStatus === "REQUEST_EDIT_ACCESS" ? (
                      <Button
                        onClick={() => router.push(`/classes-and-subjects/subject=${subjectId}/add-score?${cl.armId}&requested=true`)}
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
