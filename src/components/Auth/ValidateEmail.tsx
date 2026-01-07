"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetUserByEmail } from "@/hooks/queryHooks/useUser";
import { cn } from "@/lib/utils";
import { emailSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { LoginPasswordForm } from "./Login/LoginPasswordForm";
import { SignupPasswordForm } from "./Signup/SignupPasswordForm";

export const ValidateEmail = () => {
  const [checkEmail, setCheckEmail] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const step = params.get("step");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: emailSchema,
    onSubmit: () => {
      setCheckEmail(true);
      setEmail(formik.values.email);
    },
  });

  const { data, error, isLoading, isSuccess, isError } = useGetUserByEmail(formik.values.email, checkEmail);

  useEffect(() => {
    if (isSuccess) {
      formik.resetForm();
      setCheckEmail(false);
      router.push(`/auth?step=login`);
    }

    if (isError) {
      formik.resetForm();
      setCheckEmail(false);
      router.push(`/auth?step=signup`);
    }
  }, [isSuccess, isError, error, data, router, formik]);

  return (
    <div className="w-full">
      {!step ? (
        <form noValidate onSubmit={formik.handleSubmit} className="space-y-4">
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
              type="submit"
              className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
            >
              {isLoading && <Spinner className="text-text-white-default" />}
              Continue
            </Button>
            <p className="text-text-muted text-center text-xs">Trusted by 1,200+ schools and educators</p>
          </div>
        </form>
      ) : step === "login" ? (
        <LoginPasswordForm email={email} />
      ) : (
        <SignupPasswordForm email={email} />
      )}
    </div>
  );
};
