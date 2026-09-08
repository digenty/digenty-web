"use client";

import { Invoices } from "@/components/Invoices";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { Spinner } from "@/components/ui/spinner";
import { canViewInvoices } from "@/lib/permissions/invoices";
import { Suspense } from "react";

export default function InvoicesPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewInvoices}>
      <div>
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              <Spinner className="size-16" />
            </div>
          }
        >
          <Invoices />
        </Suspense>
      </div>
    </ModulePermissionsWrapper>
  );
}
