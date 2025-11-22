"use client";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MyClasses } from "./Classes";
import { Subjects } from "./Subjects";

const tabs = [
  { id: "classes", label: "My Classes" },
  { id: "subjects", label: "My Subjects" },
];

const ClassesAndSubjects = () => {
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbStore();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "classes";

  useEffect(() => {
    setBreadcrumbs([
      { label: "Classes and Subjects", url: "/classes-and-subjects" },
      { label: tabs.find(tab => tab.id === activeTab)?.label ?? "", url: `/classes-and-subjects?tab=${activeTab}` },
    ]);
  }, [activeTab, router, setBreadcrumbs]);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:px-8">
      {/* Case 1: If user is a class teacher and  has subjects, show tabs */}
      {/* Case 2: If user is a subject teacher without classes (not a class teacher),  show only subjects, not tabs*/}
      {/* Case 3: If user is just a class teacher, no subjects, show only classes, no tabs */}

      {/* Tabs for Case 1 */}
      <div className="border-border-default mb-0 flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <div
              role="button"
              onClick={() => {
                router.push(`/classes-and-subjects?tab=${tab.id}`);
              }}
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

      {activeTab === "classes" ? <MyClasses /> : <Subjects />}

      {/*  Case 2  */}
      {/* <Subjects /> */}

      {/*  Case 3  */}
      {/* <div className="flex flex-col gap-4 pb-10">
        <h2 className="md:inline hidden text-text-default text-lg font-semibold md:text-2xl">My Classes</h2>
        <MyClasses />
      </div> */}
    </div>
  );
};

export default ClassesAndSubjects;
