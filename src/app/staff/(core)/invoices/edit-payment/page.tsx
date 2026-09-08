"use client";

import { EditPayment } from "@/components/Invoices/EditPayment";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageInvoices } from "@/lib/permissions/invoices";
import React from "react";

function page() {
  return (
    <ManageAccessGate permissionUtility={canManageInvoices} redirectTo="/staff/invoices">
      <div>
        <EditPayment />
      </div>
    </ManageAccessGate>
  );
}

export default page;
