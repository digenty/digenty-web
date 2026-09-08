"use client";

import { ClassAttendance } from "@/components/AttendanceManagement/ClassAttendance";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageAttendance } from "@/lib/permissions/attendance";

export default function Page() {
  return (
    <ManageAccessGate permissionUtility={canManageAttendance} redirectTo="/staff/attendance">
      <ClassAttendance />
    </ManageAccessGate>
  );
}
