"use client";

import { AddFill, ArrowRightCircleFill, ViewTimelineT } from "@digenty/icons";
import { AcademicSession } from "@/api/types";

import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useScrollEdges } from "@/hooks/useScrollEdges";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdmissionNumberSetupDone } from "./AdmissionNumber";
import { AcademicDoneClassAndArms } from "./ClassesAndArms";
import { DevelopmentSettings } from "./DevelopmentSettings";
import { AcademicAssAndGradeSetupDone } from "./GradingAndAssessment";
import { SchoolSectionAndTerm } from "./SchoolSectionTerm";
import { Skeleton } from "@/components/ui/skeleton";
const tabs = ["School, Session & Term", "Classes & Arms", "Assessment & Grading", "Development Skills", "Admission Number"] as const;
type Tab = (typeof tabs)[number];

export const AcademicSetupView = () => {
  const router = useRouter();
  const { ref: tabsScrollRef, atStart: tabsAtStart, atEnd: tabsAtEnd } = useScrollEdges<HTMLDivElement>();
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Academic", url: "/staff/settings/academic" },
  ]);
  const [activeTab, setActiveTab] = useState<Tab>("School, Session & Term");

  const { data: academicResponse, isLoading: isLoadingSession } = useGetActiveSession();
  const session: AcademicSession | undefined = academicResponse?.data;

  return (
    <div className="">
      {isLoadingSession && !session && (
        <div className="p-4 md:p-8">
          <Skeleton className="bg-bg-state-soft! h-200 w-full" />
        </div>
      )}
      {!session && !isLoadingSession && (
        <div className="flex h-screen items-center justify-center px-4 py-4 md:px-6">
          <div className="flex flex-col items-center gap-4">
            <ViewTimelineT />
            <div className="text-center">
              <div className="text-text-default text-lg font-medium">Let’s set up your academic structure</div>
              <div className="text-text-muted text-xs">You’ve not set up your academic structure. Click below to set it up.</div>
            </div>
            <Button
              onClick={() => router.push("/staff/settings/academic/academic-setup?step=school-structure")}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
            >
              Set Up <ArrowRightCircleFill fill="var(--color-icon-white-default)" />
            </Button>
          </div>
        </div>
      )}

      {session && (
        <>
          <div className="">
            <div className="bg-bg-subtle border-border-darker w-full border-b">
              <div className="flex items-center justify-start! gap-2 p-4 md:justify-end">
                <PermissionCheck permissionUtility={canManageSettings}>
                  <Button
                    onClick={() => router.push("/staff/settings/academic/academic-setup?step=school-structure")}
                    className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8! rounded-md text-sm md:ml-auto"
                  >
                    <AddFill fill="var(--color-icon-white-default)" className="size-3" /> New Session
                  </Button>
                </PermissionCheck>
              </div>
            </div>
            <div className="w-full min-w-0">
              <div className="w-full max-w-full py-4">
                <div className="relative mb-10">
                  <div
                    ref={tabsScrollRef}
                    className="hide-scrollbar border-border-default flex w-full items-center gap-4 overflow-x-auto overscroll-x-contain border-b pt-2 [-webkit-overflow-scrolling:touch]"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {tabs.map(tab => {
                      const isActive = activeTab === tab;

                      return (
                        <div
                          key={tab}
                          className={cn("shrink-0 border-b-[1.5px] border-transparent pb-2 transition-all", isActive && "border-border-informative")}
                        >
                          <Button onClick={() => setActiveTab(tab)} className="hover:bg-bg-none! rounded-none text-center transition-all">
                            <span
                              className={cn(
                                "h-8 rounded-none px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
                                isActive ? "text-text-informative bg-transparent" : "text-text-muted",
                              )}
                            >
                              {tab}
                            </span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  {!tabsAtStart && (
                    <div className="from-bg-default pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent" />
                  )}
                  {!tabsAtEnd && (
                    <div className="from-bg-default pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 min-w-0 overflow-x-hidden px-4 py-4 md:px-6">
              {activeTab === "School, Session & Term" && (
                <div className="">
                  <SchoolSectionAndTerm session={session} isLoadingSession={isLoadingSession} />
                </div>
              )}
              {activeTab === "Classes & Arms" && <AcademicDoneClassAndArms />}
              {activeTab === "Assessment & Grading" && (
                <div className="">
                  <AcademicAssAndGradeSetupDone />
                </div>
              )}
              {activeTab === "Development Skills" && (
                <div className="">
                  <DevelopmentSettings />
                </div>
              )}
              {activeTab === "Admission Number" && (
                <div className="">
                  <AdmissionNumberSetupDone />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
