"use client";

import { ExpensesUpload } from "@/components/Expenses/ExpensesUpload";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageExpenses } from "@/lib/permissions/expenses";

export default function Page() {
  return (
    <ManageAccessGate permissionUtility={canManageExpenses} redirectTo="/staff/expense">
      <ExpensesUpload />
    </ManageAccessGate>
  );
}
