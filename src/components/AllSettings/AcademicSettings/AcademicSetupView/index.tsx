"use client";

import { AddFill, ArrowRightCircleFill, ViewTimelineT } from "@digenty/icons";
import { AcademicSession } from "@/api/types";

import { Button } from "@/components/ui/button";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdmissionNumberSetupDone } from "./AdmissionNumber";
import { AcademicDoneClassAndArms } from "./ClassesAndArms";
import { AcademicAssAndGradeSetupDone } from "./GradingAndAssessment";
import { SchoolSectionAndTerm } from "./SchoolSectionTerm";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassesAndArms } from "../AcademicSetup/ClassesAndArms";
const termsOptions = ["24/25 Session", "24/25 Session", "24/25 Session"];
const tabs = ["School, Session & Term", "Classes & Arms", "Assessment & Grading", "Admission Number"] as const;
type Tab = (typeof tabs)[number];

export const AcademicSetupView = () => {
  const router = useRouter();
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Academic", url: "/staff/settings/academic" },
  ]);
  const [activeTab, setActiveTab] = useState<Tab>("School, Session & Term");
  const [termSelected, setTermSelected] = useState(termsOptions[0]);
  const [isEditingClasses, setIsEditingClasses] = useState(false);

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
                <Button
                  onClick={() => router.push("/staff/settings/academic/academic-setup?step=school-structure")}
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-8! rounded-md text-sm md:ml-auto"
                >
                  <AddFill fill="var(--color-icon-white-default)" className="size-3" /> New Session
                </Button>
              </div>
            </div>
            <div className="w-full min-w-0">
              <div className="relative w-full max-w-full overflow-hidden py-4">
                <div className="border-border-default hide-scrollbar mb-10 flex w-full items-center gap-4 overflow-x-auto overscroll-x-contain border-b py-2 [-webkit-overflow-scrolling:touch] md:p-0">
                  {tabs.map(tab => {
                    const isActive = activeTab === tab;

                    return (
                      <Button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                          "hover:bg-bg-none! shrink-0 rounded-none text-center transition-all",
                          isActive && "md:border-border-informative md:border-b-[1.5px]",
                        )}
                      >
                        <span
                          className={cn(
                            "h-8 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-all",
                            isActive && ["bg-bg-state-soft text-text-default", "md:text-text-informative md:rounded-none md:bg-transparent"],
                            !isActive && "text-text-muted",
                          )}
                        >
                          {tab}
                        </span>
                      </Button>
                    );
                  })}
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
