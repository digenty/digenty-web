"use client";
import { useGetParentStudents } from "@/hooks/queryHooks/useParentStudents";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const Parents = () => {
  const router = useRouter();
  // /parents/{id} is staff-permission-gated and 403s a parent fetching their own
  // record, so onboarding completion is determined by whether they have linked
  // students instead - which is what actually matters here anyway.
  const { data, isFetched } = useGetParentStudents();

  useEffect(() => {
    if (isFetched) {
      router.push(data && data.length > 0 ? "/parents/dashboard" : "/parents/onboarding");
    }
  }, [data, isFetched, router]);

  return (
    <div className="flex items-center justify-center p-4 md:p-8">
      <Skeleton className="bg-bg-input-soft! h-200 w-full" />
    </div>
  );
};
