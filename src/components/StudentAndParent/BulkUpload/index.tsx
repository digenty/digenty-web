"use client";
import { useState } from "react";
import { CSVUploadProgress } from "./CSVUploadProgress";
import { Step } from "./types";
import { CSVUpload } from "./CSVUpload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const steps: Step[] = [
  { id: 1, label: "Upload Student List", completed: false },
  { id: 2, label: "Confirm & Upload", completed: false },
];

export const StudentsUpload = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-150 space-y-4 md:space-y-6">
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" />
        <CSVUpload />

        <div className="border-border-default mt-10 flex w-full justify-between border-t py-4">
          <Button
            variant="outline"
            className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
          >
            Cancel
          </Button>

          <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1">
            {true && <Spinner />}
            <span className="text-sm font-medium">Continue</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
