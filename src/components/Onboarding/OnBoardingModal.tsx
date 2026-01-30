"use client";

import { useState } from "react";
import { LogoMark } from "../Icons/LogoMark";
import { WelcomeInputs } from "./WelcomeInputs";
import { Button } from "../ui/button";
import { SchoolOverview } from "./SchoolOverview";

interface OnboardingModalProps {
  initialShow: boolean;
}

const OnboardingModal = ({ initialShow }: OnboardingModalProps) => {
  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState(initialShow);
  const totalSteps = 2;
  const nextStep = () => {
    if (step === 2) {
      setShowModal(false);
    } else {
      setStep(step + 1);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      <div className="bg-bg-card relative z-10 max-h-155 w-full max-w-175 rounded-md">
        <div className="bg-bg-card-subtle border-border-default rounded-t-md border-b">
          <div className="text-text-default text-md flex items-center gap-2 px-6 py-4 font-semibold">
            <LogoMark /> Digenty
          </div>
        </div>

        <div className="px-6 py-4">
          {step === 1 && <WelcomeInputs />}

          {step === 2 && <SchoolOverview />}
        </div>

        <div className="border-border-default border-t">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-text-muted text-sm">
              {step} of {totalSteps}
            </div>
            <Button onClick={nextStep} className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! border-none">
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
