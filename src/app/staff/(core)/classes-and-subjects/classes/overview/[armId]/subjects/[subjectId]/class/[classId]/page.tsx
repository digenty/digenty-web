"use client";

import { SubjectByClass } from "@/components/ClassesAndSubjects/Classes/ClassOverview/ClassSubject";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

export default function ViewSubjectScores() {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <SubjectByClass />
      </Suspense>
    </ModulePermissionsWrapper>
  );
}
