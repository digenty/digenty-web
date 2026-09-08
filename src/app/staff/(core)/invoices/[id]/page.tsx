"use client";

import { InvoiceDetail } from "@/components/Invoices/InvoiceId";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewInvoices } from "@/lib/permissions/invoices";
import React from "react";

export default function InvoiceIdPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewInvoices}>
      <div>
        <InvoiceDetail />
      </div>
    </ModulePermissionsWrapper>
  );
}
