"use client";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgetPassword, useOtpCountdown, useVerifyOtp } from "@/hooks/queryHooks/useAuth";
import { verifyOtpSchema } from "@/schema/auth";
import { useFormik } from "formik";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";

const DIGITS = 6;

export const VerifyCode = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const { mutate: sendOtp, isPending: isResending } = useForgetPassword();
  const { formatted, restart, isExpired } = useOtpCountdown(3 * 60);
  useEffect(() => {
    if (!email) router.push("/auth/staff");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    restart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    formik.setFieldValue("otp", next.join(""));
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
    formik.setFieldValue("otp", next.join(""));
    inputsRef.current[Math.min(pasted.length, DIGITS - 1)]?.focus();
  };

  const allFilled = otp.every(d => d !== "");

  const formik = useFormik({
    initialValues: { email, otp: "" },
    validationSchema: verifyOtpSchema,
    onSubmit: async values => {
      await verifyOtp(
        { email: values.email, otp: values.otp },
        {
          onSuccess: data => {
            toast({ title: "OTP verified", description: data.message, type: "success" });
            router.push(`${pathname}?step=new-password&email=${values.email}&otp=${values.otp}`);
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
    },
  });

  const handleResend = async () => {
    await sendOtp(email, {
      onSuccess: data => {
        toast({ title: "OTP sent", description: data.message, type: "success" });
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
    <div className="mx-auto flex max-w-sm flex-col items-center gap-4 px-6 py-10">
      <h2 className="text-text-default text-xl font-semibold">Forgot password?</h2>

      <p className="text-text-muted text-center text-sm leading-relaxed">
        Enter the 6-digits code sent to your email
        <br />
        <strong className="font-medium">{email}</strong>
      </p>

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
            className={`bg-bg-input-soft text-text-default h-12 w-12 rounded-xl border text-center text-lg font-semibold transition-colors ${digit ? "border-border-informative border-2" : "border-border-default"}`}
          />
        ))}

        {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-normal">{formik.errors.email}</p>}
        {formik.touched.otp && formik.errors.otp && <p className="text-text-destructive text-xs font-normal">{formik.errors.otp}</p>}
      </div>

      <Button
        disabled={!allFilled || isPending}
        onClick={() => formik.handleSubmit()}
        className="bg-bg-state-primary text-text-white-default hover:bg-bg-state-primary-hover! w-full rounded-xl py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
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
