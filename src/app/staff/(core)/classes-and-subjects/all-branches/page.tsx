"use client";

import { AllBranches } from "@/components/ClassesAndSubjects/AllBranches/AllBranch";
import React from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

const Allbranches = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <div>
        <AllBranches />
      </div>
    </ModulePermissionsWrapper>
  );
};

export default Allbranches;
