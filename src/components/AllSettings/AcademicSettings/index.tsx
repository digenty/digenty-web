"use client";

import { CSVUploadProgress } from "@/components/StudentAndParent/BulkUpload/CSVUploadProgress";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { SchoolStructure, SchoolStructureHandle } from "./SchoolStructure";
import { ClassesAndArms } from "./ClassesAndArms";
import { GradingAndAssessment, GradingAndAssessmentHandle } from "./GradingAndAssessment";
import { AdmissionNumberSetup, AdmissionNumberSetupHandle } from "./AdmissionNumberSetup";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  // const classesAndArmsRef = useRef<ClassesAndArmsHandle>(null);
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
  };

  return (
    <section className="my-6 flex w-full items-center justify-center">
      <div className="w-full space-y-4 px-4 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 lg:px-36">
          <CSVUploadProgress currentStep={currentStep} steps={steps} completedSteps={completedSteps} className="flex w-full" />
        </div>

        <div className={currentStep === 1 ? "block" : "hidden"}>
          <SchoolStructure ref={schoolStructureRef} />
        </div>
        <div className={currentStep === 2 ? "block" : "hidden"}>
          <ClassesAndArms />
        </div>
        <div className={currentStep === 3 ? "block" : "hidden"}>
          <GradingAndAssessment ref={assessmentAndGradingRef} />
        </div>
        <div className={currentStep === 4 ? "block" : "hidden"}>
          <AdmissionNumberSetup ref={admissionRef} />
        </div>

        <div className="border-border-default bg-bg-default sticky bottom-0 flex w-full justify-between border-t pt-3 lg:px-36">
          <Button
            className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : isLastStep ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
