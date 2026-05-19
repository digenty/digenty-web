"use client";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export const Parents = () => {
  const { id } = useLoggedInUser();
  const router = useRouter();
  const { data, isLoading } = useGetParent(id);

  useEffect(() => {
    if (!isLoading && id) {
      if (!data) {
        router.push("/parents/onboarding");
      } else {
        router.push("/parents");
      }
    }
  }, [data, isLoading, router, id]);

  return (
    <div className="flex items-center justify-center p-4 md:p-8">
      <Skeleton className="bg-bg-input-soft! h-200 w-full" />
    </div>
  );
};
