"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { LevelClasses } from "@/components/AdmissionManagement/SetupConfiguration/LevelClasses";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdmissionCycle, useGetCycleLevels } from "@/hooks/queryHooks/useAdmission";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function LevelClassesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cycleId = Number(params.cycleId);
  const levelId = Number(params.levelId);
  const branchId = searchParams.get("branchId") ? Number(searchParams.get("branchId")) : undefined;

  const { setBreadcrumbs } = useBreadcrumbStore();

  // Fetch cycle only for the breadcrumb label — don't gate rendering on it
  const { data: cycle } = useGetAdmissionCycle(cycleId);
  const { data: levels = [], isPending, isError, refetch } = useGetCycleLevels(cycleId, branchId);

  const level = useMemo(() => levels.find(l => l.classLevelId === levelId), [levels, levelId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Admission Management", url: "/staff/admission-management" },
      { label: "Set Up & Configuration", url: "/staff/admission-management?tab=setup" },
      { label: cycle?.name ?? "Cycle Setup", url: `/staff/admission-management/setup/${cycleId}` },
      { label: level?.levelName ?? "Level" },
    ]);
  }, [cycleId, cycle, level, setBreadcrumbs]);

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-3 md:p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !level) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent
          title="Couldn't load classes"
          description="Something went wrong while loading this level's classes. Please try again."
          buttonText="Retry"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <LevelClasses cycleId={cycleId} level={level} branchId={branchId} />
    </div>
  );
}
