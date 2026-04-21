"use client";
import { useGetParent } from "@/hooks/queryHooks/useParent";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  return <div>parents</div>;
};
