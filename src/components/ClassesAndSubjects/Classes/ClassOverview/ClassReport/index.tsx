"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

import { DataTable } from "@/components/DataTable";
import { StudentResult } from "@/components/StudentResult";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { toOrdinal } from "@/components/ClassesAndSubjects/utils";
import { useGetClassCumulativeReport, useGetClassReport } from "@/hooks/queryHooks/useClass";
import { useGetLevelResultSettings } from "@/hooks/queryHooks/useLevel";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { exportToCSV } from "@/lib/export-utils";
import { cn } from "@/lib/utils";

import { StudentCumulative, Term } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetStudentReport } from "@/hooks/queryHooks/useStudent";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ClassPermissionWrapper } from "../../ClassPermissionWrapper";
import { ClassReportFooter } from "./ClassReportFooter";
import { ClassReportHeader } from "./ClassReportHeader";
import { Promotion } from "./Promotion";
import { PromotionMobileCard } from "./Promotion/PromotionMobileCard";
import { createColumns } from "./SpreadsheetColumns";
import { SpreadsheetMobileCard } from "./SpreadsheetMobileCard";
import { StudentRow } from "./students";
import { useSetPromotionDecision } from "@/hooks/queryHooks/useClass";

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

export type Decision = {
  status: string;
  studentId: number;
  toClassId?: number;
  toArmId?: number;
  className?: string;
  armName?: string;
};

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
  const router = useRouter();
  const params = useSearchParams();
  const armId = path.split("/")[5];
  const { branchIds } = useLoggedInUser();
  const branchId = branchIds?.[0];
  const classArmName = params.get("classArmName")?.replaceAll("-", " ") || "";

  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("spreadsheet");
  const [activeStudentId, setActiveStudentId] = useState<number>();
  const [termSelected, setTermSelected] = useState<Term | null>(null);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<
    {
      status: string;
      studentId: number;
      toClassId?: number;
      toArmId?: number;
      className?: string;
      armName?: string;
    }[]
  >([]);
  const pageSize = 100;

  const studentIdParam = params.get("studentId");

  useEffect(() => {
    if (studentIdParam) {
      setActiveFilter(studentIdParam);
    } else if (activeFilter !== "spreadsheet" && activeFilter !== "promotion") {
      setActiveFilter("spreadsheet");
    }
  }, [studentIdParam]);

  const handleSetActiveFilter = (filter: string) => {
    setActiveFilter(filter);
    const newParams = new URLSearchParams(params.toString());
    if (filter !== "spreadsheet" && filter !== "promotion") {
      newParams.set("studentId", filter);
    } else {
      newParams.delete("studentId");
    }
    router.push(`${path}?${newParams.toString()}`);
  };

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "Classes", url: "/staff/classes-and-subjects" },
    { label: "My Class", url: `/staff/classes-and-subjects/classes/overview/${armId}?classArmName=${classArmName}` },
    { label: "Class Report", url: "" },
  ]);

  const {
    data: classReportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    error: reportError,
  } = useGetClassReport(Number(armId), termSelected?.termId);

  const {
    data: classCumulativeReportData,
    isLoading: isLoadingCumulativeReport,
    isError: isErrorCumulativeReport,
    error: cumulativeReportError,
  } = useGetClassCumulativeReport(Number(armId), activeFilter);

  const levelId = classCumulativeReportData?.data?.levelId;
  const cumulativeReportStatus = classCumulativeReportData?.data?.status;

  const { data: levelResultSettings } = useGetLevelResultSettings(Number(levelId), activeFilter);

  useEffect(() => {
    if (!classCumulativeReportData?.data?.studentCumulative) return;
    const prePopulated = classCumulativeReportData.data.studentCumulative
      .filter((s: StudentCumulative) => s.decision)
      .map((s: StudentCumulative) => ({
        studentId: s.studentId,
        status: s.decision as string,
      }));
    if (prePopulated.length > 0) {
      setDecisions(prePopulated);
    }
  }, [classCumulativeReportData]);

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
    <ClassPermissionWrapper armId={Number(armId)} isLoading={isLoadingReport}>
      <div className="relative">
        <ClassReportHeader
          students={transformedStudents}
          activeFilter={activeFilter}
          setActiveFilter={handleSetActiveFilter}
          termSelected={termSelected}
          setTermSelected={setTermSelected}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          classArmName={classArmName}
          onExport={handleExport}
          classArmReportId={classReportData?.data?.classArmReportId}
          status={classReportData?.data?.status}
          decisions={decisions}
        />

        {isErrorReport && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get class report"
              description={`${reportError?.message || "This is our problem, we are looking into it so as to serve you better"}`}
              buttonText="Go to the Home page"
            />
          </div>
        )}

        {isLoadingReport && (
          <div className="flex p-4 md:p-8">
            <Skeleton className="bg-bg-input-soft h-100 w-full" />
          </div>
        )}

        {!isLoadingReport && !isErrorReport && classReportData && classReportData?.data?.classArmStudentReports?.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Class Report" description="No class report has been generated yet" />
          </div>
        )}

        {!isLoadingReport && !isErrorReport && classReportData && classReportData?.data?.classArmStudentReports?.length > 0 && (
          <>
            <div className={cn("px-4 md:h-screen md:px-8", (activeFilter === "spreadsheet" || activeFilter === "promotion") && "hidden md:block")}>
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
                        table: "table-fixed",
                        tableWrapper: "w-screen",
                      }}
                    />
                  )}
                </div>
              )}

              {activeFilter === "promotion" && (
                <div className="hidden overflow-x-auto pt-24 pb-24 md:block">
                  {isErrorCumulativeReport ? (
                    <ErrorComponent
                      title="Could not get Student's report"
                      description={cumulativeReportError?.message || "This is our problem, we are looking into it so as to serve you better"}
                      // buttonText="Go to the Home page"
                    />
                  ) : !classCumulativeReportData || isLoadingCumulativeReport ? (
                    <Skeleton className="bg-bg-input-soft h-100 w-full" />
                  ) : (
                    <Promotion
                      cumulativeReport={classCumulativeReportData?.data}
                      armId={Number(armId)}
                      resultSettings={levelResultSettings?.data}
                      decisions={decisions}
                      setDecisions={setDecisions}
                      reportStatus={cumulativeReportStatus}
                    />
                  )}
                </div>
              )}

              {activeFilter !== "spreadsheet" && activeFilter !== "promotion" && (
                <div>
                  {isErrorStudentReport ? (
                    <div className="flex items-center justify-center pt-24">
                      <ErrorComponent
                        title="Could not get Student's report"
                        description={studentReportError?.message || "This is our problem, we are looking into it so as to serve you better"}
                        // buttonText="Go to the Home page"
                      />
                    </div>
                  ) : loadingStudentReport && !studentReportData ? (
                    <div className="pt-6">
                      <Skeleton className="bg-bg-input-soft h-screen w-[678px]" />
                    </div>
                  ) : (
                    <div className="max-w-[678px] pt-6 pb-10">
                      {/* TODO: Pass active student here */}
                      <StudentResult
                        studentReport={studentReportData?.data}
                        termSelected={termSelected}
                        isEditable={true}
                        armId={Number(armId)}
                        branchId={branchId}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isMobile && (
              <ClassReportFooter
                students={transformedStudents}
                activeFilter={activeFilter}
                setActiveFilter={handleSetActiveFilter}
                footerRef={footerRef}
                termSelected={termSelected}
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
              })}

              {activeFilter === "promotion" && (
                <>
                  {classCumulativeReportData?.data?.studentCumulative.map((student: StudentCumulative) => (
                    <PromotionMobileCard
                      key={student.studentId}
                      student={student}
                      activeStudent={activeStudentId}
                      setActiveStudent={setActiveStudentId}
                      decisions={decisions}
                      setDecisions={setDecisions}
                      resultSettings={levelResultSettings?.data}
                      reportStatus={cumulativeReportStatus}
                    />
                  ))}
                </>
              )}
            </ul>
          </>
        )}
      </div>
    </ClassPermissionWrapper>
  );
};
