"use client";

import { SearchIcon } from "@digenty/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ClassDiarySummary, WeeklyClassDiarySummary } from "@/api/diary";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDiaryClasses, useGetDiaryOverview, useGetWeeklyDiaryClasses } from "@/hooks/queryHooks/useDiary";
import useDebounce from "@/hooks/useDebounce";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { canManageDailyDiary, canManageDiarySettings } from "@/lib/permissions/daily-diary";

import { ClassCard, WeeklyClassCard } from "./ClassCard";
import { DiaryFilters } from "./DiaryFilters";
import { StatCard, startOfWeek, toISODate } from "./shared";

const TABS = ["Daily reports", "Weekly reports"] as const;
type Tab = (typeof TABS)[number];

const GridSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <Skeleton key={index} className="bg-bg-input-soft h-56 w-full rounded-lg" />
    ))}
  </div>
);

export const DailyDiary = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [branchId, setBranchId] = useState<number | undefined>();
  const [termId, setTermId] = useState<number | undefined>();
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 400);
  const today = toISODate(new Date());
  const weekStart = toISODate(startOfWeek(new Date()));

  useBreadcrumb([{ label: "Daily Diary", url: "/staff/daily-diary" }]);

  const isDaily = activeTab === "Daily reports";
  const filtersReady = !!branchId && !!termId;

  const { data: overview, isPending: loadingOverview } = useGetDiaryOverview({ branchId, termId, date: today }, filtersReady);

  const dailyQuery = useGetDiaryClasses({ branchId, termId, date: today, search: debouncedSearch }, filtersReady && isDaily);
  const weeklyQuery = useGetWeeklyDiaryClasses({ branchId, termId, weekStart, search: debouncedSearch }, filtersReady && !isDaily);

  const activeQuery = isDaily ? dailyQuery : weeklyQuery;
  const classes = (activeQuery.data?.content ?? []) as (ClassDiarySummary & Partial<WeeklyClassDiarySummary>)[];

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-10 md:px-8 md:pt-6 md:pb-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-text-default text-xl leading-7 font-semibold">Daily Diary</h1>
        <DiaryFilters branchId={branchId} onBranchChange={setBranchId} termId={termId} onTermChange={setTermId} />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        {loadingOverview || !overview ? (
          Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="bg-bg-input-soft h-28 flex-1 rounded" />)
        ) : (
          <>
            <StatCard label="Classes" value={String(overview.classCount)} swatch="blue" />
            <StatCard label="Reports published today" value={`${overview.publishedToday} / ${overview.classCount}`} swatch="green" />
            <StatCard label="Awaiting parent sign-off" value={String(overview.awaitingSignature)} swatch="amber" />
            <StatCard label="Parent response rate · 7d" value={`${overview.parentResponseRate}%`} swatch="pink" />
          </>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="bg-bg-state-soft flex w-fit shrink-0 items-center rounded-lg p-[3px]">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3.5 py-[5px] text-[13px] leading-[18px] font-medium transition-colors ${
                activeTab === tab ? "border-border-default bg-bg-card text-text-default border" : "text-text-muted hover:text-text-default"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-71">
          <SearchIcon fill="var(--color-icon-default-muted)" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search class or teacher"
            aria-label="Search class or teacher"
            className="bg-bg-input-soft h-8 rounded-lg border-none pl-9 text-[13px]"
          />
        </div>

        <div className="flex-1" />

        <div className="flex flex-wrap items-center gap-2">
          <PermissionCheck permissionUtility={canManageDiarySettings}>
            <Button
              variant="outline"
              onClick={() => router.push("/staff/daily-diary/settings")}
              className="border-border-darker text-text-default bg-bg-card h-8 rounded-md"
            >
              Report settings
            </Button>
          </PermissionCheck>
          <PermissionCheck permissionUtility={canManageDailyDiary}>
            <Button
              onClick={() => router.push("/staff/daily-diary/new")}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 rounded-md"
            >
              + New daily report
            </Button>
          </PermissionCheck>
        </div>
      </div>

      {!filtersReady || activeQuery.isPending ? (
        <GridSkeleton />
      ) : activeQuery.isError ? (
        <ErrorComponent
          title="We could not load your classes"
          description="Something went wrong while fetching the diary. Check your connection and try again."
          buttonText="Try again"
          onClick={() => activeQuery.refetch()}
        />
      ) : classes.length === 0 ? (
        <ErrorComponent
          title={debouncedSearch ? "No classes match your search" : "No classes to show yet"}
          description={
            debouncedSearch
              ? "Try a different class name or teacher."
              : "Daily Diary covers early years and primary classes. Once those classes exist for this branch and term, they will appear here."
          }
          {...(debouncedSearch ? { buttonText: "Clear search", onClick: () => setSearch("") } : {})}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {classes.map(item =>
            isDaily ? <ClassCard key={item.armId} item={item} /> : <WeeklyClassCard key={item.armId} item={item as WeeklyClassDiarySummary} />,
          )}
        </div>
      )}
    </div>
  );
};
