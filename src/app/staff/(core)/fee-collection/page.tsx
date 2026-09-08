"use client";

import { FeeCollectionContent } from "@/components/FeeCollection/FeeCollectionContent";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewFeeCollection } from "@/lib/permissions/fee-collection";
import React from "react";

const FessCollectionsPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewFeeCollection}>
      <div>
        <FeeCollectionContent />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default FessCollectionsPage;
