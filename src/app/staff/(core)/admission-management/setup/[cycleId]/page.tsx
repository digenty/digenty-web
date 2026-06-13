"use client";

import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { AdmissionCycleSetup } from "@/components/AdmissionManagement/AdmissionCycleSetup";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdmissionCycle } from "@/hooks/queryHooks/useAdmission";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CycleSetupPage() {
  const params = useParams();
  const cycleId = Number(params.cycleId);
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbStore();

  const { data: cycle, isPending, isError, refetch } = useGetAdmissionCycle(cycleId);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Admission Management", url: "/staff/admission-management" },
      { label: "Set Up & Configuration", url: "/staff/admission-management?tab=setup" },
      { label: cycle?.name ?? "Cycle Setup" },
    ]);
  }, [cycle, setBreadcrumbs]);

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 p-3 md:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !cycle) {
    return (
      <div className="flex justify-center py-16">
        <ErrorComponent
          title="Couldn't load cycle"
          description="Something went wrong while loading this admission cycle. Please try again."
          buttonText="Retry"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  const buildQuery = (branchId?: number) => (branchId ? `?branchId=${branchId}` : "");

  return (
    <div className="p-3 md:p-6">
      <AdmissionCycleSetup
        cycle={cycle}
        onConfigureLevel={(level, branchId) =>
          router.push(`/staff/admission-management/setup/${cycleId}/levels/${level.classLevelId}${buildQuery(branchId)}`)
        }
        onViewClasses={(level, branchId) =>
          router.push(`/staff/admission-management/setup/${cycleId}/levels/${level.classLevelId}/classes${buildQuery(branchId)}`)
        }
      />
    </div>
  );
}
