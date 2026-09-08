"use client";

import { AllClassesMain } from "@/components/ClassesAndSubjects/Classes/AllClasses";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

const page = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <AllClassesMain />
      </Suspense>
    </ModulePermissionsWrapper>
  );
};

export default page;
