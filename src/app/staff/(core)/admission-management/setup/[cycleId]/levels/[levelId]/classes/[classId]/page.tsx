"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { ConfigureRequirements } from "@/components/AdmissionManagement/SetupConfiguration/ConfigureRequirements";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLevelClasses } from "@/hooks/queryHooks/useAdmission";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function ClassConfigPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const cycleId = Number(params.cycleId);
  const levelId = Number(params.levelId);
  const classId = Number(params.classId);
  const branchId = searchParams.get("branchId") ? Number(searchParams.get("branchId")) : undefined;

  const { setBreadcrumbs } = useBreadcrumbStore();
  const { data: classes = [], isPending, isError, refetch } = useGetLevelClasses(cycleId, levelId, branchId);

  const klass = useMemo(() => classes.find(c => c.classId === classId), [classes, classId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Admission Management", url: "/staff/admission-management" },
      { label: "Set Up & Configuration", url: "/staff/admission-management?tab=setup" },
      { label: "Classes", url: `/staff/admission-management/setup/${cycleId}/levels/${levelId}/classes` },
      { label: klass?.className ?? "Class" },
    ]);
  }, [cycleId, levelId, klass, setBreadcrumbs]);

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
          title="Couldn't load class"
          description="Something went wrong while loading this class configuration. Please try again."
          buttonText="Retry"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <ConfigureRequirements
        scope="class"
        name={klass?.className ?? "Class"}
        cycleId={cycleId}
        levelId={levelId}
        classId={classId}
        branchId={branchId}
      />
    </div>
  );
}
