"use client";

import { FeesSetup } from "@/components/FeeCollection/FeesCollectionSteppers";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageFeeCollection } from "@/lib/permissions/fee-collection";
import React from "react";

export default function FeesSetupPage() {
  return (
    <ManageAccessGate permissionUtility={canManageFeeCollection} redirectTo="/staff/fee-collection">
      <div className="p-4">
        <FeesSetup />
      </div>
    </ManageAccessGate>
  );
}
