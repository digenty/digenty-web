"use client";

import { ArrowLeft, SearchIcon } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDiaryClasses } from "@/hooks/queryHooks/useDiary";
import useDebounce from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { DAILY_REPORT_STATUS_CONFIG } from "@/queries/diary";

import { DiaryCard, DotBadge, formatLongDate, toISODate } from "./shared";

/** "+ New daily report" lands here: pick the class, then the composer opens today's draft. */
export const NewReportPicker = () => {
  const router = useRouter();
  const user = useLoggedInUser();
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(toISODate(new Date()));

  const debouncedSearch = useDebounce(search, 400);
  const branchId = user.branchIds?.[0];

  useBreadcrumb([
    { label: "Daily Diary", url: "/staff/daily-diary" },
    { label: "New daily report", url: "/staff/daily-diary/new" },
  ]);

  const { data, isPending, isError, refetch } = useGetDiaryClasses({ branchId, date, search: debouncedSearch }, !!branchId);
  const classes = data?.content ?? [];

  return (
    <div className="flex flex-col">
      <div className="border-border-default bg-bg-default flex items-center gap-3 border-b px-4 py-3 md:px-8">
        <Button
          onClick={() => router.push("/staff/daily-diary")}
          className="border-border-default text-text-default bg-bg-card h-8 shrink-0 gap-1.5 rounded-md border"
        >
          <ArrowLeft fill="var(--color-icon-default)" className="size-4" />
          Back
        </Button>
        <h1 className="text-text-default truncate text-lg leading-7 font-semibold">New daily report</h1>
      </div>

      <div className="flex flex-col gap-5 px-4 pt-5 pb-10 md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="bg-bg-input-soft! relative w-full rounded-md sm:max-w-71">
            <SearchIcon fill="var(--color-icon-default-muted)" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search class or teacher"
              aria-label="Search class or teacher"
              className="bg-bg-input-soft h-9 rounded-lg border-none pl-9 text-[13px]"
            />
          </div>
          <Input
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            aria-label="Report date"
            className="border-border-default! bg-bg-default! h-9 w-full border text-[13px] sm:w-44"
          />
        </div>

        <p className="text-text-muted text-[13px]">Writing for {formatLongDate(date)}. Pick the class you are writing for.</p>

        {isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="bg-bg-input-soft h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <ErrorComponent
            title="We could not load your classes"
            description="Something went wrong while fetching the class list."
            buttonText="Try again"
            onClick={() => refetch()}
          />
        ) : classes.length === 0 ? (
          <ErrorComponent
            title={debouncedSearch ? "No classes match your search" : "No classes available"}
            description={
              debouncedSearch ? "Try a different class name or teacher." : "Daily Diary covers early years and primary classes in your branch."
            }
          />
        ) : (
          <DiaryCard>
            {classes.map((item, index) => {
              const config = DAILY_REPORT_STATUS_CONFIG[item.status];
              return (
                <button
                  key={item.armId}
                  type="button"
                  onClick={() => router.push(`/staff/daily-diary/${item.armId}/compose?date=${date}`)}
                  className={`hover:bg-bg-state-soft flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    index > 0 ? "border-border-default border-t" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-text-default truncate text-[13px] leading-[18px] font-medium">{item.armName}</p>
                    <p className="text-text-muted truncate text-xs leading-4">
                      {[item.teacherName, item.branchName, `${item.pupilCount} pupils`].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                  <DotBadge label={config.label} dot={config.dot} className={config.badge} />
                </button>
              );
            })}
          </DiaryCard>
        )}
      </div>
    </div>
  );
};
