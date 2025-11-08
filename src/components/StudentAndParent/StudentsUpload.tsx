"use client";
import { useState } from "react";
import { CSVUploadProgress } from "./BulkUpload/CSVUploadProgress";
import { Step } from "./BulkUpload/types";
import { CSVUpload } from "./BulkUpload/CSVUpload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { ConfirmUpload } from "./BulkUpload/ConfirmUpload";

const steps: Step[] = [
  { id: 1, label: "Upload Students", completed: false },
  { id: 2, label: "Confirm & Upload", completed: false },
];

export const StudentsUpload = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const goToNext = () => {
    // Check if the previous step is completed, then add step to completed steps array
    setCompletedSteps(completedSteps => [...completedSteps, currentStep]);

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep === steps.length) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-150 space-y-4 md:space-y-6">
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" completedSteps={completedSteps} />

        {currentStep === steps.length ? <ConfirmUpload entity="Students" /> : <CSVUpload entity="Students" />}

        <div className="border-border-default mt-10 flex w-full justify-between border-t py-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
          >
            {currentStep === steps.length ? "Back" : "Cancel"}
          </Button>

          <Button onClick={goToNext} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
            {true && <Spinner />}
            <span className="text-sm font-medium">{currentStep === steps.length ? "Confirm & Import" : "Continue"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
