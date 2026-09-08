"use client";

import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { NewInvoice } from "@/components/Invoices/NewInvoice";
import { Spinner } from "@/components/ui/spinner";
import { canManageInvoices } from "@/lib/permissions/invoices";
import { Suspense } from "react";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageInvoices} redirectTo="/staff/invoices">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <NewInvoice />
      </Suspense>
    </ManageAccessGate>
  );
}
