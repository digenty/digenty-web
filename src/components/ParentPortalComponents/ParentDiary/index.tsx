"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TermLookup } from "@/api/parent-lookup";
import { DiaryCard, DotBadge, EntryTypeBadge, formatDateTime, formatDayAndMonth, formatShortDate, formatTime } from "@/components/DailyDiary/shared";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { StudentFilter } from "@/components/ParentPortalComponents/FilterStudents";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetActiveParentPortalTerm } from "@/hooks/queryHooks/useParentLookup";
import { useGetParentDiaryReports, useGetParentHomework, useGetParentWeeklyReports } from "@/hooks/queryHooks/useParentDiary";
import { useStudentFilterStore } from "@/store/parent";

const TABS = ["Daily reports", "Weekly reports", "Homework"] as const;
type Tab = (typeof TABS)[number];

const ListSkeleton = () => (
  <div className="flex flex-col gap-5">
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} className="bg-bg-input-soft h-56 w-full rounded-lg" />
    ))}
  </div>
);

export const ParentDiary = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [termId, setTermId] = useState<number | undefined>();

  const { selectedStudentId } = useStudentFilterStore();
  const { data: activeTerm } = useGetActiveParentPortalTerm();

  useEffect(() => {
    if (activeTerm && !termId) setTermId((activeTerm as TermLookup).id);
  }, [activeTerm, termId]);

  const params = { studentId: selectedStudentId, termId };
  const dailyQuery = useGetParentDiaryReports(params);
  const weeklyQuery = useGetParentWeeklyReports(activeTab === "Weekly reports" ? params : {});
  const homeworkQuery = useGetParentHomework(activeTab === "Homework" ? selectedStudentId : undefined);

  const reports = dailyQuery.data ?? [];
  const dueHomework = (homeworkQuery.data ?? []).filter(item => !item.completedAt);
  const awaiting = reports.find(report => report.status === "AWAITING_SIGNATURE");

  const openDaily = (reportId: number) => router.push(`/parents/daily-diary/${reportId}`);
  const openWeekly = (weeklyReportId: number) => router.push(`/parents/daily-diary/weekly/${weeklyReportId}`);

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:gap-8 md:p-8">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-text-default text-2xl font-semibold">Daily Diary</h1>
          <p className="text-text-muted text-xs">
            Your child&apos;s daily and weekly reports from school. Sign each one so the teacher knows you have read it.
          </p>
        </div>
        <div className="shrink-0">
          <StudentFilter />
        </div>
      </div>

      {!selectedStudentId ? (
        <ErrorComponent title="Choose a child" description="Pick a child at the top of the page to see their diary." />
      ) : (
        <>
          {awaiting && (
            <div className="border-border-amber bg-bg-badge-amber flex flex-col gap-3 rounded-lg border px-4 py-3.5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="text-text-default text-[13px] leading-[18px] font-medium">Today&apos;s report needs your signature</p>
                <p className="text-text-muted text-xs leading-4">
                  {formatDayAndMonth(awaiting.date)} · sent {formatTime(awaiting.publishedAt)} by {awaiting.teacherName}
                </p>
              </div>
              <Button
                onClick={() => openDaily(awaiting.reportId)}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default shrink-0 rounded-full px-3.5"
              >
                Open &amp; sign
              </Button>
            </div>
          )}

          <div className="bg-bg-state-soft flex w-fit items-center rounded-lg p-[3px]">
            {TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3.5 py-[5px] text-[13px] leading-[18px] font-medium transition-colors ${
                  activeTab === tab ? "border-border-default bg-bg-card text-text-default border" : "text-text-muted hover:text-text-default"
                }`}
              >
                {tab === "Homework" && dueHomework.length > 0 ? `Homework · ${dueHomework.length} due` : tab}
              </button>
            ))}
          </div>

          {activeTab === "Daily reports" &&
            (dailyQuery.isPending ? (
              <ListSkeleton />
            ) : dailyQuery.isError ? (
              <ErrorComponent
                title="We could not load the diary"
                description="Something went wrong. Check your connection and try again."
                buttonText="Try again"
                onClick={() => dailyQuery.refetch()}
              />
            ) : reports.length === 0 ? (
              <ErrorComponent title="No reports yet" description="When your child's teacher publishes a daily report, it will appear here." />
            ) : (
              <div className="flex flex-col gap-5">
                {reports.map(report => {
                  const needsSignature = report.status === "AWAITING_SIGNATURE";
                  return (
                    <DiaryCard key={report.reportId}>
                      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <p className="text-text-default text-sm leading-5 font-semibold">{formatDayAndMonth(report.date)}</p>
                          <p className="text-text-muted text-xs leading-4">
                            {report.teacherName} · {formatTime(report.publishedAt)}
                          </p>
                        </div>
                        {needsSignature ? (
                          <DotBadge label="Needs your signature" dot="bg-bg-basic-amber-accent" className="bg-bg-badge-amber" />
                        ) : report.signedAt ? (
                          <DotBadge label="Seen & signed" dot="bg-bg-basic-green-accent" className="bg-bg-badge-green" />
                        ) : null}
                      </div>

                      {report.entries.map(entry => (
                        <div key={entry.id} className="border-border-default flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-start">
                          <p className="text-text-default shrink-0 text-xs leading-4 font-medium sm:w-30">{entry.activity}</p>
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <p className="text-text-muted text-[13px] leading-[18px]">{entry.note}</p>
                            {entry.type !== "CLASS_NOTE" && <EntryTypeBadge type={entry.type} dueDate={entry.dueDate} />}
                          </div>
                        </div>
                      ))}

                      <div className="flex flex-col gap-3 px-4 pt-3 pb-4 sm:flex-row sm:items-center">
                        <p className="text-text-muted min-w-0 flex-1 text-xs leading-4">
                          {needsSignature
                            ? [
                                report.homeworkCount ? `${report.homeworkCount} homework item${report.homeworkCount === 1 ? "" : "s"}` : null,
                                report.reminderCount ? `${report.reminderCount} reminder${report.reminderCount === 1 ? "" : "s"}` : null,
                              ]
                                .filter(Boolean)
                                .join(" · ") || "No homework set"
                            : report.hasComment
                              ? `You commented${report.hasTeacherReply ? ` · ${report.teacherName} replied` : ""}`
                              : `Signed by you ${formatDateTime(report.signedAt)}`}
                        </p>
                        <Button
                          onClick={() => openDaily(report.reportId)}
                          variant={needsSignature ? "default" : "outline"}
                          className={
                            needsSignature
                              ? "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default shrink-0 rounded-full px-3.5"
                              : "border-border-darker text-text-default bg-bg-card shrink-0 rounded-full px-3.5"
                          }
                        >
                          {needsSignature ? "Open & sign" : "View"}
                        </Button>
                      </div>
                    </DiaryCard>
                  );
                })}
              </div>
            ))}

          {activeTab === "Weekly reports" &&
            (weeklyQuery.isPending ? (
              <ListSkeleton />
            ) : weeklyQuery.isError ? (
              <ErrorComponent
                title="We could not load the weekly reports"
                description="Something went wrong. Check your connection and try again."
                buttonText="Try again"
                onClick={() => weeklyQuery.refetch()}
              />
            ) : (weeklyQuery.data ?? []).length === 0 ? (
              <ErrorComponent title="No weekly reports yet" description="Weekly reports are published at the end of each school week." />
            ) : (
              <div className="flex flex-col gap-4">
                {(weeklyQuery.data ?? []).map(week => (
                  <div
                    key={week.weeklyReportId}
                    className="border-border-default bg-bg-sidebar-subtle flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="text-text-default text-[13px] leading-[18px] font-medium">
                        Weekly report · Week {week.weekNumber} ({formatShortDate(week.weekStart)} – {formatShortDate(week.weekEnd)})
                      </p>
                      <p className="text-text-muted text-xs leading-4">
                        {week.signedAt ? `Signed by you ${formatDateTime(week.signedAt)}` : "Needs your signature"}
                        {week.hasTeacherReply ? " · your teacher replied to your comment" : ""}
                      </p>
                    </div>
                    <Button
                      onClick={() => openWeekly(week.weeklyReportId)}
                      variant="outline"
                      className="border-border-darker text-text-default bg-bg-card shrink-0 rounded-full px-3.5"
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ))}

          {activeTab === "Homework" &&
            (homeworkQuery.isPending ? (
              <ListSkeleton />
            ) : homeworkQuery.isError ? (
              <ErrorComponent
                title="We could not load the homework list"
                description="Something went wrong. Check your connection and try again."
                buttonText="Try again"
                onClick={() => homeworkQuery.refetch()}
              />
            ) : dueHomework.length === 0 ? (
              <ErrorComponent title="Nothing due" description="There is no outstanding homework for your child right now." />
            ) : (
              <DiaryCard>
                {dueHomework.map((item, index) => (
                  <button
                    key={item.entryId}
                    type="button"
                    onClick={() => openDaily(item.reportId)}
                    className={`hover:bg-bg-state-soft flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition-colors ${
                      index > 0 ? "border-border-default border-t" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-text-default text-[13px] leading-[18px] font-medium">{item.activity}</p>
                      <EntryTypeBadge type="HOMEWORK" dueDate={item.dueDate} />
                    </div>
                    <p className="text-text-muted text-[13px] leading-[18px]">{item.note}</p>
                  </button>
                ))}
              </DiaryCard>
            ))}
        </>
      )}
    </div>
  );
};
