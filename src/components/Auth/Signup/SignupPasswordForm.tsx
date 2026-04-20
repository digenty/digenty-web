"use client";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useParentSignup, useSignup } from "@/hooks/queryHooks/useAuth";
import { cn } from "@/lib/utils";
import { authSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordChecklist } from "../PasswordCheckList";
import { Checkbox } from "@/components/ui/checkbox";
import { LegalModal } from "../LegalModal";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/constants/legal";
import Link from "next/link";

export const SignupPasswordForm = ({ email, userType }: { email: string; userType: "SCHOOL_STAFF" | "PARENT" }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIsFulfilled, setPasswordIsFulfilled] = useState(false);

  const { mutate, isPending } = useSignup();
  const { mutate: parentMutate, isPending: parentIsPending } = useParentSignup();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [legalModal, setLegalModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: "",
    content: "",
  });

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  console.log(userType, "3333");

  const formik = useFormik({
    initialValues: {
      email,
      password: "",
    },
    validationSchema: authSchema,
    onSubmit: async values => {
      if (userType === "SCHOOL_STAFF") {
        await mutate(
          {
            email: values.email.toLowerCase(),
            password: values.password,
          },
          {
            onSuccess: data => {
              toast({
                title: "Log in to continue",
                description: data.message,
                type: "success",
              });
              router.push(`/auth/staff?step=login`);
            },
            onError: error => {
              toast({
                title: error?.message ?? "Something went wrong",
                description: "Could not sign you up",
                type: "error",
              });
            },
          },
        );
      } else {
        await parentMutate(
          {
            email: values.email.toLowerCase(),
            password: values.password,
          },
          {
            onSuccess: data => {
              toast({
                title: "Log in to continue",
                description: data.message,
                type: "success",
              });
              router.push(`/auth/parent?step=login`);
            },
            onError: error => {
              toast({
                title: error?.message ?? "Something went wrong",
                description: "Could not sign you up",
                type: "error",
              });
            },
          },
        );
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="w-full space-y-6">
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
            formik.errors.email && formik.touched.email && "border-border-destructive border",
          )}
        />
        {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-light">{formik.errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-default text-sm font-medium">
          Password
        </Label>

        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
            formik.errors.password && formik.touched.password && "border-border-destructive border",
          )}
        >
          <Input
            id="password"
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            type={showPassword ? "text" : "password"}
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showPassword ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={toggleShowPassword} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={toggleShowPassword} />
          )}
        </div>
        {formik.touched.password && formik.errors.password && <p className="text-text-destructive text-xs font-light">{formik.errors.password}</p>}
      </div>

      {formik.values.password && <PasswordChecklist password={formik.values.password} setIsfulfilled={setPasswordIsFulfilled} />}

      <div className="flex items-start gap-2">
        <Checkbox id="accept-terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked === true)} className="mt-0.5" />
        <label htmlFor="accept-terms" className="text-text-muted text-xs leading-normal">
          I agree to the{" "}
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, title: "Terms and Conditions", content: TERMS_AND_CONDITIONS })}
            className="text-text-informative hover:underline"
          >
            Terms of Use
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, title: "Privacy Policy", content: PRIVACY_POLICY })}
            className="text-text-informative hover:underline"
          >
            Privacy Policy
          </button>
        </label>
      </div>

      <div className="mt-8 space-y-8">
        <Button
          disabled={!formik.values.email || !formik.values.password || !passwordIsFulfilled || !acceptTerms}
          type="submit"
          className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
        >
          {(isPending || parentIsPending) && <Spinner className="text-text-white-default" />}
          Signup
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm">
        <p className="text-text-muted">Already have an account?</p>
        <Link href={`/auth/${userType === "SCHOOL_STAFF" ? "staff" : "parent"}?step=login`} className="text-text-informative text-sm font-medium">
          Log In
        </Link>
      </div>

      <LegalModal
        open={legalModal.open}
        setOpen={open => setLegalModal(prev => ({ ...prev, open }))}
        title={legalModal.title}
        content={legalModal.content}
      />
    </form>
  );
};
