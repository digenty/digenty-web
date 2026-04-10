"use client";
import { createSession } from "@/app/actions/auth";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/hooks/queryHooks/useAuth";
import { cn } from "@/lib/utils";
import { authSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LegalModal } from "../LegalModal";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/constants/legal";

export const LoginPasswordForm = ({ email, userType }: { email: string; userType: "SCHOOL_STAFF" | "PARENT" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutate, isPending } = useLogin();
  const [legalModal, setLegalModal] = useState<{ open: boolean; title: string; content: string }>({
    open: false,
    title: "",
    content: "",
  });

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  const formik = useFormik({
    initialValues: {
      email,
      password: "",
    },
    validationSchema: authSchema,
    onSubmit: async values => {
      await mutate(
        {
          email: values.email,
          password: values.password,
          userType,
        },
        {
          onSuccess: data => {
            toast({
              title: "Successfully logged in",
              description: data.message,
              type: "success",
            });
            createSession(data.data.token, userType);
          },
          onError: error => {
            toast({
              title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
              description: "Could not log you in",
              type: "error",
            });
          },
        },
      );
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

      {/* TODO: Uncomment and implement these after first launch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={checked => setRememberMe(checked === true)}
            aria-label="Remember me"
            className="bg-bg-checkbox-default checked:bg-bg-state-primary border-border-darker size-4 cursor-pointer rounded-[5px] border"
          />
          <label htmlFor="remember-me" className="text-text-default text-sm font-medium">
            Remember me
          </label>
        </div>
        <Link href="/forgot-password" className="text-text-informative text-sm font-medium">
          Forgot Password
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        <Button
          disabled={!formik.values.email || !formik.values.password}
          className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
        >
          {isPending && <Spinner className="text-text-white-default" />}
          Log In
        </Button>
        <p className="text-text-muted text-center text-xs">
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, title: "Terms and Conditions", content: TERMS_AND_CONDITIONS })}
            className="cursor-pointer underline"
          >
            Terms of Use
          </button>{" "}
          |{" "}
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, title: "Privacy Policy", content: PRIVACY_POLICY })}
            className="cursor-pointer underline"
          >
            Privacy Policy
          </button>
        </p>
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
