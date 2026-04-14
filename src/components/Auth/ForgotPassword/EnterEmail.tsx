import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useForgetPassword } from "@/hooks/queryHooks/useAuth";
import { cn } from "@/lib/utils";
import { userEmailSchema } from "@/schema/auth";
import { useFormik } from "formik";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const EnterEmail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { mutate, isPending } = useForgetPassword();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: userEmailSchema,
    onSubmit: async value => {
      await mutate(
        value.email,

        {
          onSuccess: data => {
            toast({
              title: "Successfully requested password reset",
              description: data.message,
              type: "success",
            });

            router.push(`${pathname}?step=verify-code&email=${value.email}`);
          },
          onError: error => {
            toast({
              title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
              description: "Could not process your request",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-7">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-text-default text-lg font-semibold">Forgot password?</h2>
        <p className="text-text-muted text-sm font-normal">Enter your email to reset your password.</p>
      </div>
      <form onSubmit={formik.handleSubmit} className="w-full space-y-6">
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

          {formik.touched.email && formik.errors.email && <p className="text-text-destructive text-xs font-normal">{formik.errors.email}</p>}
        </div>

        <div className="space-y-8">
          <Button
            disabled={!formik.values.email || isPending}
            type="submit"
            className="bg-bg-state-primary disabled:bg-bg-state-primary-hover disabled:text-text-white-default hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full"
          >
            {isPending && <Spinner className="text-text-white-default" />}
            Reset Password
          </Button>
        </div>
      </form>

      <div className="">
        <span className="text-text-muted text-sm">Back to </span>
        <Link href="/auth/staff?step=login" className="text-text-informative text-sm font-medium">
          Log In
        </Link>
      </div>
    </div>
  );
};
