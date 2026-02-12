"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "../Icons/LogoMark";
import { WelcomeInputs } from "./WelcomeInputs";
import { Button } from "../ui/button";
import { SchoolOverview } from "./SchoolOverview";
import { useAddSchool } from "@/hooks/queryHooks/useSchool";
import { useAddBranch } from "@/hooks/queryHooks/useBranch";
import { useFormik } from "formik";
import { CreateSchoolTypes } from "./types";
import { schoolSchema } from "@/schema/school";
import { Spinner } from "../ui/spinner";
import { toast } from "../Toast";

interface OnboardingModalProps {
  initialShow: boolean;
}

interface BranchFormValues {
  activeOption: "one" | "multiple" | null;
  numOfBranches: number;
  branches: { branchName: string; address: string; levels: string[] }[];
  singleBranch: { branchName: string; address: string; levels: string[] };
}

interface CreateBranchPayload {
  branchDtos: { branchName: string; address: string; levels: string[] }[];
}

const OnboardingModal = ({ initialShow }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(initialShow);
  const totalSteps = 2;

  const { mutate: mutateSchool, isPending: isSchoolPending } = useAddSchool();
  const { mutate: mutateBranch, isPending: isBranchPending } = useAddBranch();

  const schoolFormik = useFormik<CreateSchoolTypes>({
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
      mutateSchool(values, {
        onSuccess: data => {
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
    },
  });

  const branchFormik = useFormik<BranchFormValues>({
    initialValues: {
      activeOption: null,
      numOfBranches: 2,
      branches: [
        { branchName: "", address: "", levels: [] },
        { branchName: "", address: "", levels: [] },
      ],
      singleBranch: { branchName: "", address: "", levels: [] },
    },
    onSubmit: async values => {
      if (!values.activeOption) {
        toast({ title: "Please select a branch option", type: "error" });
        return;
      }

      const formatLevels = (levels: string[]) => levels.map(l => l.toUpperCase());

      let payload: CreateBranchPayload;

      if (values.activeOption === "one") {
        if (!values.singleBranch.branchName || !values.singleBranch.address || values.singleBranch.levels.length === 0) {
          toast({ title: "Fill all required fields for the branch", type: "error" });
          return;
        }

        payload = {
          branchDtos: [
            {
              branchName: values.singleBranch.branchName,
              address: values.singleBranch.address,
              levels: formatLevels(values.singleBranch.levels),
            },
          ],
        };
      } else {
        const filledBranches = values.branches.filter(b => b.branchName && b.address && b.levels.length > 0);

        if (filledBranches.length === 0) {
          toast({ title: "Fill at least one branch completely", type: "error" });
          return;
        }

        payload = {
          branchDtos: filledBranches.map(b => ({
            branchName: b.branchName,
            address: b.address,
            levels: formatLevels(b.levels),
          })),
        };
      }
      console.log(payload);
      try {
        mutateBranch(payload);

        toast({ title: "Branch(es) created successfully", type: "success" });
        setShowModal(false);
      } catch (err: unknown) {
        toast({ title: err instanceof Error ? err.message : "Could not create branch(es)", type: "error" });
      }
    },
  });

  // Keep the branch array in sync with numOfBranches
  useEffect(() => {
    const targetLength = branchFormik.values.numOfBranches;
    const updated = [...branchFormik.values.branches];

    while (updated.length < targetLength) updated.push({ branchName: "", address: "", levels: [] });
    while (updated.length > targetLength) updated.pop();

    branchFormik.setFieldValue("branches", updated);
  }, [branchFormik.values.numOfBranches]);

  const isStep2Valid = () => {
    const { activeOption, singleBranch, branches } = branchFormik.values;
    if (!activeOption) return false;

    if (activeOption === "one") {
      return singleBranch.branchName && singleBranch.address && singleBranch.levels.length > 0;
    }

    if (activeOption === "multiple") {
      return branches.some(b => b.branchName && b.address && b.levels.length > 0);
    }

    return false;
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 mx-3 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      <div className="bg-bg-card relative z-10 min-h-155 w-full max-w-175 rounded-xl">
        <div className="bg-bg-card-subtle border-border-default rounded-t-xl border-b">
          <div className="text-text-default text-md flex items-center gap-2 px-6 py-4 font-semibold">
            <LogoMark /> Digenty
          </div>
        </div>

        <div className="px-6 py-4">
          {step === 1 && <WelcomeInputs formik={schoolFormik} />}
          {step === 2 && <SchoolOverview formik={branchFormik} />}
        </div>

        <div className="border-border-default border-t">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="text-text-muted text-sm">
              {step} of {totalSteps}
            </div>

            <Button
              onClick={() => {
                if (step === 1) {
                  schoolFormik.handleSubmit();
                } else {
                  branchFormik.handleSubmit();
                }
              }}
              className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! flex items-center gap-2 border-none"
              disabled={(step === 1 && (isSchoolPending || !schoolFormik.isValid)) || (step === 2 && (isBranchPending || !isStep2Valid()))}
            >
              {(isSchoolPending || isBranchPending) && <Spinner className="text-text-white-default" />}
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
