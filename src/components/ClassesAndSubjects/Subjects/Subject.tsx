"use client";

import Question from "@/components/Icons/Question";
import Eye from "@/components/Icons/Eye";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import RequestEdit from "./RequestEdit";
import RequestLoader from "@/components/Icons/RequestLoader";

export type ClassItem = {
  id: string;
  grade: string;
  subjectStatus: "Not Started" | "In Progress" | "Submitted" | "Request Edit Access";
};

export type SubjectProps = {
  title: string;
  classes: ClassItem[];
};

export default function Subject({ title, classes }: SubjectProps) {
  const [openRequest, setOpenRequest] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpenRequest(!openRequest);
  };

  return (
    <div className="p-4 md:px-8 md:py-4">
      <RequestEdit open={openRequest} onOpenChange={setOpenRequest} />

      <div className="flex-start bg-bg-muted flex w-full flex-col gap-4 rounded-lg pt-1 pr-1 pb-2 pl-1 md:w-219 md:pt-1 md:pr-3 md:pb-3 md:pl-3">
        <h2 className="text-text-default text-md px-5 pt-4 font-semibold">{title}</h2>
        <ul className="bg-bg-card border-border-default w-full rounded-sm border shadow-sm md:w-213">
          {classes.map(cl => {
            const statusUpdate =
              cl.subjectStatus === "Request Edit Access"
                ? "bg-bg-badge-orange text-bg-basic-orange-strong"
                : cl.subjectStatus === "In Progress"
                  ? "bg-bg-badge-orange text-bg-basic-orange-strong"
                  : cl.subjectStatus === "Submitted"
                    ? "bg-bg-badge-green text-bg-basic-green-strong"
                    : "bg-bg-badge-default text-text-subtle";

            return (
              <li key={cl.id} className="border-border-default border-b-1">
                <div className="flex flex-col gap-4 px-3 py-4 md:flex-row md:items-center md:justify-between md:gap-2 md:p-2 md:px-6 md:py-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-text-default text-md font-semibold">{cl.grade}</p>
                    <Badge className={`border-border-default flex h-5 items-center gap-1 rounded-md border p-1 text-xs font-medium ${statusUpdate}`}>
                      {cl.subjectStatus === "Request Edit Access" ? <RequestLoader fill="var(--color-bg-basic-orange-strong)" /> : null}{" "}
                      {cl.subjectStatus}
                    </Badge>
                  </div>

                  <div>
                    {cl.subjectStatus === "Not Started" ? (
                      <Button className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 w-24 rounded-md px-2 py-1">
                        Enter Score
                      </Button>
                    ) : (
                      ""
                    )}

                    {cl.subjectStatus === "In Progress" ? (
                      <Button className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 w-24 rounded-md px-2 py-1">
                        Enter Score
                      </Button>
                    ) : (
                      ""
                    )}

                    {cl.subjectStatus === "Submitted" ? (
                      <div className="flex gap-2 md:items-center md:justify-between md:gap-1">
                        <Button
                          onClick={handleOpen}
                          className="border-border-darker text-text-default bg-bg-state-secondary h-7 w-44 rounded-md border px-2 py-1 text-sm font-medium shadow"
                        >
                          <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                        </Button>
                        <Button className="border-border-darker text-text-default bg-bg-state-secondary h-7 w-18 rounded-md border px-2 py-1 text-sm font-medium shadow">
                          <Eye fill="var(--color-icon-default-muted)" /> View
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}

                    {cl.subjectStatus === "Request Edit Access" ? (
                      <Button className="border-border-darker text-text-default bg-bg-state-secondary h-7 w-18 rounded-md border px-2 py-1 text-sm font-medium shadow">
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
