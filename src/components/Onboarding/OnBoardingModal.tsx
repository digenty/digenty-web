"use client";

import { useState } from "react";
import { LogoMark } from "../Icons/LogoMark";
import { WelcomeInputs } from "./WelcomeInputs";
import { Button } from "../ui/button";
import { SchoolOverview } from "./SchoolOverview";
import { useAddSchool } from "@/hooks/queryHooks/useSchool";
import { useFormik } from "formik";
import { CreateSchoolTypes } from "./types";
import { schoolSchema } from "@/schema/school";
import { Spinner } from "../ui/spinner";
import { toast } from "../Toast";

interface OnboardingModalProps {
  initialShow: boolean;
}

const OnboardingModal = ({ initialShow }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(initialShow);
  const totalSteps = 2;

  const { mutate, isPending } = useAddSchool();

  const formik = useFormik<CreateSchoolTypes>({
    initialValues: {
      firstName: "",
      lastName: "",
      schoolName: "",
      schoolSize: 1,
      role: "",
      country: "",
      currency: "",
    },
    validationSchema: schoolSchema,
    onSubmit: values => {
      if (step === 1) {
        mutate(values, {
          onSuccess: data => {
            console.log(data);
            toast({
              title: "School created successfully",
              description: data.message,
              type: "success",
            });
            setStep(2);
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not create a school",
              type: "error",
            });
          },
        });
      } else {
        setShowModal(false);
      }
    },
  });

  if (!showModal) return null;

  return (
    <form onSubmit={formik.handleSubmit} className="fixed inset-0 z-50 mx-3 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="bg-bg-card relative z-10 min-h-155 w-full max-w-175 rounded-xl">
        <div className="bg-bg-card-subtle border-border-default rounded-t-xl border-b">
          <div className="text-text-default text-md flex items-center gap-2 px-6 py-4 font-semibold">
            <LogoMark /> Digenty
          </div>
        </div>

        <div className="px-6 py-4">
          {step === 1 && <WelcomeInputs formik={formik} />}
          {step === 2 && <SchoolOverview />}
        </div>

        <div className="border-border-default border-t">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-text-muted text-sm">
              {step} of {totalSteps}
            </div>

            <Button
              type="submit"
              className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! flex items-center gap-2 border-none"
              disabled={isPending || (step === 1 && !formik.isValid)}
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Continue
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default OnboardingModal;
