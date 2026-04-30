"use client";

import { CheckboxCircleFill } from "@digenty/icons";
import { PasswordChecklist } from "@/components/Auth/PasswordCheckList";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { deleteSession } from "@/app/actions/auth";
import { useChangePassword, useOtpCountdown, useSendChangePasswordOtp, useVerifyChangePasswordOtp } from "@/hooks/queryHooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { changePasswordSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DIGITS = 6;

type Step = "verify-otp" | "change-password" | "success";

export const ChangePasswordDialog = ({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) => {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>("verify-otp");

  useEffect(() => {
    if (!open) setStep("verify-otp");
  }, [open]);

  const content = (
    <div className="p-4">
      {step === "verify-otp" && <VerifyOtpStep onVerified={() => setStep("change-password")} />}
      {step === "change-password" && <ChangePasswordStep onSuccess={() => setStep("success")} />}
      {step === "success" && <SuccessStep />}
    </div>
  );

  if (!open) return null;

  const canClose = step !== "success";
  const title = step === "success" ? null : "Change Password";

  return !isMobile ? (
    <Modal open={open} setOpen={setOpen} title={title} showCloseButton={canClose} showFooter={false} className="max-w-110!">
      {content}
    </Modal>
  ) : (
    <MobileDrawer open={open} setIsOpen={setOpen} title={title} showCloseButton={canClose}>
      {content}
    </MobileDrawer>
  );
};

const VerifyOtpStep = ({ onVerified }: { onVerified: () => void }) => {
  const [otp, setOtp] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const { mutate: verifyOtp, isPending } = useVerifyChangePasswordOtp();
  const { mutate: sendOtp, isPending: isResending } = useSendChangePasswordOtp();
  const { formatted, restart, isExpired } = useOtpCountdown(3 * 60);

  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < DIGITS - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    const next = [...otp];
    pasted.split("").forEach((char, i) => (next[i] = char));
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, DIGITS - 1)]?.focus();
  };

  const allFilled = otp.every(d => d !== "");

  const handleVerify = () => {
    verifyOtp(
      { otp: otp.join("") },
      {
        onSuccess: data => {
          toast({ title: "OTP verified", description: data?.message ?? "You can now set a new password", type: "success" });
          onVerified();
        },
        onError: error => {
          toast({
            title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
            description: "Could not verify OTP",
            type: "error",
          });
        },
      },
    );
  };

  const handleResend = () => {
    sendOtp(undefined, {
      onSuccess: data => {
        toast({ title: "OTP sent", description: data?.message ?? "A new code has been sent to your email", type: "success" });
        restart();
      },
      onError: error => {
        toast({
          title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
          description: "Could not resend OTP",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 px-2 py-4">
      <h2 className="text-text-default text-xl font-semibold">Verify your identity</h2>

      <p className="text-text-muted text-center text-sm leading-relaxed">Enter the 6-digit code sent to your email</p>

      <div className="my-2 flex gap-2.5" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <Input
            key={i}
            ref={el => {
              inputsRef.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => updateOtp(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`bg-bg-input-soft text-text-default size-10 rounded-xl text-center text-lg font-normal transition-colors md:size-12 ${digit && "border-ring ring-border-highlight border-none ring-2 ring-offset-1"}`}
          />
        ))}
      </div>

      <Button
        disabled={!allFilled || isPending}
        onClick={handleVerify}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! h-10! w-full rounded-md py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Spinner className="text-text-white-default" />} Verify
      </Button>

      {!isExpired && <p className="text-text-destructive text-sm font-semibold">{formatted}</p>}

      <p className="text-text-muted text-sm">
        Don&apos;t have the code?{" "}
        {isExpired ? (
          <span className="text-text-informative cursor-pointer font-medium" onClick={!isResending ? handleResend : undefined}>
            {isResending ? "Sending..." : "Resend code"}
          </span>
        ) : (
          <span className="text-text-muted font-medium">Resend code</span>
        )}
      </p>
    </div>
  );
};

const ChangePasswordStep = ({ onSuccess }: { onSuccess: () => void }) => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordIsFulfilled, setPasswordIsFulfilled] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: changePasswordSchema,
    onSubmit: values => {
      changePassword(values, {
        onSuccess: () => onSuccess(),
        onError: error => {
          toast({
            title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
            description: "Could not change password",
            type: "error",
          });
        },
      });
    },
  });

  const canSubmit =
    passwordIsFulfilled &&
    formik.values.oldPassword !== "" &&
    formik.values.newPassword === formik.values.confirmPassword &&
    formik.values.confirmPassword !== "";

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-2">
      <div className="space-y-2">
        <Label htmlFor="oldPassword" className="text-text-default text-sm font-medium">
          Old Password
        </Label>
        <div
          className={cn(
            "focus-within:border-ring focus-within:ring-border-highlight text-text-muted bg-bg-input-soft flex w-full items-center rounded-lg border border-none pr-2 text-sm font-normal focus-within:ring-2 focus-within:ring-offset-2",
          )}
        >
          <Input
            id="oldPassword"
            name="oldPassword"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={showOld ? "text" : "password"}
            placeholder="Enter old password"
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showOld ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowOld(false)} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowOld(true)} />
          )}
        </div>
        {formik.touched.oldPassword && formik.errors.oldPassword && <p className="text-text-destructive text-xs">{formik.errors.oldPassword}</p>}
      </div>

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
            name="newPassword"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showNew ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowNew(false)} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowNew(true)} />
          )}
        </div>
        {formik.touched.newPassword && formik.errors.newPassword && <p className="text-text-destructive text-xs">{formik.errors.newPassword}</p>}
      </div>

      <div className="text-text-muted text-xs">Password requirements:</div>

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
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            className="text-text-muted flex-1 rounded-l-lg rounded-r-none border-none text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {showConfirm ? (
            <EyeOffIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowConfirm(false)} />
          ) : (
            <EyeIcon className="text-icon-default-muted size-4 cursor-pointer" onClick={() => setShowConfirm(true)} />
          )}
        </div>
        {/* {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-text-destructive text-xs">{formik.errors.confirmPassword}</p>
        )} */}

        {formik.values.confirmPassword !== "" && formik.values.confirmPassword !== formik.values.newPassword && (
          <p className="text-text-destructive text-xs">Confirm password must match new password</p>
        )}
      </div>

      <Button
        type="button"
        disabled={!canSubmit}
        onClick={() => formik.handleSubmit()}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10! w-full cursor-pointer rounded-md transition-opacity disabled:cursor-not-allowed! disabled:opacity-50"
      >
        {isPending && <Spinner className="text-text-white-default" />}
        Change Password
      </Button>
    </form>
  );
};

const SuccessStep = () => {
  const [isPending, setIsPending] = useState(false);

  const handleBackToLogin = async () => {
    setIsPending(true);
    await deleteSession();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="bg-bg-badge-green flex size-10 items-center justify-center rounded-full">
        <CheckboxCircleFill fill="var(--color-icon-success)" />
      </div>
      <div className="text-text-default text-lg font-semibold">Success!</div>
      <span className="text-text-muted text-center text-sm">
        Your password has been successfully updated. Please log in again with your new password.
      </span>

      <Button
        disabled={isPending}
        onClick={handleBackToLogin}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-9 w-full"
      >
        {isPending && <Spinner className="text-text-white-default" />}
        Back to Login
      </Button>
    </div>
  );
};
