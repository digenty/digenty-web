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
    label: "Class & Arms",
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
    <section className="my-6 flex w-full items-center justify-center">
      <div className="w-full space-y-4 px-4 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 lg:px-36">
          <CSVUploadProgress currentStep={currentStep} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>

        {currentStep === 1 && <SchoolStructure />}
        {currentStep === 2 && <ClassesAndArms />}
        {currentStep === 3 && <GradingAndAssessment />}
        {currentStep === 4 && <AdmissionNumberSetup />}

        <div className="border-border-default bg-bg-default sticky bottom-0 flex w-full justify-between border-t pt-3 lg:px-36">
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
