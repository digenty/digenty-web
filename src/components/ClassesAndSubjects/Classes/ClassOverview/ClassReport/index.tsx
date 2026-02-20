"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentResult } from "@/components/StudentResult";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useGetAllTerms } from "@/hooks/queryHooks/useTerm";
import { useGetClassReport } from "@/hooks/queryHooks/useClass";

import { Terms } from "@/api/types";
import { StudentRow } from "./students";
import { ClassReportFooter } from "./ClassReportFooter";
import { ClassReportHeader } from "./ClassReportHeader";
import { createColumns } from "./SpreadsheetColumns";
import { createPromotionColumns } from "./PromotionColumn";
import { SpreadsheetMobileCard } from "./SpreadsheetMobileCard";
import { PromotionMobileCard } from "./PromotionMobileCard";

const PAGE_SIZE = 15;
const ARM_ID = 19;

export const ClassReport = () => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StudentRow[]>([]);
  const [activeFilter, setActiveFilter] = useState("spreadsheet");
  const [collapsedStudentId, setCollapsedStudentId] = useState<string>();
  const [selectedTermId, setSelectedTermId] = useState<number | undefined>();

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: "/classes-and-subjects" },
    { label: "My Class", url: "/classes-and-subjects/classes/3" },
    { label: "Class Report", url: "" },
  ]);

  const { data: terms, isFetching: isLoadingTerm } = useGetAllTerms(schoolId!);
  const termList = terms?.terms;
  const activeTerm = termList?.find((t: Terms) => t.isActiveTerm);

  useEffect(() => {
    if (activeTerm?.termId && !selectedTermId) {
      setSelectedTermId(activeTerm.termId);
    }
  }, [activeTerm, selectedTermId]);

  const { data: classReportData, isLoading: isLoadingReport } = useGetClassReport(ARM_ID, selectedTermId ?? activeTerm?.termId ?? 0);

  const transformedStudents: StudentRow[] = useMemo(() => {
    if (!classReportData?.classArmStudentReports) return [];

    const selectedTerm = termList?.find(t => t.termId === selectedTermId);

    return classReportData.classArmStudentReports.map((student, index) => ({
      id: `${index + 1}`,
      serial: index + 1,
      name: student.studentName,
      avatar: "/avatar.png",
      terms: [
        {
          term: selectedTerm?.term ?? "First Term",
          subjects: student.subjectScores.map(sub => ({
            subjectId: sub.subjectName,
            subjectName: sub.subjectName,
            score: sub.score,
          })),
          totalPercentage: student.percentage,
          position: student.position,
        },
      ],
    }));
  }, [classReportData, selectedTermId, termList]);

  const selectedTermName = termList?.find(t => t.termId === selectedTermId)?.term ?? "First Term";

  const handleTermChange = (termId: string) => {
    setSelectedTermId(Number(termId));
  };

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
        termSelected={selectedTermId?.toString() ?? ""}
        setTermSelected={handleTermChange}
        terms={termList ?? []}
        isLoadingTerm={isLoadingTerm}
      />

      <div className="px-4 md:px-8">
        {activeFilter === "spreadsheet" && (
          <div className="hidden overflow-x-auto pt-6 pb-24 md:block">
            {!classReportData || isLoadingReport ? (
              <Skeleton className="bg-bg-input-soft h-100 w-full" />
            ) : (
              <DataTable
                columns={createColumns(transformedStudents, selectedTermName)}
                data={transformedStudents}
                totalCount={transformedStudents.length}
                page={page}
                setCurrentPage={setPage}
                pageSize={PAGE_SIZE}
                clickHandler={row => console.log(row)}
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
            {!classReportData || isLoadingReport ? (
              <Skeleton className="bg-bg-input-soft h-100 w-full" />
            ) : (
              <DataTable
                columns={createPromotionColumns(transformedStudents)}
                data={transformedStudents}
                totalCount={transformedStudents.length}
                page={page}
                setCurrentPage={setPage}
                pageSize={PAGE_SIZE}
                clickHandler={row => console.log(row)}
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
          <div className="max-w-[678px] pt-6">
            <StudentResult />
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
                activeStudent={collapsedStudentId}
                setActiveStudent={setCollapsedStudentId}
                selectedTermId={selectedTermId}
              />
            );
          }
          if (activeFilter === "promotion") {
            return (
              <PromotionMobileCard key={student.id} student={student} activeStudent={collapsedStudentId} setActiveStudent={setCollapsedStudentId} />
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
};
