"use client";
import { PillTabs } from "../PillTabs";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MyClasses } from "./Classes";
import { Subjects } from "./Subjects";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubject";
import { useGetTeacherClasses } from "@/hooks/queryHooks/useClass";
import { Skeleton } from "../ui/skeleton";
import { PageEmptyState } from "../Error/PageEmptyState";
import { ClassesAndSubjectsPermissionWrapper } from "./ClassesAndSubjectsPermissionWrapper";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { AllClassesMain } from "./Classes/AllClasses";
import { Button } from "../ui/button";
import { AllBranches } from "./AllBranches/AllBranch";
import { canViewClassesAndSubjects } from "@/lib/permissions/classes-and-subjects";
const tabs = [
  { id: "classes", label: "My Classes" },
  { id: "subjects", label: "My Subjects" },
];

const ClassesAndSubjects = () => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "classes";

  const { data: subjectListResponse, isLoading: isLoadingSubjects } = useGetTeacherSubjects();
  const { data: classesResponse, isLoading: isLoadingClasses } = useGetTeacherClasses();
  const subjectList = subjectListResponse?.data?.data ?? [];
  const classes = classesResponse?.data?.data ?? [];
  const isLoading = isLoadingClasses || isLoadingSubjects;
  const hasClasses = classes.length > 0;
  const hasSubjects = subjectList.length > 0;
  const showTabs = hasClasses && hasSubjects;
  const { isUserLoading, ...user } = useLoggedInUser();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes and Subjects", url: "/staff/classes-and-subjects" },
      {
        label: showTabs ? (tabs.find(tab => tab.id === activeTab)?.label ?? "") : hasSubjects ? "My Subjects" : "My Classes",
        url: `/staff/classes-and-subjects${showTabs ? `?tab=${activeTab}` : ""}`,
      },
    ]);
  }, [activeTab, showTabs, hasSubjects, setBreadcrumbs]);

  if (isLoading || isUserLoading) {
    return (
      <ClassesAndSubjectsPermissionWrapper isLoading={true}>
        <div className="flex flex-col gap-4 px-4 py-4 md:px-8">
          <Skeleton className="bg-bg-input-soft h-100 w-full md:h-150" />
        </div>
      </ClassesAndSubjectsPermissionWrapper>
    );
  }

  if (user && user?.isAdmin && user?.adminBranchIds && user?.adminBranchIds?.length > 1 && !hasClasses && !hasSubjects) {
    return <AllClassesMain />;
  }

  if (user && user?.isMain && !hasClasses && !hasSubjects) {
    return <AllBranches />;
  }

  // Has module access but nothing assigned: show the full class list instead of an empty page.
  if (user && canViewClassesAndSubjects(user.permissions) && !hasClasses && !hasSubjects) {
    return <AllClassesMain />;
  }

  return (
    <ClassesAndSubjectsPermissionWrapper isLoading={isLoading}>
      <div className="flex flex-col gap-6 px-4 py-6 md:px-8">
        <>
          <div className="space-y-1">
            <h1 className="text-text-default text-xl font-semibold tracking-tight md:text-2xl">Classes &amp; Subjects</h1>
            <p className="text-text-muted text-xs md:text-sm">
              {hasClasses && hasSubjects
                ? "Your assigned classes and the subjects you teach."
                : hasSubjects
                  ? "The subjects you teach and their report status."
                  : hasClasses
                    ? "Your assigned classes."
                    : "Nothing has been assigned to you yet."}
            </p>
          </div>

          {/* Case 1: Class teacher with subjects — show tabs */}
          {showTabs && (
            <>
              <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <PillTabs tabs={tabs} activeId={activeTab} onChange={id => router.push(`/staff/classes-and-subjects?tab=${id}`)} />
                <div className="flex items-center gap-2">
                  {user && user?.isAdmin && user?.adminBranchIds && user?.adminBranchIds?.length > 1 && (
                    <Button
                      onClick={() => router.push("/staff/classes-and-subjects/all-classes")}
                      className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! text-text-default shadow-light h-8 rounded-lg border px-3"
                    >
                      View Branch Panel
                    </Button>
                  )}

                  {user && user?.isMain && (
                    <Button
                      onClick={() => router.push("/staff/classes-and-subjects/all-branches")}
                      className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! text-text-default shadow-light h-8 rounded-lg border px-3"
                    >
                      View All Branches
                    </Button>
                  )}
                </div>
              </div>
              {activeTab === "classes" ? (
                <MyClasses classes={classes} isLoading={isLoadingClasses} />
              ) : (
                <Subjects subjectList={subjectList} isLoading={isLoadingSubjects} />
              )}
            </>
          )}

          {/* Case 2: Subject teacher only */}
          {!hasClasses && hasSubjects && <Subjects subjectList={subjectList} isLoading={isLoadingSubjects} />}

          {/* Case 3: Class teacher only */}
          {hasClasses && !hasSubjects && (
            <div className="pb-10">
              <MyClasses classes={classes} isLoading={isLoadingClasses} />
            </div>
          )}

          {!hasClasses && !hasSubjects && (
            <PageEmptyState
              title="No class or subject found"
              description="No active class or subject available for you at the moment, kindly contact admin."
              buttonText="Go back"
            />
          )}
        </>
      </div>
    </ClassesAndSubjectsPermissionWrapper>
  );
};

export default ClassesAndSubjects;
