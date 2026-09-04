"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { ArrowRight } from "lucide-react";
import { StudentFilter } from "../FilterStudents";
import { useRouter } from "next/navigation";
import { BillFill, BookOpenFill } from "@digenty/icons";
import { PendingFees } from "./PendingFees";
import { useGetStudentOverview } from "@/hooks/queryHooks/useParentStudents";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useStudentFilterStore } from "@/store/parent";

export const Overview = () => {
  const router = useRouter();
  const user = useLoggedInUser();
  const { selectedStudentId } = useStudentFilterStore();

  const { data: overview, isLoading, isError, error } = useGetStudentOverview(selectedStudentId);
  const errorMessage = (error as { message?: string } | null)?.message ?? "This is our problem, we are looking into it so as to serve you better";

  const welcomeName = overview?.parentName || user?.name || "";

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Welcome{welcomeName ? `, ${welcomeName}` : ""}</div>
          <div className="text-text-muted text-xs">Student Overview</div>
        </div>
        <div className="hidden md:block">
          <StudentFilter parentId={user?.id} />
        </div>
      </div>

      {!selectedStudentId ? (
        <PageEmptyState title="No Student Selected" description="Select a student above to view their overview" buttonText="Refresh" url="" />
      ) : isError ? (
        <div className="flex items-center justify-center p-10">
          <ErrorComponent title="Could not load student overview" description={errorMessage} />
        </div>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div className="border-border-darker bg-bg-subtle flex flex-col gap-4 rounded-xl border p-3 md:p-6">
              <div className="flex items-center gap-2">
                <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent rounded-2xs border p-1">
                  <BillFill fill="var(--color-icon-default)" width={9} height={9} />
                </div>
                <div className="text-text-muted text-xs font-medium capitalize">Outstanding Fees </div>
              </div>
              {isLoading ? (
                <Skeleton className="bg-bg-input-soft h-7 w-32 rounded-md" />
              ) : (
                <div className="text-text-default text-lg font-semibold">₦{(overview?.outstandingBalance ?? 0).toLocaleString()}</div>
              )}
              <Button
                onClick={() => router.push("/parents/parent-fees/fees-to-pay")}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full rounded-full"
              >
                Pay now <ArrowRight />
              </Button>
            </div>

            <div className="border-border-darker bg-bg-subtle flex flex-col gap-4 rounded-xl border p-3 md:p-6">
              <div className="flex items-center gap-2">
                <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent rounded-2xs border p-1">
                  <BookOpenFill fill="var(--color-icon-default)" width={9} height={9} />
                </div>
                <div className="text-text-muted text-xs font-medium capitalize">Academic Result</div>
              </div>
              {isLoading ? (
                <Skeleton className="bg-bg-input-soft h-7 w-48 rounded-md" />
              ) : (
                <div className="text-text-default text-lg font-semibold">
                  {overview?.termName ? `${overview.termName} Result Available` : "Result"}
                </div>
              )}
              <Button
                onClick={() => router.push("/parents/academic-record")}
                className="bg-bg-state-secondary border-border-darker hover:bg-bg-state-secondary-hover! text-text-default w-full rounded-full border"
              >
                View Results <ArrowRight />
              </Button>
            </div>
          </div>
          <PendingFees fees={overview?.pendingFees} loading={isLoading} />
        </>
      )}
    </div>
  );
};
