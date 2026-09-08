"use client";

import { StockMain } from "@/components/Stocks";
import { Spinner } from "@/components/ui/spinner";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewStock } from "@/lib/permissions/stock";
import React, { Suspense } from "react";

const StockPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewStock}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <StockMain />
      </Suspense>
    </ModulePermissionsWrapper>
  );
};

export default StockPage;
