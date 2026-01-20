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
    component: <SchoolStructure />,
  },
  {
    id: 2,
    label: "class & Arms",
    component: <ClassesAndArms />,
  },
  {
    id: 3,
    label: "Grading & Assessment",
    component: <GradingAndAssessment />,
  },
  {
    id: 4,
    label: "Admission Number",
    component: <AdmissionNumberSetup />,
  },
];

export function AcademicSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = academicSteps.map(({ id, label }) => ({
    id,
    label,
  }));

  const activeStep = academicSteps.find(step => step.id === currentStep);
  const isLastStep = currentStep === academicSteps.length;

  return (
    <section className="mx-auto my-6 flex w-full items-center justify-center md:w-271">
      <div className="w-full space-y-4 md:space-y-6">
        <div className="">
          <CSVUploadProgress currentStep={currentStep} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>
        <div className="mx-auto flex items-center justify-center">{activeStep?.component}</div>

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
