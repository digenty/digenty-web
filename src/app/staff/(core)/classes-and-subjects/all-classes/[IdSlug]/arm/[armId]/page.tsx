"use client";

import Class from "@/components/ClassesAndSubjects/Classes/AllClasses/Class";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

function page() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <div>
        <Class />
      </div>
    </ModulePermissionsWrapper>
  );
}

export default page;
