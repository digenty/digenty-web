"use client";

import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useSchoolFromCookie } from "@/hooks/useSchoolFromCookie";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
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
  // The JWT already carries schoolId once the parent has signed up for a specific school, so prefer
  // it over the "school" cookie - that cookie is set by looking the host up as a subdomain at login
  // time, and never gets set at all when the host isn't a school subdomain (e.g. testing on plain
  // localhost), which otherwise leaves this stuck with no schoolId and every lookup below stuck loading.
  const { schoolId: jwtSchoolId } = useLoggedInUser();
  const school = useSchoolFromCookie();
  const schoolId = jwtSchoolId ?? school?.id;

  const steps = parentOnboardingSteps.map(({ id, label }) => ({
    id,
    label,
    completed: completedSteps.includes(id),
  }));

  return (
    <div className="flex flex-col gap-8">
      <ProgressIndicator currentStep={step} steps={steps} completedSteps={completedSteps} className="flex h-24 w-full" />

      {step === "your-details" && <YourDetails schoolId={schoolId} />}
      {step === "student" && <ParentStudent schoolId={schoolId} />}
      {step === "review" && <Review />}
    </div>
  );
};
