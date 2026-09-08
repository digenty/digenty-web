"use client";

import ScoreInput from "@/components/ClassesAndSubjects/Subjects/Score";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

export default function page() {
  return (
    <ManageAccessGate permissionUtility={canManageClassesAndSubjects} redirectTo="/staff/classes-and-subjects">
      <div>
        <ScoreInput />
      </div>
    </ManageAccessGate>
  );
}
