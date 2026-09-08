"use client";

import { InvoiceSetting } from "@/components/AllSettings/InvoiceSettings";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

export default function InvoiceSettingPage() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <InvoiceSetting />
      </div>
    </ModulePermissionsWrapper>
  );
}
