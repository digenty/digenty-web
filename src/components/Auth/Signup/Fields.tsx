"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { useState } from "react";
import { PasswordForm } from "./PasswordForm";

export const Fields = ({ setNextStep, nextStep }: { setNextStep: (value: "login" | "signup") => void; nextStep: "login" | "signup" | null }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  // const router = useRouter();
  // const params = useSearchParams();
  // const authStep = params.get("step");

  // useEffect(() => {
  //   if (authStep === "login" || authStep === "signup") {
  //     setShowPasswordInput(true);
  //   setNextStep("login");
  //   }
  // }, [authStep, setNextStep]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: authSchema,
    onSubmit: async values => {
      console.log(values);
    },
  });

  const displayPasswordInput = () => {
    setShowPasswordInput(true);
    setNextStep("login");
    // router.push(`/auth?step=login`)
  };

  return (
    <div className="w-full space-y-4">
      {!showPasswordInput ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-default text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              onChange={formik.handleChange}
              autoFocus
              placeholder="example@domain.com"
              onBlur={formik.handleBlur}
              value={formik.values.email}
              type="text"
              className={cn(
                "text-text-muted bg-bg-input-soft! w-full rounded-lg border-none text-sm font-normal",
                formik.errors.email && formik.touched.email && "border-text-error/50 border",
              )}
            />
            {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-light">{formik.errors.email}</p>}
          </div>

          <div className="space-y-8">
            <Button
              disabled={!formik.values.email}
              onClick={() => displayPasswordInput()}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
            >
              Continue
            </Button>
            <p className="text-text-muted text-center text-xs">Trusted by 1,200+ schools and educators</p>
          </div>
        </>
      ) : (
        <PasswordForm email={formik.values.email} step={nextStep} />
      )}
    </div>
  );
};
