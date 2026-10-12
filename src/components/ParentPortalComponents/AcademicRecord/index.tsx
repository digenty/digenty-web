"use client";

import { useEffect, useState } from "react";
import { StudentFilter } from "../FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetStudentAcademicRecord } from "@/hooks/queryHooks/useParentStudents";
import { StudentResult } from "@/components/StudentResult";
import { TermLookup } from "@/api/parent-lookup";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { useGetParentMidtermReport } from "@/hooks/queryHooks/useMidterm";
import { useGetActiveParentPortalTerm, useGetParentPortalTerms } from "@/hooks/queryHooks/useParentLookup";
import { MidtermReportView } from "@/components/MidtermReport/MidtermReportView";
import { cn } from "@/lib/utils";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useStudentFilterStore } from "@/store/parent";
import { Calendar } from "@digenty/icons";

export const AcademicRecord = () => {
  const user = useLoggedInUser();
  const { selectedStudentId } = useStudentFilterStore();

  const [termSelected, setTermSelected] = useState<TermLookup | null>(null);
  const [view, setView] = useState<"term" | "midterm">("term");

  const { data: activeTerm, isLoading: loadingActiveTerm } = useGetActiveParentPortalTerm();
  const { data: terms, isLoading: loadingTerms } = useGetParentPortalTerms(activeTerm?.academicSessionId);
  const {
    data: studentReportData,
    isLoading: loadingStudentReport,
    isError: isErrorStudentReport,
    error: studentReportError,
  } = useGetStudentAcademicRecord(selectedStudentId, termSelected?.id);
  // Only fetched once the mid-term tab is opened. The API answers 400 until the school publishes it.
  const {
    data: midtermReport,
    isLoading: loadingMidterm,
    isError: isErrorMidterm,
    error: midtermError,
  } = useGetParentMidtermReport(view === "midterm" ? selectedStudentId : undefined, termSelected?.id);
  const midtermErrorMessage = (midtermError as { message?: string } | null)?.message ?? "Mid-term report has not been published yet";
  const studentReportErrorMessage =
    (studentReportError as { message?: string } | null)?.message ?? "This is our problem, we are looking into it so as to serve you better";
  useEffect(() => {
    if (activeTerm && !termSelected) {
      setTermSelected(activeTerm);
    }
  }, [activeTerm, termSelected]);
  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Academic Record</div>
          <div className="text-text-muted text-xs">Review student&apos;s result</div>
        </div>
        <div className="hidden md:block">
          <StudentFilter parentId={user?.id} />
        </div>
      </div>

      <div className="bg-bg-state-soft flex w-fit items-center gap-1 rounded-full p-0.5">
        {(
          [
            { id: "term", label: "Term Report" },
            { id: "midterm", label: "Mid-term Report" },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setView(tab.id)}
            className={cn(
              "h-8 rounded-full px-4 text-sm font-medium whitespace-nowrap",
              view === tab.id ? "bg-bg-state-secondary border-border-darker text-text-default border shadow-sm" : "text-text-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {(loadingActiveTerm || loadingTerms) && <Skeleton className="bg-bg-input-soft h-9 w-50 rounded-md" />}
        {!loadingActiveTerm && !loadingTerms && terms && (
          <Select
            value={termSelected ? String(termSelected.id) : ""}
            onValueChange={value => {
              const term = terms.find(t => String(t.id) === value);
              setTermSelected(term ?? null);
            }}
          >
            <SelectTrigger className="border-border-darker h-8! w-auto border">
              <SelectValue className="text-text-default flex font-medium">
                <Calendar className="text-icon-black-muted size-4" />
                <p className="text-text-default text-sm">
                  {termSelected ? `${termSelected.academicSessionName} ${termSelected.term.toLowerCase()}` : "Select Term"}
                </p>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default border">
              {terms?.map(t => (
                <SelectItem key={t.id} className="text-text-default" value={String(t.id)}>
                  {t.academicSessionName} {t.term.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!selectedStudentId && <PageEmptyState title="No Student Selected" description="Select a student above to view their academic record" />}

      {view === "midterm" && selectedStudentId && (
        <>
          {loadingMidterm && <Skeleton className="bg-bg-input-soft h-full w-full rounded-md" />}
          {isErrorMidterm && <PageEmptyState title="Mid-term report unavailable" description={midtermErrorMessage} />}
          {midtermReport && <MidtermReportView report={midtermReport} />}
        </>
      )}

      {view === "term" && selectedStudentId && loadingStudentReport && <Skeleton className="bg-bg-input-soft h-full w-full rounded-md" />}

      {view === "term" && selectedStudentId && isErrorStudentReport && (
        <div className="flex h-screen items-center justify-center">
          <ErrorComponent title="Could not get Student's report" description={studentReportErrorMessage} />
        </div>
      )}

      {view === "term" && selectedStudentId && !loadingStudentReport && !isErrorStudentReport && !studentReportData && (
        <PageEmptyState title="Could not get Student's report" description="No report available for student" />
      )}

      {view === "term" && selectedStudentId && !loadingStudentReport && !isErrorStudentReport && studentReportData && (
        <StudentResult studentReport={studentReportData} termSelected={termSelected} />
      )}
    </div>
  );
};
