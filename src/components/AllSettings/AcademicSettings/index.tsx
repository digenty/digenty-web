"use client";

import { CSVUploadProgress } from "@/components/StudentAndParent/BulkUpload/CSVUploadProgress";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AdmissionNumberSetup, AdmissionNumberSetupHandle } from "./AdmissionNumberSetup";
import { ClassesAndArms } from "./ClassesAndArms";
import { GradingAndAssessment, GradingAndAssessmentHandle } from "./GradingAndAssessment";
import { SchoolStructure, SchoolStructureHandle } from "./SchoolStructure";

const academicSteps = [
  { id: 1, label: "School Structure", completed: false },
  { id: 2, label: "Class & Arms", completed: false },
  { id: 3, label: "Grading & Assessment", completed: false },
  { id: 4, label: "Admission Number", completed: false },
];

export function AcademicSetup() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schoolStructureRef = useRef<SchoolStructureHandle>(null);
  const assessmentAndGradingRef = useRef<GradingAndAssessmentHandle>(null);
  const admissionRef = useRef<AdmissionNumberSetupHandle>(null);

  const steps = academicSteps.map(({ id, label }) => ({
    id,
    label,
    completed: completedSteps.includes(id),
  }));

  const isLastStep = currentStep === academicSteps.length;

  const handleNext = async () => {
    const stepRefMap: Record<number, { submit: () => Promise<boolean> } | null> = {
      1: schoolStructureRef.current,
      2: null,
      3: assessmentAndGradingRef.current,
      4: admissionRef.current,
    };

    const currentRef = stepRefMap[currentStep];

    if (currentRef) {
      setIsSubmitting(true);
      const success = await currentRef.submit();
      setIsSubmitting(false);
      if (!success) return;
    }

    setCompletedSteps(prev => (prev.includes(currentStep) ? prev : [...prev, currentStep]));

    if (isLastStep) {
      router.push("/settings/academic/academic-setup-done");
    } else {
      setCurrentStep(prev => prev + 1);
    }
    setCurrentStep(prev => prev + 1);
  };

  return (
    <section className="mt-6 flex min-h-[calc(100vh-120px)] w-full flex-col">
      <div className="w-full flex-1 space-y-4 px-4 pb-10 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 lg:px-36">
          <CSVUploadProgress currentStep={currentStep} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>

        {currentStep === 1 && (
          <div>
            <SchoolStructure ref={schoolStructureRef} />
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <ClassesAndArms />
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <GradingAndAssessment ref={assessmentAndGradingRef} />
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <AdmissionNumberSetup ref={admissionRef} />
          </div>
        )}
      </div>
      <div className="border-border-default bg-bg-default sticky bottom-0 flex w-full justify-between border-t px-4 pt-3 lg:px-36">
        <Button
          className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!"
          disabled={currentStep === 1 || isSubmitting}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
        >
          {isSubmitting ? <Spinner className="text-text-white-default mr-3 h-4 w-4" /> : isLastStep ? "Finish" : "Next"}
        </Button>
      </div>
    </section>
  );
}
