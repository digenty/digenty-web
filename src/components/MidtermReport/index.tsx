"use client";

import { MidtermClassOverviewRow } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/Toast";
import { exportToImage, exportToPDF } from "@/lib/export-utils";
import { ShareBox } from "@digenty/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMidtermClassOverview, useGetMidtermStudentReport } from "@/hooks/queryHooks/useMidterm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { TriangleAlert } from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SignatureReminder } from "../SignatureReminder";
import { MidtermReportView } from "./MidtermReportView";
import { getApiErrorMessage } from "@/lib/apiError";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";
import Link from "next/link";

export const MidtermReportScreen = () => {
  const { armId: armIdParam } = useParams<{ armId: string }>();
  const armId = Number(armIdParam);
  const searchParams = useSearchParams();
  const classArmName = searchParams.get("classArmName")?.replaceAll("-", " ") || "";
  const [activeStudentId, setActiveStudentId] = useState<number | null>(null);

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
    { label: "Classes", url: "/staff/classes-and-subjects" },
    { label: "Mid-term Report", url: "" },
  ]);

  const pathname = usePathname();
  const { permissions } = useLoggedInUser();
  const canEditComments = canManageClassesAndSubjects(permissions ?? []);

  const { data: overviewData, isLoading, isError, error } = useGetMidtermClassOverview({ armId });
  const rows: MidtermClassOverviewRow[] = overviewData?.data ?? [];
  const isCommentClass = rows.some(row => row.commentsExpected != null);
  const missingCount = rows.filter(row =>
    isCommentClass ? (row.commentsFilled ?? 0) < (row.commentsExpected ?? 0) : row.subjectsWithScores < row.totalSubjects,
  ).length;

  // Staff on a COMMENT class can flip to the scores behind the report; parents never can.
  const [showScores, setShowScores] = useState(false);

  const {
    data: reportData,
    isLoading: isLoadingReport,
    isError: isErrorReport,
    error: reportError,
  } = useGetMidtermStudentReport({ studentId: activeStudentId ?? undefined, armId, view: isCommentClass && showScores ? "SCORE" : undefined });

  const handleExport = async (format: "pdf" | "png") => {
    const report = reportData?.data;
    if (!report) return;
    const baseName = `MidtermReport_${(report.studentName || "Student").replaceAll(" ", "_")}`;
    try {
      if (format === "png") {
        await exportToImage("midterm-report", `${baseName}.png`);
      } else {
        await exportToPDF("midterm-report", `${baseName}.pdf`);
      }
    } catch (error) {
      console.error("Error exporting mid-term report:", error);
      toast({ title: "Export failed", description: "Could not export the report card. Please try again.", type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-4">
      <div className="flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-default text-lg font-semibold md:text-xl">Mid-term Report</h2>
          {classArmName && <span className="text-text-subtle text-sm">{classArmName}</span>}
        </div>
        {!activeStudentId && isCommentClass && canEditComments && (
          <Link
            href={`${pathname.replace(/midterm-report\/?$/, "midterm-comments")}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            className="bg-bg-state-primary text-text-white-default flex h-8 w-fit items-center rounded-md px-3 text-sm font-medium"
          >
            Write comments
          </Link>
        )}
        {activeStudentId && (
          <div className="flex flex-row-reverse items-center justify-between gap-2 md:flex-row md:justify-end">
            {isCommentClass && (
              <Button
                onClick={() => setShowScores(prev => !prev)}
                className="border-border-darker bg-bg-state-secondary text-text-default h-8! rounded-md border px-3! text-sm font-medium"
              >
                {showScores ? "Show comments" : "Show scores"}
              </Button>
            )}
            {reportData?.data && (
              <DropdownMenu>
                <DropdownMenuTrigger className="border-border-darker bg-bg-state-secondary text-text-default flex h-8 cursor-pointer items-center gap-1 rounded-md border px-3 text-sm font-medium focus-visible:ring-0 focus-visible:outline-none">
                  <ShareBox fill="var(--color-icon-default-muted)" /> Export
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-bg-card border-border-default text-text-default py-2.5 shadow-sm">
                  <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer px-3 py-0.5" onClick={() => handleExport("pdf")}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-bg-basic-gray-alpha-2! cursor-pointer px-3 py-0.5" onClick={() => handleExport("png")}>
                    Export as PNG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              onClick={() => setActiveStudentId(null)}
              className="border-border-darker bg-bg-state-secondary text-text-default h-8! rounded-md border px-3! text-sm font-medium"
            >
              Back to class overview
            </Button>
          </div>
        )}
      </div>

      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Mid-term report unavailable"
            description={getApiErrorMessage(error, "This is our problem, we are looking into it so as to serve you better")}
          />
        </div>
      )}

      {!isLoading && !isError && !activeStudentId && (
        <>
          {rows.length === 0 ? (
            <div className="flex h-80 items-center justify-center">
              <ErrorComponent title="No Students" description="There are no active students in this class" />
            </div>
          ) : (
            <>
              {missingCount > 0 && (
                <div className="bg-bg-state-soft text-text-default flex items-center gap-2 rounded-md px-3 py-2 text-sm">
                  <TriangleAlert className="size-4 shrink-0" />
                  {missingCount} {missingCount === 1 ? "student has" : "students have"} missing {isCommentClass ? "comments" : "scores"}. Check before
                  publishing.
                </div>
              )}

              <div className="border-border-default bg-bg-card overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted border-border-default bg-bg-subtle border-b text-left">
                      <th className="px-4 py-3 font-medium">Student</th>
                      <th className="px-4 py-3 font-medium">{isCommentClass ? "Comments written" : "Subjects with scores"}</th>
                      {!isCommentClass && <th className="px-4 py-3 font-medium">Overall %</th>}
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="text-text-default">
                    {rows.map(row => {
                      const filled = isCommentClass ? (row.commentsFilled ?? 0) : row.subjectsWithScores;
                      const expected = isCommentClass ? (row.commentsExpected ?? 0) : row.totalSubjects;
                      const incomplete = filled < expected;
                      return (
                        <tr
                          key={row.studentId}
                          onClick={() => setActiveStudentId(row.studentId)}
                          className="border-border-default hover:bg-bg-state-soft cursor-pointer border-b last:border-b-0"
                        >
                          <td className="px-4 py-3 font-medium">{row.studentName}</td>
                          <td className="px-4 py-3">
                            <span className={incomplete ? "text-text-destructive font-medium" : ""}>
                              {filled}/{expected}
                            </span>
                            {incomplete && (
                              <span className="text-text-destructive ml-2 text-xs">{isCommentClass ? "Comments missing" : "Scores missing"}</span>
                            )}
                          </td>
                          {!isCommentClass && <td className="px-4 py-3">{row.overallPercentage != null ? `${row.overallPercentage}%` : "--"}</td>}
                          <td className="text-text-informative px-4 py-3 text-right text-xs font-medium">View report</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {activeStudentId && (
        <div className="max-w-[678px]">
          {isLoadingReport && <Skeleton className="bg-bg-input-soft h-screen w-full" />}
          {isErrorReport && (
            <ErrorComponent title="Could not get mid-term report" description={getApiErrorMessage(reportError, "Please try again")} />
          )}
          {reportData?.data && (
            <>
              {!reportData.data.published && (
                <p className="text-text-subtle mb-3 text-xs">Preview only. Parents cannot see this until the branch publishes the mid-term report.</p>
              )}
              <SignatureReminder />
              <MidtermReportView report={reportData.data} />
            </>
          )}
        </div>
      )}
    </div>
  );
};
