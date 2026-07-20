"use client";

import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useSchoolFromCookie } from "@/hooks/useSchoolFromCookie";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Review } from "./Reviews";
import { YourDetails } from "./YourDetails";
import { ParentStudent } from "./ParentStudent";

const parentOnboardingSteps = [
  { id: "your-details", label: "Your Details" },
  { id: "student", label: "Student(s)" },
  { id: "review", label: "Review" },
];

export const ParentOnboarding = () => {
  const params = useSearchParams();
  const step = params.get("step") || "your-details";
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const school = useSchoolFromCookie();

  const steps = parentOnboardingSteps.map(({ id, label }) => ({
    id,
    label,
    completed: completedSteps.includes(id),
  }));

  return (
    <div className="flex flex-col gap-8">
      <ProgressIndicator currentStep={step} steps={steps} completedSteps={completedSteps} className="flex h-24 w-full" />

      {step === "your-details" && <YourDetails schoolId={school?.id} />}
      {step === "student" && <ParentStudent schoolId={school?.id} />}
      {step === "review" && <Review />}
    </div>
  );
};
