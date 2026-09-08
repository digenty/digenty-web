"use client";

import ClassReport from "@/components/ClassesAndSubjects/Classes/AllClasses/AdminClassReport";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

const page = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <div>
        <ClassReport />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default page;
