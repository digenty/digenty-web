"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ConfigureRequirements } from "@/components/AdmissionManagement/SetupConfiguration/ConfigureRequirements";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCycleLevels } from "@/hooks/queryHooks/useAdmission";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function LevelConfigPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cycleId = Number(params.cycleId);
  const levelId = Number(params.levelId);
  const branchId = searchParams.get("branchId") ? Number(searchParams.get("branchId")) : undefined;

  const { setBreadcrumbs } = useBreadcrumbStore();
  const { data: levels = [], isPending, isError, refetch } = useGetCycleLevels(cycleId, branchId);

  const level = useMemo(() => levels.find(l => l.classLevelId === levelId), [levels, levelId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Admission Management", url: "/staff/admission-management" },
      { label: "Set Up & Configuration", url: "/staff/admission-management?tab=setup" },
      { label: "Configure Level", url: `/staff/admission-management/setup/${cycleId}` },
      { label: level?.levelName ?? "Level" },
    ]);
  }, [cycleId, level, setBreadcrumbs]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 p-3 md:p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent
          title="Couldn't load level"
          description="Something went wrong while loading this level. Please try again."
          buttonText="Retry"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <ConfigureRequirements
        scope="level"
        name={level?.levelName ?? "Level"}
        cycleId={cycleId}
        levelId={levelId}
        branchId={branchId}
      />
    </div>
  );
}
