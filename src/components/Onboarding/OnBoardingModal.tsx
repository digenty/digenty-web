"use client";

import { LogoMark } from "@digenty/icons";
import { createSession, deleteSession } from "@/app/actions/auth";
import { useReAutheticateUser } from "@/hooks/queryHooks/useAuth";
import { useAddBranch } from "@/hooks/queryHooks/useBranch";
import { useAddSchool } from "@/hooks/queryHooks/useSchool";
import { useIsMobile } from "@/hooks/useIsMobile";
import { schoolSchema } from "@/schema/school";
import { useFormik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { toast } from "../Toast";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { SchoolOverview } from "./SchoolOverview";
import { CreateSchoolTypes } from "./types";
import { WelcomeInputs } from "./WelcomeInputs";

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

const defaultSchoolValues: CreateSchoolTypes = {
  firstName: "",
  lastName: "",
  schoolName: "",
  schoolSize: "",
  role: "",
  country: "",
  currency: "",
};

const defaultBranchValues: BranchFormValues = {
  activeOption: null,
  numOfBranches: 2,
  branches: [
    { branchName: "", address: "", levels: [] },
    { branchName: "", address: "", levels: [] },
  ],
  singleBranch: { branchName: "", address: "", levels: [] },
};

const OnboardingModal = ({ initialShow }: OnboardingModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step");
  const step = stepParam ? parseInt(stepParam, 10) : 1;

  const setStep = (newStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const [showModal, setShowModal] = useState(initialShow);
  const isMobile = useIsMobile();
  const totalSteps = 2;

  const { mutate: mutateSchool, isPending: isSchoolPending } = useAddSchool();
  const { mutate: mutateBranch, isPending: isBranchPending } = useAddBranch();
  const { mutate: reAuthUser, isPending: isAuthenticating } = useReAutheticateUser();

  const schoolFormik = useFormik<CreateSchoolTypes>({
    initialValues: {
      firstName: "",
      lastName: "",
      schoolName: "",
      schoolSize: "",
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
          const nextStep = 2;
          setStep(nextStep);
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

      const formatLevels = (levels: string[]) => levels.map(level => level.toUpperCase());

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

      mutateBranch(payload, {
        onError: error => {
          toast({
            title: "Could not create branch(es)",
            description: error?.message || "Could not create branch(es)",
            type: "error",
          });
        },
        onSuccess: () => {
          reAuthUser(undefined, {
            onError: () => {
              deleteSession();
            },
            onSuccess: data => {
              // clearDrafts();
              createSession(data.data.token, "SCHOOL_STAFF");
              toast({ title: "Branch(es) created successfully", type: "success" });
              setShowModal(false);
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.delete("step");
              const queryString = newParams.toString();
              router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`);
            },
          });
        },
      });
    },
  });

  const schoolDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const branchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useEffect(() => {
  //   if (schoolDebounceRef.current) clearTimeout(schoolDebounceRef.current);
  //   schoolDebounceRef.current = setTimeout(() => {
  //     saveDraft(DRAFT_KEY_SCHOOL, schoolFormik.values);
  //   }, 500);
  //   return () => {
  //     if (schoolDebounceRef.current) clearTimeout(schoolDebounceRef.current);
  //   };
  // }, [schoolFormik.values]);

  // useEffect(() => {
  //   if (branchDebounceRef.current) clearTimeout(branchDebounceRef.current);
  //   branchDebounceRef.current = setTimeout(() => {
  //     saveDraft(DRAFT_KEY_BRANCH, branchFormik.values);
  //   }, 500);
  //   return () => {
  //     if (branchDebounceRef.current) clearTimeout(branchDebounceRef.current);
  //   };
  // }, [branchFormik.values]);

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
      return branches.every(b => b.branchName && b.address && b.levels.length > 0);
    }

    return false;
  };

  const isSchoolValid = Object.keys(schoolFormik.errors).length === 0 && Object.keys(schoolFormik.touched).length !== 0;

  const handleContinue = () => {
    if (step === 1) {
      schoolFormik.handleSubmit();
    } else {
      branchFormik.handleSubmit();
    }
  };

  const isContinueDisabled = (step === 1 && !isSchoolValid) || (step === 2 && !isStep2Valid());

  const isLoading = isSchoolPending || isAuthenticating || isBranchPending;

  if (!showModal) return null;

  const stepContent = (
    <div className="px-6 py-4">
      {step === 1 && <WelcomeInputs formik={schoolFormik} />}
      {step === 2 && <SchoolOverview formik={branchFormik} />}
    </div>
  );

  const continueButton = (
    <Button
      disabled={isContinueDisabled}
      onClick={handleContinue}
      className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! flex items-center gap-2 border-none"
    >
      {isLoading && <Spinner className="text-text-white-default" />}
      Continue
    </Button>
  );

  const stepIndicator = (
    <div className="text-text-muted text-sm">
      {step} of {totalSteps}
    </div>
  );

  return (
    <>
      {!isMobile && (
        <Modal
          open={showModal}
          setOpen={setShowModal}
          showCloseButton={false}
          className="sm:max-w-175"
          title={
            <span className="text-text-default text-md flex items-center gap-2">
              <LogoMark />
            </span>
          }
          cancelButton={stepIndicator}
          ActionButton={continueButton}
        >
          {stepContent}
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer
          open={showModal}
          setIsOpen={setShowModal}
          title={
            <span className="text-text-default text-md flex items-center gap-2">
              <LogoMark />
            </span>
          }
          showCloseButton={false}
          className=""
        >
          {stepContent}

          <div className="border-border-default fixed w-full border-t">
            <DialogFooter className="flex items-center justify-between px-6 py-2">
              {stepIndicator}
              {continueButton}
            </DialogFooter>
          </div>
        </MobileDrawer>
      )}
    </>
  );
};

export default OnboardingModal;
