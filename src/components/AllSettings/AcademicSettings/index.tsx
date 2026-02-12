"use client";

import { CSVUploadProgress } from "@/components/StudentAndParent/BulkUpload/CSVUploadProgress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SchoolStructure } from "./SchoolStructure";
import { ClassesAndArms } from "./ClassesAndArms";
import { GradingAndAssessment } from "./GradingAndAssessment";
import { AdmissionNumberSetup } from "./AdmissionNumberSetup";
import { useRouter } from "next/navigation";

const academicSteps = [
  {
    id: 1,
    label: "School Structure",
    completed: false,
  },
  {
    id: 2,
    label: "class & Arms",
    completed: false,
  },
  {
    id: 3,
    label: "Grading & Assessment",
    completed: false,
  },
  {
    id: 4,
    label: "Admission Number",
    completed: false,
  },
];

export function AcademicSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = academicSteps.map(({ id, label }) => ({
    id,
    label,
    completed: false,
  }));

  // const activeStep = academicSteps.find(step => step.id === currentStep);
  const isLastStep = currentStep === academicSteps.length;

  return (
    <section className="my-6 flex w-full items-center justify-center md:w-271">
      <div className="w-full space-y-4 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 md:w-217 md:px-4">
          <CSVUploadProgress currentStep={currentStep} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>

        {currentStep === 1 && <SchoolStructure />}
        {currentStep === 2 && <ClassesAndArms />}
        {currentStep === 3 && <GradingAndAssessment />}
        {currentStep === 4 && <AdmissionNumberSetup />}

        <div className="flex items-center justify-between gap-3">
          <Button
            className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Previous
          </Button>

          <Button
            onClick={() => {
              if (isLastStep) {
                router.push("/settings/academic/academic-setup-done");
                return;
              }

              setCompletedSteps(prev => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
              setCurrentStep(prev => prev + 1);
            }}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default"
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </section>
  );
}
