"use client";

import { Assessment, Term } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import Calendar from "@/components/Icons/Calendar";
import Question from "@/components/Icons/Question";
import ShareBox from "@/components/Icons/ShareBox";
import { MobileDrawer } from "@/components/MobileDrawer";
import { ScoreType } from "@/components/ScoreViewBySubject/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useViewScore } from "@/hooks/queryHooks/useScore";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { exportToCSV } from "@/lib/export-utils";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RequestEdit from "../../../RequestEditAccess";
import { SubjectReportPermissionWrapper } from "../../SubjectReportPermissionWrapper";
import { viewScoreColumns } from "./Columns";
import { MobileCard } from "./MobileCard";

export type StudentResult = {
  studentId: number;
  studentName: string;
  total: number;
  grade: string;
  remark: string;
  [key: string]: string | number;
};

export const ViewScore = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const subjectId = pathname.split("/")[4];
  const classId = pathname.split("/")[6];
  const armId = pathname.split("/")[8];
  const classArmName = searchParams.get("classArmName")?.replaceAll("-", " ");
  const subjectName = searchParams.get("subjectName")?.replaceAll("-", " ");

  const [page, setPage] = useState(1);
  const [activeStudent, setActiveStudent] = useState<number>();
  const [termSelected, setTermSelected] = useState<Term | null>();
  const [activeSession, setActiveSession] = useState<string | null>();
  const [openRequest, setOpenRequest] = useState<boolean>(false);
  const [termFilterOpen, setTermFilterOpen] = useState<boolean>(false);

  const pageSize = 15;

  const { data: terms, isFetching: isLoadingTerm } = useGetTerms(schoolId!);
  const { data: viewScoreData, isLoading: isLoadingScores, isError } = useViewScore(Number(subjectId), Number(armId), termSelected?.termId);

  const studentsScores: ScoreType[] = viewScoreData?.data?.response?.content ?? [];

  useBreadcrumb([
    { label: "Classes & Subjects", url: "/staff/classes-and-subjects" },
    { label: "Subjects", url: "/staff/classes-and-subjects?tab=Subjects" },
    { label: "View Scores", url: "" },
  ]);

  useEffect(() => {
    if (terms) {
      const activeTerm = terms.data.terms.find((term: Term) => term.isActiveTerm);
      setTermSelected(activeTerm);
      setActiveSession(terms.data.academicSessionName);
    }
  }, [setActiveSession, setTermSelected, terms]);

  const assessmentHeader = Object.values((studentsScores[0]?.assessmentScores ?? {}) as Record<string, Assessment>).map(
    (assessment: Assessment) => assessment.assessmentName,
  );

  const transformAssessmentData = (data: ScoreType[]) => {
    return data.map(student => {
      const assessmentScores = Object.values(student.assessmentScores).reduce(
        (acc, a) => {
          const key = a.assessmentName;
          acc[key] = a.score;
          return acc;
        },
        {} as Record<string, number>,
      );

      return {
        studentId: student.studentId,
        studentName: student.studentName,
        ...assessmentScores,
        total: student.total,
        grade: student.grade ?? "-",
        remark: student.remark ?? "Poor",
      } as StudentResult;
    });
  };

  const handleExport = () => {
    const headers = ["S/N", "Student Name", ...assessmentHeader, "Total", "Grade", "Remark"];
    const rows = transformAssessmentData(studentsScores);

    const csvRows = rows.map((student: StudentResult, index: number) => {
      const assessments = assessmentHeader.map(headerName => student[headerName] ?? 0);
      return [index + 1, student.studentName, ...assessments, student.total, student.grade, student.remark];
    });

    const filename = `Scores_${subjectName?.replaceAll(" ", "_")}_${classArmName?.replaceAll(" ", "_")}.csv`;
    exportToCSV(filename, headers, csvRows);
  };

  return (
    <SubjectReportPermissionWrapper subjectId={Number(subjectId)} isLoading={isLoadingScores} type="view">
      {openRequest && (
        <RequestEdit open={openRequest} onOpenChange={setOpenRequest} armId={Number(armId)} subjectId={Number(subjectId)} classId={Number(classId)} />
      )}
      <>
        <div className="border-border-default border-b md:p-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:px-8 md:py-2">
            <div className="md:justify-auto flex items-center justify-between gap-3">
              <h2 className="text-text-default w-60 truncate px-4 py-2 text-base font-semibold md:w-fit md:p-0 md:text-lg">
                {classArmName}, <span className="capitalize">{subjectName?.toLowerCase()}</span>
              </h2>

              <div className="pr-4">
                <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setTermFilterOpen(true)}>
                  <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
                </Button>
                {!terms || isLoadingTerm ? (
                  <Skeleton className="bg-bg-input-soft h-8 w-41" />
                ) : (
                  <Select
                    onValueChange={value => {
                      const term = terms.data.terms?.find((term: Term) => term.termId === Number(value));
                      setTermSelected(term);
                    }}
                  >
                    <SelectTrigger className="border-border-darker hidden h-8! w-fit border focus-visible:ring-0 md:flex">
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

                <MobileDrawer open={termFilterOpen} setIsOpen={setTermFilterOpen} title="Select Term">
                  <div className="flex w-full flex-col gap-4 px-4 py-4">
                    {!terms || isLoadingTerm ? (
                      <Skeleton className="bg-bg-input-soft h-8 w-41" />
                    ) : (
                      <div className="bg-bg-card border-border-default flex flex-col items-start">
                        {terms.data.terms.map((term: Term) => (
                          <Button
                            key={term.termId}
                            onClick={() => {
                              setTermSelected(term);
                              setTermFilterOpen(false);
                            }}
                            className="text-text-default pl-0 text-sm font-medium capitalize"
                          >
                            {activeSession} {term.term.toLowerCase()}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </MobileDrawer>
              </div>
            </div>

            <div className="border-border-default overflow-x-auto border-t px-4 py-2 md:border-none md:p-0">
              <div className="flex items-center gap-2 md:gap-1">
                <Button
                  disabled={isError || isLoadingScores || studentsScores.length === 0}
                  onClick={handleExport}
                  size="sm"
                  className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-22 items-center gap-1 border text-sm"
                >
                  <ShareBox fill="var(--color-icon-default-muted)" /> Export
                </Button>

                {user && !user.isMain && !user.isAdmin && (
                  <Button
                    disabled={isError || isLoadingScores || studentsScores.length === 0}
                    onClick={() => setOpenRequest(true)}
                    size="sm"
                    className="border-border-default bg-bg-state-secondary text-text-default flex h-8 w-auto items-center justify-between gap-1 border text-sm"
                  >
                    <Question fill="var(--color-icon-default-muted)" /> Request Edit Access
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>

      {isError && !isLoadingScores && !viewScoreData && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Students Scores"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      <div className="p-2">{isLoadingScores && <Skeleton className="bg-bg-input-soft h-100 w-full" />}</div>

      {!isLoadingScores && !isError && viewScoreData?.data?.response?.content.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Students" description="No student has been added yet" buttonText="Go to the Home page" />
        </div>
      )}

      {/* Table */}
      {!isLoadingScores && !isError && studentsScores.length > 0 && (
        <div className="">
          <div className="hidden px-4 md:block md:px-8">
            <DataTable
              pageSize={pageSize}
              columns={viewScoreColumns(assessmentHeader)}
              data={transformAssessmentData(studentsScores)}
              totalCount={studentsScores.length}
              page={page}
              setCurrentPage={setPage}
              fullBorder
              showPagination={false}
              classNames={{
                tableBodyCell: "text-center pr-2 py-4",
                tableHeadCell: "pr-2",
                tableHead: "bg-bg-subtle h-13.5",
              }}
            />
          </div>

          <ul className="flex flex-col gap-4 px-4 md:hidden">
            {transformAssessmentData(studentsScores).map((score: StudentResult) => (
              <MobileCard
                key={score.studentName}
                student={score}
                activeStudent={activeStudent}
                assessmentHeader={assessmentHeader}
                setActiveStudent={setActiveStudent}
              />
            ))}
          </ul>
        </div>
      )}
    </SubjectReportPermissionWrapper>
  );
};
