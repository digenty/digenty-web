"use client";

import { AddStudentsForm } from "@/components/AllSettings/SubscriptionsSettings/AddStudentsForm";
import { SubscriptionBackLink } from "@/components/AllSettings/SubscriptionsSettings/SubscriptionBackLink";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageSettings } from "@/lib/permissions/settings";

const AddStudentsPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageSettings} redirectTo="/staff/settings/subscription">
      <div className="flex flex-col gap-6 p-4 md:p-8">
        <SubscriptionBackLink href="/staff/settings/subscription" />
        <AddStudentsForm />
      </div>
    </ManageAccessGate>
  );
};

export default AddStudentsPage;
