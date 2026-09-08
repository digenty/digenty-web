"use client";

import { StockDetails } from "@/components/Stocks/StockDetails";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewStock } from "@/lib/permissions/stock";
import React from "react";

const StockDetailsPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewStock}>
      <div className="mb-4 p-4 md:p-8">
        <StockDetails />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default StockDetailsPage;
