"use client";

import { SubjectTeachers } from "@/components/AllSettings/PermissionsSettings/SubjectTeacher";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewSettings } from "@/lib/permissions/settings";
import React from "react";

const SubjectTeachersPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewSettings}>
      <div>
        <SubjectTeachers />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default SubjectTeachersPage;
