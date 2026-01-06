"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, useSignup } from "@/hooks/queryHooks/useAuth";
import { cn } from "@/lib/utils";
import { authSchema } from "@/schema/auth";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const PasswordForm = ({ email, step }: { email: string; step: "login" | "signup" | null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { mutate, isPending } = useLogin();
  const { mutate: login, isPending: isPendingLogin } = useLogin();

  const toggleRememberMe = () => {
    setRememberMe(prev => !prev);
  };
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
      console.log(values);
    },
  });

  const handleSubmit = async () => {
    console.log({
      email: formik.values.email,
      password: formik.values.password,
    });
    await mutate({
      email: formik.values.email,
      password: formik.values.password,
    });
  };

  return (
    <div className="w-full space-y-6">
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
        <Link href="#" className="text-text-informative text-sm font-medium">
          Forgot Password
        </Link>
      </div>

      <div className="mt-8 space-y-8">
        <Button
          disabled={!formik.values.email || !formik.values.password}
          onClick={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
        >
          {step === "signup" ? "Continue" : "Log In"}
        </Button>
        <p className="text-text-muted text-center text-xs">Terms of Use | Privacy Policy</p>
      </div>
    </div>
  );
};
