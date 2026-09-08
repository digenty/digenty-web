"use client";

import { AddPAyment } from "@/components/Invoices/AddPayment";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageInvoices } from "@/lib/permissions/invoices";
import React from "react";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageInvoices} redirectTo="/staff/invoices">
      <div>
        <AddPAyment />
      </div>
    </ManageAccessGate>
  );
}
