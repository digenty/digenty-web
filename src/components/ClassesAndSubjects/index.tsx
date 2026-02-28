"use client";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MyClasses } from "./Classes";
import { Subjects } from "./Subjects";
import { useGetTeacherSubjects } from "@/hooks/queryHooks/useSubject";
import { useGetTeacherClasses } from "@/hooks/queryHooks/useClass";
import { Skeleton } from "../ui/skeleton";
import { PageEmptyState } from "../Error/PageEmptyState";

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

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes and Subjects", url: "/classes-and-subjects" },
      {
        label: showTabs ? (tabs.find(tab => tab.id === activeTab)?.label ?? "") : hasSubjects ? "My Subjects" : "My Classes",
        url: `/classes-and-subjects${showTabs ? `?tab=${activeTab}` : ""}`,
      },
    ]);
  }, [activeTab, showTabs, hasSubjects, setBreadcrumbs]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:px-8">
      {isLoading && <Skeleton className="bg-bg-input-soft h-100 w-full md:h-150" />}

      {!isLoading && (
        <>
          {/* Case 1: Class teacher with subjects — show tabs */}
          {showTabs && (
            <>
              <div className="border-border-default mb-0 flex w-auto max-w-105 items-center gap-3 border-b">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <div
                      role="button"
                      onClick={() => router.push(`/classes-and-subjects?tab=${tab.id}`)}
                      key={tab.id}
                      className={cn(
                        "w-1/2 cursor-pointer py-2.5 text-center transition-all duration-150",
                        isActive && "border-border-informative border-b-[1.5px]",
                      )}
                    >
                      <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab.label}</span>
                    </div>
                  );
                })}
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
            <div className="flex flex-col gap-4 pb-10">
              <h2 className="text-text-default hidden text-lg font-semibold md:inline md:text-xl">My Classes</h2>
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
      )}
    </div>
  );
};

export default ClassesAndSubjects;
