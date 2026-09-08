"use client";

import { ViewScore } from "@/components/ClassesAndSubjects/Subjects/Score/ViewScores";
import { Spinner } from "@/components/ui/spinner";
import { Suspense } from "react";
import { ModulePermissionsWrapper } from "@/components/ModulePermissionsWrapper";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";

const ViewScoresPage = () => {
  return (
    <ModulePermissionsWrapper permissionUtility={canViewClassesAndSubjects}>
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <Spinner className="size-16" />
          </div>
        }
      >
        <ViewScore />
      </Suspense>
    </ModulePermissionsWrapper>
  );
};

export default ViewScoresPage;
