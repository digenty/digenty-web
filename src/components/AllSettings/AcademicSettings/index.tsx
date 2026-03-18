"use client";

import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AdmissionNumberSetup } from "./AdmissionNumberSetup";
import { ClassesAndArms } from "./ClassesAndArms";
import { GradingAndAssessment } from "./GradingAndAssessment";
import { SchoolStructure } from "./SchoolStructure";

const academicSteps = [
  { id: "school-structure", label: "School Structure" },
  { id: "class-and-arms", label: "Class & Arms" },
  { id: "grading-and-assessment", label: "Grading & Assessment" },
  { id: "admission-number", label: "Admission Number" },
];

export const AcademicSetup = () => {
  const params = useSearchParams();
  const step = params.get("step") || "school-structure";
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = academicSteps.map(({ id, label }) => ({
    id,
    label,
    completed: completedSteps.includes(id),
  }));

  return (
    <section className="flex w-full flex-1 flex-col pt-4 pb-20">
      <div className="w-full flex-1 space-y-4 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 lg:px-36">
          <ProgressIndicator currentStep={step} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>

        {step === "school-structure" && (
          <div>
            <SchoolStructure setCompletedSteps={setCompletedSteps} completedSteps={completedSteps} />
          </div>
        )}
        {step === "class-and-arms" && (
          <div className="flex flex-1 flex-col">
            <ClassesAndArms setCompletedSteps={setCompletedSteps} completedSteps={completedSteps} />
          </div>
        )}
        {step === "grading-and-assessment" && (
          <div>
            <GradingAndAssessment setCompletedSteps={setCompletedSteps} completedSteps={completedSteps} />
          </div>
        )}
        {step === "admission-number" && (
          <div>
            <AdmissionNumberSetup setCompletedSteps={setCompletedSteps} completedSteps={completedSteps} />
          </div>
        )}
      </div>
    </section>
  );
};
