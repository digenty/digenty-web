"use client";

import { DataTable } from "@/components/DataTable";
import Question from "@/components/Icons/Question";
import ShareBox from "@/components/Icons/ShareBox";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { viewScoreColumns } from "./Columns";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import ArrowUp from "@/components/Icons/ArrowUp";
import ArrowDown from "@/components/Icons/ArrowDown";
import { useSearchParams } from "next/navigation";
import { useViewScore } from "@/hooks/queryHooks/useScore";
import { useGetAllTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Terms } from "@/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

export const ViewScore = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;
  console.log("schoolid", schoolId);
  const searchParams = useSearchParams();
  const subjectId = Number(searchParams.get("subjectId"));
  const armId = Number(searchParams.get("armId"));
  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();
  const [selectedTermId, setSelectedTermId] = useState<number | undefined>();
  const pageSize = 15;
  const { data: terms, isFetching: isLoadingTerm } = useGetAllTerms(schoolId!);

  const termList: Terms[] = terms?.data?.terms ?? [];
  const activeTerm = termList.find((t: Terms) => t.isActiveTerm);
  const { data: viewScoreData, isLoading: isLoadingScores, isError } = useViewScore(subjectId, armId, selectedTermId);

  const studentsScores: ScoreType[] = viewScoreData?.data?.data ?? [];

  useEffect(() => {
    if (activeTerm?.termId && !selectedTermId) {
      setSelectedTermId(activeTerm.termId);
    }
  }, [activeTerm?.termId]);

  const selectedTermName = termList.find((t: Terms) => t.termId === selectedTermId)?.term ?? "Select Term";

  const handleTermChange = (termId: string) => {
    setSelectedTermId(Number(termId));
    // setPage(1);
  };

  return (
    <div>
      <>
        <div className="border-border-default border-b md:p-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-2">
            <div className="flex items-center gap-3">
              <h2 className="text-text-default truncate px-4 py-2 text-lg font-semibold md:p-0">{/* {classArm}, {subjectName} */}</h2>

              {isLoadingTerm ? (
                <Skeleton className="bg-bg-input-soft w-30" />
              ) : (
                <Select value={selectedTermId?.toString() ?? ""} onValueChange={handleTermChange} disabled={isLoadingTerm}>
                  <SelectTrigger className="border-border-darker h-8! w-auto border">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                        <span className="text-text-default text-sm font-semibold">{selectedTermName} TERM</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {termList.map((term: Terms) => (
                      <SelectItem key={term.termId} value={term.termId.toString()} className="text-text-default text-sm font-semibold">
                        {term.term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="border-border-default overflow-x-auto border-t px-4 py-2 md:border-none md:p-0">
              <div className="flex items-center gap-2 md:gap-1">
                <Button
                  disabled={isError || isLoadingScores || studentsScores.length === 0}
                  size="sm"
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-22 items-center gap-1 border text-sm"
                >
                  <ShareBox fill="var(--color-icon-default-muted)" /> Export
                </Button>

                <Button
                  disabled={isError || isLoadingScores || studentsScores.length === 0}
                  size="sm"
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto cursor-not-allowed items-center justify-between gap-1 border text-sm"
                >
                  <Question fill="var(--color-icon-default-muted)" /> Requested Edit Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>

      <div className="p-2">{isLoadingScores && <Skeleton className="bg-bg-input-soft h-100 w-full" />}</div>

      {isError && (
        <div className="flex h-80 items-center justify-center">
          {" "}
          <ErrorComponent
            title="Could not get Students Scores"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {!isLoadingScores && !isError && studentsScores.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Students" description="No student has been added yet" buttonText="Go to the Home page" />
        </div>
      )}

      {/* Table */}
      {!isLoadingScores && !isError && studentsScores.length > 0 && (
        <div className="">
          <div className="hidden md:block">
            <DataTable
              pageSize={pageSize}
              clickHandler={() => {}}
              rowSelection={{}}
              setRowSelection={() => {}}
              onSelectRows={() => {}}
              columns={viewScoreColumns()}
              data={studentsScores}
              totalCount={studentsScores.length}
              page={page}
              setCurrentPage={setPage}
              fullBorder
              showPagination={false}
              classNames={{
                tableBodyCell: "text-center py-0 pr-2",
                tableHeadCell: "pr-2",
                tableHead: "bg-bg-subtle h-13.5",
              }}
            />
          </div>

          <ul className="flex flex-col gap-4 md:hidden">
            {studentsScores.map((score: ScoreType) => (
              <li key={score.studentId} className="border-border-default w-full rounded-sm border">
                <div
                  onClick={() => setActiveStudent(prev => (prev === score.studentId ? undefined : score.studentId))}
                  aria-expanded={activeStudent === score.studentId}
                  className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10" />
                    <div className="space-y-1.5 text-left">
                      <div className="text-text-default text-sm font-medium">{score.studentName}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-text-default text-xs font-normal">{score.totalScore}</div>
                        <Badge className="text-text-subtle border-border-default bg-bg-badge-default h-4 w-4 rounded-md py-2 text-xs font-medium">
                          {score.grade}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    {activeStudent === score.studentId ? (
                      <ArrowUp fill="var(--color-icon-default-muted)" />
                    ) : (
                      <ArrowDown fill="var(--color-icon-default-muted)" />
                    )}
                  </div>
                </div>

                <div
                  className={`text-sm transition-all duration-200 ${
                    activeStudent === score.studentId ? "border-border-default flex max-h-96 flex-col border-t" : "hidden"
                  }`}
                >
                  {[
                    { label: "CA 1", value: score.CA1 },
                    { label: "CA 2", value: score.CA2 },
                    { label: "Exam Score", value: score.examScore },
                    { label: "Total", value: score.totalScore },
                    { label: "Grade", value: score.grade },
                    { label: "Remark", value: score.remark },
                  ].map(({ label, value }, idx, arr) => (
                    <div key={label} className={`flex text-center ${idx < arr.length - 1 ? "border-border-default border-b" : ""}`}>
                      <span className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
                        {label}
                      </span>
                      <div className="flex h-12 flex-1 items-center justify-center px-2">{value}</div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
