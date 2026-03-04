"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { DataTable } from "@/components/DataTable";
import { StudentResult } from "@/components/StudentResult";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetClassCumulativeReport, useGetClassReport } from "@/hooks/queryHooks/useClass";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

import { Term } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetStudentReport } from "@/hooks/queryHooks/useStudent";
import { usePathname, useSearchParams } from "next/navigation";
import { ClassReportFooter } from "./ClassReportFooter";
import { ClassReportHeader } from "./ClassReportHeader";
import { createPromotionColumns } from "./PromotionColumn";
import { PromotionMobileCard } from "./PromotionMobileCard";
import { createColumns } from "./SpreadsheetColumns";
import { SpreadsheetMobileCard } from "./SpreadsheetMobileCard";
import { StudentRow } from "./students";

type ClassArmStudentReport = {
  studentId: number;
  studentName: string;
  subjectScores: { subjectName: string; score: number }[];
  total: number;
  position: number;
  percentage: number;
};

export const ClassReport = () => {
  const path = usePathname();
  const params = useSearchParams();
  const armId = path.split("/")[4];
  const classArmName = params.get("classArmName")?.replace("-", " ") || "";

  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StudentRow[]>([]);
  const [activeFilter, setActiveFilter] = useState("spreadsheet");
  const [activeStudentId, setActiveStudentId] = useState<number>();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const pageSize = 100;

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: "/classes-and-subjects" },
    { label: "My Class", url: `/classes-and-subjects/classes/overview/${armId}?classArmName=${classArmName}` },
    { label: "Class Report", url: "" },
  ]);

  const { data: classReportData, isLoading: isLoadingReport, isError: isErrorReport } = useGetClassReport(Number(armId), termSelected?.termId);
  const {
    data: classCumulativeReportData,
    isLoading: isLoadingCumulativeReport,
    isError: isErrorCumulativeReport,
  } = useGetClassCumulativeReport(Number(armId), activeFilter);
  const {
    data: studentReportData,
    isPending: loadingStudentReport,
    isError: isErrorStudentReport,
  } = useGetStudentReport({ studentId: Number(activeFilter), termId: termSelected?.termId, armId: Number(armId) });

  const transformedStudents: StudentRow[] = useMemo(() => {
    if (!classReportData?.data?.classArmStudentReports) return [];

    return classReportData.data.classArmStudentReports.map((student: ClassArmStudentReport, index: number) => ({
      id: student.studentId,
      serial: index + 1,
      name: student.studentName,
      avatar: "/avatar.png",
      terms: [
        {
          term: termSelected?.term ?? "FIRST",
          subjects: student.subjectScores.map(sub => ({
            subjectId: sub.subjectName,
            subjectName: sub.subjectName,
            score: sub.score,
          })),
          totalScore: student.total,
          totalPercentage: student.percentage,
          position: student.position,
        },
      ],
    }));
  }, [classReportData]);

  const scrollLeft = () => {
    footerRef.current?.scrollBy?.({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    footerRef.current?.scrollBy?.({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ClassReportHeader
        students={transformedStudents}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        classArmName={classArmName}
      />

      {isErrorReport && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get class report"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}

      {isLoadingReport && (
        <div className="flex p-4 md:p-8">
          <Skeleton className="bg-bg-input-soft h-100 w-full" />
        </div>
      )}

      {!isLoadingReport && !isErrorReport && transformedStudents.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Class Report" description="No class report has been generated yet" />
        </div>
      )}

      {!isLoadingReport && !isErrorReport && transformedStudents.length > 0 && (
        <>
          <div
            className={cn(
              "overflow-y-auto px-4 md:h-screen md:px-8",
              (activeFilter === "spreadsheet" || activeFilter === "promotion") && "hidden md:block",
            )}
          >
            {activeFilter === "spreadsheet" && (
              <div className="hidden overflow-x-auto pt-6 pb-24 md:block">
                {!classReportData || isLoadingReport ? (
                  <Skeleton className="bg-bg-input-soft h-100 w-full" />
                ) : (
                  <DataTable
                    columns={createColumns(transformedStudents, termSelected?.term ?? "")}
                    data={transformedStudents}
                    totalCount={transformedStudents.length}
                    page={page}
                    setCurrentPage={setPage}
                    pageSize={pageSize}
                    showPagination={false}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onSelectRows={setSelectedRows}
                    fullBorder
                    classNames={{
                      tableHeadCell: "text-center pr-2 w-34",
                      tableBodyCell: "text-center pr-2 w-34",
                      tableRow: "h-14",
                      table: "table-fixed",
                    }}
                  />
                )}
              </div>
            )}

            {activeFilter === "promotion" && (
              <div className="hidden overflow-x-auto pt-6 pb-24 md:block">
                {isErrorCumulativeReport ? (
                  <ErrorComponent
                    title="Could not get Student's report"
                    description="This is our problem, we are looking into it so as to serve you better"
                    buttonText="Go to the Home page"
                  />
                ) : !classCumulativeReportData || isLoadingCumulativeReport ? (
                  <Skeleton className="bg-bg-input-soft h-100 w-full" />
                ) : (
                  <DataTable
                    columns={createPromotionColumns(transformedStudents)}
                    data={transformedStudents}
                    totalCount={transformedStudents.length}
                    page={page}
                    setCurrentPage={setPage}
                    pageSize={pageSize}
                    showPagination={false}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onSelectRows={setSelectedRows}
                    fullBorder
                    classNames={{
                      tableHeadCell: "text-center pr-2 w-34",
                      tableBodyCell: "text-center pr-2 w-34",
                      tableRow: "h-14",
                      table: "table-fixed",
                    }}
                  />
                )}
              </div>
            )}

            {activeFilter !== "spreadsheet" && activeFilter !== "promotion" && (
              <div>
                {isErrorStudentReport ? (
                  <div className="flex h-screen items-center justify-center">
                    <ErrorComponent
                      title="Could not get Student's report"
                      description="This is our problem, we are looking into it so as to serve you better"
                      buttonText="Go to the Home page"
                    />
                  </div>
                ) : loadingStudentReport && !studentReportData ? (
                  <div className="pt-6">
                    <Skeleton className="bg-bg-input-soft h-screen w-[678px]" />
                  </div>
                ) : (
                  <div className="max-w-[678px] pt-6">
                    {/* TODO: Pass active student here */}
                    <StudentResult studentReport={studentReportData?.data} termSelected={termSelected} />
                  </div>
                )}
              </div>
            )}
          </div>

          {!isMobile && (
            <ClassReportFooter students={transformedStudents} activeFilter={activeFilter} setActiveFilter={setActiveFilter} footerRef={footerRef} />
          )}

          {!isMobile && (
            <div className="bg-bg-card fixed right-0 bottom-0 flex h-15 w-28 py-4">
              <div className="border-border-default mr-2 border-l" />
              <Button
                onClick={scrollLeft}
                className="bg-bg-state-ghost hover:bg-bg-state-ghost-hover! flex size-8 items-center justify-center rounded-md"
              >
                <ChevronLeft className="text-icon-default-subtle size-5" />
              </Button>
              <Button
                onClick={scrollRight}
                className="bg-bg-state-ghost hover:bg-bg-state-ghost-hover! flex size-8 items-center justify-center rounded-md"
              >
                <ChevronRight className="text-icon-default-subtle size-5" />
              </Button>
            </div>
          )}

          <ul className="flex flex-col gap-3 px-4 py-6 pb-8 md:hidden">
            {transformedStudents.map(student => {
              if (activeFilter === "spreadsheet") {
                return (
                  <SpreadsheetMobileCard
                    key={student.id}
                    student={student}
                    activeStudent={activeStudentId}
                    setActiveStudent={setActiveStudentId}
                    selectedTerm={termSelected?.term ?? ""}
                  />
                );
              }
              if (activeFilter === "promotion") {
                return (
                  <PromotionMobileCard key={student.id} student={student} activeStudent={activeStudentId} setActiveStudent={setActiveStudentId} />
                );
              }
              return null;
            })}
          </ul>
        </>
      )}
    </div>
  );
};
