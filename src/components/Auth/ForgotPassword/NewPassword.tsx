"use client";

import React, { useEffect, useState } from "react";
import { PasswordChecklist } from "../PasswordCheckList";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import { useResetPassword } from "@/hooks/queryHooks/useAuth";
import { resetPasswordSchema } from "@/schema/auth";
import { toast } from "@/components/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileDrawer } from "@/components/MobileDrawer";

export const NewPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const otp = searchParams.get("otp") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordIsFulfilled, setPasswordIsFulfilled] = useState(false);
  const [open, setOpen] = useState(false);

  const { mutate: resetPassword, isPending } = useResetPassword();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!email) router.push("/auth/staff");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const formik = useFormik({
    initialValues: {
      email,
      otp,
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: values => {
      resetPassword(values, {
        onSuccess: data => {
          setOpen(true);
          toast({ title: "Password Reset", description: data.message, type: "success" });
        },
        onError: error => {
          toast({
            title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
            description: "Could not reset password",
            type: "error",
          });
        },
      });
    },
  });

  const canSubmit = passwordIsFulfilled && formik.values.newPassword === formik.values.confirmPassword && formik.values.confirmPassword !== "";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-text-default text-sm font-medium">
          New Password
        </Label>
        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
          )}
        >
          <Input
            id="newPassword"
            autoFocus
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={showPassword ? "text" : "password"}
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showPassword ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowPassword(false)} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowPassword(true)} />
          )}
        </div>
        {formik.touched.newPassword && formik.errors.newPassword && <p className="text-text-destructive text-xs">{formik.errors.newPassword}</p>}
      </div>

      <div className="text-text-muted text-sm">Password requirements:</div>

      <PasswordChecklist password={formik.values.newPassword} setIsfulfilled={setPasswordIsFulfilled} />

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-text-default text-sm font-medium">
          Confirm Password
        </Label>
        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
          )}
        >
          <Input
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={showConfirm ? "text" : "password"}
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showConfirm ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowConfirm(false)} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowConfirm(true)} />
          )}
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-text-destructive text-xs">{formik.errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!canSubmit || isPending}
        // onClick={() => formik.handleSubmit}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-full cursor-pointer rounded-xl transition-opacity disabled:cursor-not-allowed! disabled:opacity-50"
      >
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>

      {open && (
        <>
          {!isMobile ? (
            <Modal
              title={null}
              setOpen={setOpen}
              open={open}
              showCloseButton={false}
              cancelButton={true}
              ActionButton={
                <Button
                  onClick={() => router.push("/auth/staff")}
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9 w-full"
                >
                  Back to Login
                </Button>
              }
            >
              <div className="flex flex-col items-center gap-4 p-4">
                <CheckboxCircleFill fill="var(--color-icon-success)" />
                <div className="text-text-default text-lg font-semibold">Success!</div>
                <span className="text-text-muted text-center text-sm">
                  Your new password has been successfully updated. You can login with your new password.
                </span>
              </div>
            </Modal>
          ) : (
            <MobileDrawer title={null} setIsOpen={setOpen} open={open} showCloseButton={false}>
              <div className="flex flex-col items-center gap-4 p-4">
                <CheckboxCircleFill fill="var(--color-icon-success)" />
                <div className="text-text-default text-lg font-semibold">Success!</div>
                <span className="text-text-muted text-center text-sm">
                  Your new password has been successfully updated. You can login with your new password.
                </span>

                <Button
                  onClick={() => router.push("/auth/staff")}
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 w-full"
                >
                  Back to Login
                </Button>
              </div>
            </MobileDrawer>
          )}
        </>
      )}
    </form>
  );
};
