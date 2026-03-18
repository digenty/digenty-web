"use client";

import { CSVUploadProgress } from "@/components/StudentAndParent/BulkUpload/CSVUploadProgress";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { AdmissionNumberSetup, AdmissionNumberSetupHandle } from "./AdmissionNumberSetup";
import { ClassesAndArms } from "./ClassesAndArms";
import { GradingAndAssessment, GradingAndAssessmentHandle } from "./GradingAndAssessment";
import { SchoolStructure, SchoolStructureHandle } from "./SchoolStructure";

const academicSteps = [
  { id: "school-structure", label: "School Structure" },
  { id: "class-and-arms", label: "Class & Arms" },
  { id: "grading-and-assessment", label: "Grading & Assessment" },
  { id: "admission-number", label: "Admission Number" },
];

export const AcademicSetup = () => {
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step") || "school-structure";

  const [currentStep, setCurrentStep] = useState(step || "school-structure");
  // const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // const schoolStructureRef = useRef<SchoolStructureHandle>(null);
  // const assessmentAndGradingRef = useRef<GradingAndAssessmentHandle>(null);
  // const admissionRef = useRef<AdmissionNumberSetupHandle>(null);

  const steps = academicSteps.map(({ id, label }) => ({
    id,
    label,
    completed: completedSteps.includes(id),
  }));

  // const isLastStep = currentStep === academicSteps.length;

  const handleNext = async () => {
    // const stepRefMap: Record<number, { submit: () => Promise<boolean> } | null> = {
    //   1: schoolStructureRef.current,
    //   2: null,
    //   3: assessmentAndGradingRef.current,
    //   4: admissionRef.current,
    // };
    // const currentRef = stepRefMap[currentStep];
    // if (currentRef) {
    //   setIsSubmitting(true);
    //   const success = await currentRef.submit();
    //   setIsSubmitting(false);
    //   if (!success) return;
    // }
    // setCompletedSteps(prev => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    // if (isLastStep) {
    //   router.push("/settings/academic/academic-setup-done");
    // } else {
    //   setCurrentStep(prev => prev + 1);
    // }
    // setCurrentStep(prev => prev + 1);
  };

  return (
    <section className="flex w-full flex-1 flex-col pt-4 pb-20">
      <div className="w-full flex-1 space-y-4 md:space-y-6">
        <div className="mx-auto flex w-full flex-col gap-4 lg:px-36">
          <CSVUploadProgress currentStep={step} steps={steps} completedSteps={completedSteps} className="flex w-full" />
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
            <AdmissionNumberSetup />
          </div>
        )}
      </div>

      {/* <div className="border-border-default bg-bg-default sticky bottom-0 flex w-full justify-between border-t px-4 pt-3 lg:px-36">
        <Button
          className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!"
          disabled={currentStep === "school-structure" || isSubmitting}
        // onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
        >
          {isSubmitting ? <Spinner className="text-text-white-default mr-3 h-4 w-4" /> : currentStep === "admission-number" ? "Finish" : "Next"}
        </Button>
      </div> */}
    </section>
  );
};
