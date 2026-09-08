"use client";

import { AddFee } from "@/components/Fees/AddFee";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFees } from "@/lib/permissions/fees";

const feesAdd = () => {
  return (
    <ManageAccessGate permissionUtility={canManageFees} redirectTo="/staff/fees">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <AddFee />
      </Suspense>
    </ManageAccessGate>
  );
};

export default feesAdd;
