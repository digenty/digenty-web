"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authSchema } from "@/schema/auth";
import { useFormik } from "formik";

export const Fields = () => {
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

  return (
    <div className="mt-6 w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address" className="text-text-default text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="address"
          onChange={formik.handleChange}
          autoFocus
          placeholder="example@domain.com"
          onBlur={formik.handleBlur}
          value={formik.values.email}
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal",
            formik.errors.email && formik.touched.email && "border-text-error/50 border",
          )}
        />
        {formik.touched.email && formik.errors.email && <p className="text-text-error/80 font-satoshi text-xs font-light">{formik.errors.email}</p>}
      </div>

      <div className="space-y-8">
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full">Continue</Button>
        <p className="text-text-muted text-center text-xs">Trusted by 1,200+ schools and educators</p>
      </div>
    </div>
  );
};
