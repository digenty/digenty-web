"use client";

import { ManageEditRequest } from "@/components/ClassesAndSubjects/AllBranches/ManagaeEditRequests";
import React from "react";
import { ManageAccessGate } from "@/components/ModulePermissionsWrapper/ManageAccessGate";
import { canManageClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

const ManageEditRequestPage = () => {
  return (
    <ManageAccessGate permissionUtility={canManageClassesAndSubjects} redirectTo="/staff/classes-and-subjects">
      <div>
        <ManageEditRequest />
      </div>
    </ManageAccessGate>
  );
};

export default ManageEditRequestPage;
