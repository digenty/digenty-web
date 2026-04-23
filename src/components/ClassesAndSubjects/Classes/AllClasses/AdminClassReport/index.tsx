"use client";
import { Term } from "@/api/types";
import { useGetClassReport } from "@/hooks/queryHooks/useClass";
import { useGetStudentReport } from "@/hooks/queryHooks/useStudent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { StudentRow } from "../../ClassOverview/ClassReport/students";
import { ReportHeader } from "./ReportHeader";

import { DataTable } from "@/components/DataTable";
import { StudentResult } from "@/components/StudentResult";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export-utils";
import { toOrdinal } from "@/components/ClassesAndSubjects/utils";

import { ClassReportFooter } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassReport/ClassReportFooter";
import { createColumns } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassReport/SpreadsheetColumns";
import { SpreadsheetMobileCard } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassReport/SpreadsheetMobileCard";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

// export const exportToPDF = async (elementId: string, filename: string) => {
//   const element = document.getElementById(elementId);
//   if (!element) {
//     console.error(`Element with id ${elementId} not found`);
//     return;
//   }

//   const { default: html2canvas } = await import("html2canvas");
//   const { jsPDF } = await import("jspdf");

//   try {
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "px",
//       format: [canvas.width / 2, canvas.height / 2],
//     });

//     pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
//     pdf.save(filename);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//   }
// };

type ClassArmStudentReport = {
  studentId: number;
  studentName: string;
  subjectScores: { subjectName: string; score: number }[];
  total: number;
  position: number;
  percentage: number;
};

const ClassReport = () => {
  const pathname = usePathname();
  const armId = pathname.split("/")[6];
  const params = useSearchParams();
  const classArmName = params.get("classArmName")?.replaceAll("-", " ") || "";

  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("spreadsheet");
  const [activeStudentId, setActiveStudentId] = useState<number>();
  const pageSize = 100;

  const {
    data: classReportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    error: classReportError,
  } = useGetClassReport(Number(armId), termSelected?.termId);
  const classArmReportId = classReportData?.data?.classArmReportId;

  const {
    data: studentReportData,
    isPending: loadingStudentReport,
    isError: isErrorStudentReport,
    error: studentReportError,
  } = useGetStudentReport({ studentId: Number(activeFilter), termId: termSelected?.termId, armId: Number(armId) });

  const transformedStudents: StudentRow[] = useMemo(() => {
    if (!classReportData?.data?.classArmStudentReports) return [];
    return classReportData.data.classArmStudentReports.map((student: ClassArmStudentReport, index: number) => ({
      id: student.studentId,
      serial: index + 1,
      name: student.studentName,
      avatar: "/staff/avatar.png",
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
  }, [classReportData, termSelected]);

  const scrollLeft = () => {
    footerRef.current?.scrollBy?.({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    footerRef.current?.scrollBy?.({ left: 200, behavior: "smooth" });
  };

  const handleExport = () => {
    if (activeFilter === "spreadsheet") {
      if (!transformedStudents.length) return;
      const firstStudent = transformedStudents[0];
      const termData = firstStudent.terms.find(t => t.term === (termSelected?.term ?? ""));
      if (!termData) return;

      const subjectHeaders = termData.subjects.map(s => s.subjectName);
      const headers = ["S/N", "Student Name", ...subjectHeaders, "Total", "Percentage", "Position"];

      const csvRows = transformedStudents.map((student, index) => {
        const studentTermData = student.terms.find(t => t.term === (termSelected?.term ?? ""));
        const subjectScores = studentTermData?.subjects.map(s => s.score) ?? [];
        return [
          index + 1,
          student.name,
          ...subjectScores,
          studentTermData?.totalScore ?? 0,
          `${studentTermData?.totalPercentage ?? 0}%`,
          toOrdinal(studentTermData?.position ?? 0),
        ];
      });

      exportToCSV(`ClassReport_Spreadsheet_${classArmName}_${termSelected?.term}.csv`, headers, csvRows);
    } else if (activeFilter === "promotion") {
      if (!transformedStudents.length) return;
      const termsOptions = ["FIRST", "SECOND", "THIRD"];
      const termHeaders = termsOptions.map(t => `${t === "FIRST" ? "1st" : t === "SECOND" ? "2nd" : "3rd"} Term %`);
      const headers = ["S/N", "Student Name", ...termHeaders, "Cumulative %"];

      const csvRows = transformedStudents.map((student, index) => {
        const termScores = termsOptions.map(term => {
          const tData = student.terms.find(t => t.term === term);
          return tData?.totalPercentage ?? 0;
        });
        const cumulative = student.terms.length > 0 ? student.terms.reduce((acc, t) => acc + t.totalPercentage, 0) / student.terms.length : 0;

        return [index + 1, student.name, ...termScores, Math.floor(cumulative)];
      });

      exportToCSV(`ClassReport_Promotion_${classArmName}.csv`, headers, csvRows);
    } else {
      // PDF Export for individual student
      const studentName = studentReportData?.data?.studentName || "Student_Report";
      // exportToPDF("student-report", `Report_${studentName.replaceAll(" ", "_")}.pdf`);
    }
  };

  return (
    <div>
      <ReportHeader
        termSelected={termSelected}
        setTermSelected={setTermSelected}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        onExport={handleExport}
        classArmName={classArmName}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        students={transformedStudents}
        classArmReportId={classArmReportId}
        reportStatus={classReportData?.data?.status}
      />

      <div className="relative">
        {isErrorReport && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get class report"
              description={`${classReportError?.message || "This is our problem, we are looking into it so as to serve you better"}`}
              buttonText="Go to the Home page"
            />
          </div>
        )}

        {(isLoadingReport || (!classReportData && !isErrorReport)) && (
          <div className="flex p-4 md:p-8">
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          </div>
        )}

        {!isLoadingReport && !isErrorReport && classReportData && transformedStudents.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Class Report" description="No class report has been generated yet" />
          </div>
        )}

        {!isLoadingReport && !isErrorReport && classReportData && transformedStudents.length > 0 && (
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
                      fullBorder
                      classNames={{
                        tableHeadCell: "text-center pr-2 w-34",
                        tableBodyCell: "text-center pr-2 w-34",
                        tableRow: "h-14",
                        // table: "table-fixed",
                      }}
                    />
                  )}
                </div>
              )}

              {activeFilter !== "spreadsheet" && (
                <div>
                  {isErrorStudentReport ? (
                    <div className="flex h-screen items-center justify-center">
                      <ErrorComponent
                        title="Could not get Student's report"
                        description={`${studentReportError?.message || "This is our problem, we are looking into it so as to serve you better"}`}
                        buttonText="Go to the Home page"
                      />
                    </div>
                  ) : loadingStudentReport && !studentReportData ? (
                    <div className="pt-6">
                      <Skeleton className="bg-bg-input-soft h-screen w-[678px]" />
                    </div>
                  ) : (
                    <div className="max-w-[678px] pt-6 pb-10">
                      {/* TODO: Pass active student here */}
                      <StudentResult studentReport={studentReportData?.data} termSelected={termSelected} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isMobile && (
              <ClassReportFooter
                students={transformedStudents}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                footerRef={footerRef}
                type="admin"
              />
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
                return null;
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ClassReport;
