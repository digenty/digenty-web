"use client";

import { Term } from "@/api/types";
import Approve from "@/components/Icons/Approve";
import { ArrowGoBack } from "@/components/Icons/ArrowGoBack";
import Calendar from "@/components/Icons/Calendar";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useSubmitClassReport } from "@/hooks/queryHooks/useClass";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { cn } from "@/lib/utils";
import { MoreHorizontalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StudentRow } from "../../ClassOverview/ClassReport/students";
import { ApproveModal } from "../AllClassesModal";
import { ReturnModal } from "./ClassReportModal";

export const ReportHeader = ({
  termSelected,
  setTermSelected,
  activeSession,
  setActiveSession,

  students,
  activeFilter,
  setActiveFilter,
  onExport,
  classArmName,
  classArmReportId,
  reportStatus,
}: {
  termSelected: Term | null;
  setTermSelected: React.Dispatch<React.SetStateAction<Term | null>>;
  activeSession: string | null;
  setActiveSession: React.Dispatch<React.SetStateAction<string | null>>;
  students: StudentRow[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onExport?: () => void;
  classArmName: string;
  classArmReportId?: number;
  reportStatus: "APPROVED" | "NOT_SUBMITTED" | "SUBMITTED";
}) => {
  const isMobile = useIsMobile();

  const [openApprove, setOpenApprove] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const user = useLoggedInUser();

  const { mutate: submitReport, isPending: isSubmitting } = useSubmitClassReport();

  const handleApprove = () => {
    if (!classArmReportId) return;
    submitReport(
      { classArmReportId, status: "APPROVED" },
      {
        onSuccess: () => {
          toast.success("Result approved successfully");
          setOpenApprove(false);
        },
        onError: error => {
          toast.error(error?.message || "Failed to approve result");
        },
      },
    );
  };

  const handleReturn = () => {
    if (!classArmReportId) return;
    submitReport(
      { classArmReportId, status: "NOT_SUBMITTED" },
      {
        onSuccess: () => {
          toast.success("Result returned for correction");
          setOpenReturn(false);
        },
        onError: error => {
          toast.error(error?.message || "Failed to return result");
        },
      },
    );
  };

  useBreadcrumb([
    { label: "All Classes", url: "/staff/classes-and-subjects/all-classes" },
    { label: classArmName, url: "" },
    { label: "Class Report", url: "" },
  ]);

  const { data: terms, isPending: loadingTerms } = useGetTerms(user.schoolId);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);
  return (
    <div>
      {openApprove && (
        <ApproveModal
          openApproveModal={openApprove}
          setOpenApproveModal={setOpenApprove}
          classArmName={classArmName}
          onConfirm={handleApprove}
          isSubmitting={isSubmitting}
        />
      )}
      {openReturn && (
        <ReturnModal
          openReturnModal={openReturn}
          setOpenReturnModal={setOpenReturn}
          classArmName={classArmName}
          onConfirm={handleReturn}
          isSubmitting={isSubmitting}
        />
      )}
      <div className="border-border-default border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
          <div className="flex items-center justify-between gap-3 px-4 py-2 md:p-0">
            <h2 className="text-text-default text-lg font-semibold">{classArmName}</h2>

            {!terms || loadingTerms ? (
              <Skeleton className="bg-bg-input-soft h-9 w-40" />
            ) : (
              <Select
                onValueChange={value => {
                  const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                  setTermSelected(term);
                }}
              >
                <SelectTrigger className="border-border-darker h-8! w-fit border focus-visible:ring-0">
                  <Calendar fill="var(--color-icon-default-muted )" className="size-4" />
                  <span className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {termSelected?.term.toLowerCase()}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {terms.data.terms.map((term: Term) => (
                    <SelectItem key={term.termId} value={String(term.termId)} className="text-text-default text-sm font-medium capitalize">
                      {activeSession} {term.term.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
              {reportStatus !== "APPROVED" && (
                <Button
                  onClick={() => setOpenApprove(true)}
                  className="bg-bg-state-primary hover:bg-bg-state-primary/90! border-border-default text-text-white-default flex h-8 w-39.5 items-center gap-1 rounded-md border text-sm font-medium md:w-36.5"
                >
                  <Approve fill="var(--color-icon-white-default)" />
                  Approve Result
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={evt => evt.stopPropagation()}
                  className="bg-bg-state-soft b text-text-default flex h-8 w-8! cursor-pointer content-center items-center justify-center rounded-md focus-visible:ring-0 focus-visible:outline-none md:hidden"
                >
                  <MoreHorizontalIcon className="text-icon-default-muted size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
                  <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer gap-2.5 px-3 py-0.5" onClick={onExport}>
                    <ShareBox fill="var(--color-icon-default-muted)" /> Export
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {isMobile && (
          <div className="border-border-default hide-scrollbar flex w-screen gap-2 overflow-x-auto border-t px-4 py-2">
            <Button
              onClick={() => setActiveFilter("spreadsheet")}
              className={cn(
                "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                activeFilter === "spreadsheet" && "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!",
              )}
            >
              Spreadsheet
            </Button>

            {students.map(student => (
              <Button
                onClick={() => setActiveFilter(student.id.toString())}
                key={student.id}
                className={cn(
                  "bg-bg-state-soft text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
                  activeFilter === student.id.toString() && "bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover!",
                )}
              >
                {student.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
