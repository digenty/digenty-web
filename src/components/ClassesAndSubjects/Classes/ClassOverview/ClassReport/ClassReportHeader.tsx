import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import Question from "@/components/Icons/Question";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { StudentRow } from "./students";
import { SubmitClassReportModal } from "./SubmitClassReportModal";
// import RequestEdit from "../RequestEdit";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";

const termsOptions = ["Third Term", "Second Term", "First Term"];

export const ClassReportHeader = ({
  students,
  activeFilter,
  setActiveFilter,
  termSelected,
  setTermSelected,
}: {
  students: StudentRow[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  termSelected: string;
  setTermSelected: (term: string) => void;
}) => {
  const isMobile = useIsMobile();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openRequest, setOpenRequest] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");
  const isSubmitted = !!searchParams.get("submitted");
  const isRequested = !!searchParams.get("requested");

  return (
    <>
      {openModal && <SubmitClassReportModal open={openModal} onOpenChange={setOpenModal} />}
      {/* {openRequest && <RequestEdit open={openRequest} onOpenChange={setOpenRequest} />} */}

      <div className="border-border-default border-b md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-2">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <h2 className="text-text-default truncate px-4 py-2 text-lg font-semibold md:p-0">JSS 1 A</h2>

            {activeFilter !== "promotion" && (
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
            )}
          </div>

          <div className="border-border-default overflow-x-auto border-t px-4 py-2 md:border-none md:p-0">
            <div className="flex items-center gap-2 md:gap-1">
              <Button
                size="sm"
                className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-22 flex-1 items-center gap-1 border text-sm md:flex-auto"
              >
                <ShareBox fill="var(--color-icon-default-muted)" /> Export
              </Button>

              {!isSubmitted && !isRequested && (
                <div className="flex flex-1 items-center gap-2 md:flex-auto md:gap-1">
                  <Button
                    onClick={() => setOpenModal(true)}
                    size="sm"
                    className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! flex h-8 w-full items-center gap-1 text-sm font-normal md:w-fit"
                  >
                    <CheckboxCircleFill fill="var(--color-icon-white-default)" className="size-3" />
                    Submit
                  </Button>
                </div>
              )}

              {isSubmitted && !isRequested && (
                <Button
                  size="sm"
                  onClick={() => setOpenRequest(true)}
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto flex-1 items-center justify-between gap-1 border text-sm md:flex-auto"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                </Button>
              )}

              {isRequested && (
                <Button
                  size="sm"
                  className="border-border-default bg-bg-state-disabled! text-text-hint flex h-8 w-auto flex-1 cursor-not-allowed items-center justify-between gap-1 border text-sm md:flex-auto"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Requested Edit Access
                </Button>
              )}
            </div>
          </div>

          {isMobile && (
            <div className="border-border-default flex gap-2 overflow-x-auto border-t px-4 py-2 md:hidden">
              <Button
                onClick={() => setActiveFilter("spreadsheet")}
                className={cn(
                  "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                  activeFilter === "spreadsheet" && "bg-bg-state-primary text-text-white-default",
                )}
              >
                Spreadsheet
              </Button>
              <Button
                onClick={() => setActiveFilter("promotion")}
                className={cn(
                  "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                  activeFilter === "promotion" && "bg-bg-state-primary text-text-white-default",
                )}
              >
                Promotion
              </Button>

              {students.map(student => (
                <Button
                  onClick={() => setActiveFilter(student.id)}
                  key={student.id}
                  className={cn(
                    "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                    activeFilter === student.id && "bg-bg-state-primary text-text-white-default",
                  )}
                >
                  {student.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
