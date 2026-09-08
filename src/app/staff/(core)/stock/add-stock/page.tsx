"use client";

import { AddStock } from "@/components/Stocks/AddStocks";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageStock } from "@/lib/permissions/stock";
import React from "react";

const AddStockPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageStock} redirectTo="/staff/stock">
      <div>
        <AddStock />
      </div>
    </ManageAccessGate>
  );
};

export default AddStockPage;
