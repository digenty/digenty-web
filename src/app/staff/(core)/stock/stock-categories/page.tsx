"use client";

import { StockCategories } from "@/components/Stocks/StockCategories";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewStock } from "@/lib/permissions/stock";
import React from "react";

const StocksCategoriesPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewStock}>
      <div>
        <StockCategories />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default StocksCategoriesPage;
