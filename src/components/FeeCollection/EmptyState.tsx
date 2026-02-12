"use client";

import React from "react";
import { Button } from "../ui/button";
import { GroupWorkT } from "../Icons/GroupWorkT";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";

export const EmptyFeesCollectionState = () => {
  const router = useRouter();
  useBreadcrumb([{ label: "Fee Collection", url: "/fee-collection" }]);
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <GroupWorkT />
        <div className="text-text-subtle text-sm font-medium">Set Up Fee Collection</div>
        <div className="text-text-muted text-xs font-normal">
          Get started by connecting your primary collection account. You can configure advanced options later.
        </div>
        <Button
          onClick={() => router.push("/fee-collection/fees-setup")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md text-sm"
        >
          Set up Fee collection
        </Button>
      </div>
    </div>
  );
};
