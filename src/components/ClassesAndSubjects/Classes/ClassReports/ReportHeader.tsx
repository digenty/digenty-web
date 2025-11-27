"use client";

import Approve from "@/components/Icons/Approve";
import { ArrowGoBack } from "@/components/Icons/ArrowGoBack";
import Calendar from "@/components/Icons/Calendar";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ApproveModal } from "../AllClasses/AllClassesModal";
import { ReturnModal } from "./ClassReportModal";
import { MoreHorizontalIcon } from "lucide-react";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const ReportHeader = () => {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [openAprrove, setOpenApprove] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  return (
    <div>
      {openAprrove && <ApproveModal openApproveModal={openAprrove} setOpenApproveModal={setOpenApprove} />}
      {openReturn && <ReturnModal openReturnModal={openReturn} setOpenReturnModal={setOpenReturn} />}
      <div className="border-border-default border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:p-4">
          <div className="flex items-center justify-between gap-3 px-4 py-2 md:p-0">
            <h2 className="text-text-default text-lg font-semibold">JSS 1A</h2>

            <Select value={termSelected} onValueChange={setTermSelected}>
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Calendar fill="var(--color-icon-black-muted )" className="size-4" />
                    <span className="text-text-default text-sm font-semibold">{termSelected}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {termsOptions.map(term => (
                  <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-border-default border-t py-1 md:border-none">
            <div className="flex items-center gap-1 px-4 py-2 md:p-0">
              <Button className="bg-bg-state-secondary border-border-default text-text-default hidden h-8 w-22! items-center gap-1 rounded-md border text-sm font-medium md:flex">
                <ShareBox fill="var(--color-icon-default-muted)" /> Export
              </Button>
              <Button
                onClick={() => setOpenReturn(true)}
                className="bg-bg-state-destructive hover:bg-bg-state-destructive/90! border-border-default text-text-white-default flex h-8 w-39.5! items-center gap-1 rounded-md border text-sm font-medium md:w-33.5"
              >
                <ArrowGoBack fill="var(--color-icon-white-default)" /> Return Result
              </Button>
              <Button
                onClick={() => setOpenApprove(true)}
                className="bg-bg-state-primary hover:bg-bg-state-primary/90! border-border-default text-text-white-default flex h-8 w-39.5 items-center gap-1 rounded-md border text-sm font-medium md:w-36.5"
              >
                <Approve fill="var(--color-icon-white-default)" />
                Approve Result
              </Button>
              <Button
                onClick={() => {}}
                className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-8! cursor-pointer content-center items-center justify-center rounded-md border focus-visible:ring-0 focus-visible:outline-none md:hidden"
              >
                <MoreHorizontalIcon className="text-icon-default-muted" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
