"use client";

import { Button } from "@/components/ui/button";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { useRouter } from "next/navigation";

export default function SubjectHeader() {
  const user = useLoggedInUser();
  const router = useRouter();

  return (
    <div className="flex w-full justify-between align-middle">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-text-default text-lg font-semibold md:text-xl">My Subjects</h2>
        {user && user?.isAdmin && user?.adminBranchIds && user?.adminBranchIds?.length > 1 && (
          <Button onClick={() => router.push("/staff/classes-and-subjects/all-classes")} className="border-border-default border">
            View Branch Panel
          </Button>
        )}

        {user && user?.isMain && (
          <Button onClick={() => router.push("/staff/classes-and-subjects/all-branches")} className="border-border-default border">
            View All Branches
          </Button>
        )}
      </div>
    </div>
  );
}
