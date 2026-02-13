"use client";

import { createSession, deleteSession } from "@/app/actions/auth";
import { useReAutheticateUser } from "@/hooks/queryHooks/useAuth";
import { useAddBranch } from "@/hooks/queryHooks/useBranch";
import { useAddSchool } from "@/hooks/queryHooks/useSchool";
import { schoolSchema } from "@/schema/school";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { LogoMark } from "../Icons/LogoMark";
import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { toast } from "../Toast";
import { Button } from "../ui/button";
import { DialogFooter } from "../ui/dialog";
import { Spinner } from "../ui/spinner";
import { SchoolOverview } from "./SchoolOverview";
import { CreateSchoolTypes } from "./types";
import { WelcomeInputs } from "./WelcomeInputs";
import { useIsMobile } from "@/hooks/useIsMobile";

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
        onError: () => {
          toast({ title: "Branch(es) created successfully", type: "success" });
          setShowModal(false);
        },
        onSuccess: () => {
          // reauthenticate user to pass user's schoolid into token
          reAuthUser(undefined, {
            onError: () => {
              deleteSession();
            },
            onSuccess: data => {
              createSession(data.data.token);
              toast({ title: "Branch(es) created successfully", type: "success" });
              setShowModal(false);
            },
          });
        },
      });
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

  const isSchoolValid = Object.keys(schoolFormik.errors).length === 0 && Object.keys(schoolFormik.touched).length !== 0;
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
              <LogoMark /> Digenty
            </span>
          }
          cancelButton={
            <div className="text-text-muted text-sm">
              {step} of {totalSteps}
            </div>
          }
          ActionButton={
            <Button
              disabled={(step === 1 && !isSchoolValid) || (step === 2 && !isStep2Valid())}
              onClick={() => {
                if (step === 1) {
                  schoolFormik.handleSubmit();
                } else {
                  branchFormik.handleSubmit();
                }
              }}
              className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! flex items-center gap-2 border-none"
            >
              {(isSchoolPending || isAuthenticating || isBranchPending) && <Spinner className="text-text-white-default" />}
              Continue
            </Button>
          }
        >
          <div className="px-6 py-4">
            {step === 1 && <WelcomeInputs formik={schoolFormik} />}
            {step === 2 && <SchoolOverview formik={branchFormik} />}
          </div>
        </Modal>
      )}

      {isMobile && (
        <MobileDrawer
          open={showModal}
          setIsOpen={setShowModal}
          title={
            <span className="text-text-default text-md flex items-center gap-2">
              <LogoMark /> Digenty
            </span>
          }
          showCloseButton={false}
          className=""
        >
          <div className="px-6 py-4">
            {step === 1 && <WelcomeInputs formik={schoolFormik} />}
            {step === 2 && <SchoolOverview formik={branchFormik} />}
          </div>

          <div className="border-border-default fixed w-full border-t">
            <DialogFooter className="flex items-center justify-between px-6 py-2">
              <div className="text-text-muted text-sm">
                {step} of {totalSteps}
              </div>

              <Button
                disabled={(step === 1 && !isSchoolValid) || (step === 2 && !isStep2Valid())}
                onClick={() => {
                  if (step === 1) {
                    schoolFormik.handleSubmit();
                  } else {
                    branchFormik.handleSubmit();
                  }
                }}
                className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! flex items-center gap-2 border-none"
              >
                {(isSchoolPending || isAuthenticating || isBranchPending) && <Spinner className="text-text-white-default" />}
                Continue
              </Button>
            </DialogFooter>
          </div>
        </MobileDrawer>
      )}
    </>
  );
};

export default OnboardingModal;
