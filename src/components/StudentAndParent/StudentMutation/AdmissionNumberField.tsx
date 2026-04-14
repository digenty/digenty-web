import { toast } from "@/components/Toast";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useGenerateAdmissionNumber } from "@/hooks/queryHooks/useAdmission";
import { useGetAdmissionNumberDetails } from "@/hooks/queryHooks/useAdmisssion";
import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import { Wand2 } from "lucide-react";
import { StudentInputValues } from "../types";

export const AdmissionNumberField = ({ formik }: { formik: FormikProps<StudentInputValues> }) => {
  const { handleBlur, handleChange, errors, touched, values, setFieldValue, setErrors } = formik;
  const { mutateAsync: generateMutation, isPending: isGenerating } = useGenerateAdmissionNumber();
  const { data: admissionResponse } = useGetAdmissionNumberDetails();

  const admissionFormat = () => {
    const prefix = admissionResponse?.data?.prefix;
    const numberFormat = admissionResponse?.data?.numberFormat;
    const padding = admissionResponse?.data?.padding;
    const startingNumber = admissionResponse?.data?.startingNumber;

    const seq = String(parseInt(startingNumber) || 1).padStart(Number(padding) || 2, "0");
    return `${prefix}${numberFormat}${seq}`;
  };

  const handleAutoGenerate = async () => {
    await generateMutation(undefined, {
      onSuccess: data => {
        if (data?.data?.number) {
          setFieldValue("admissionNumber", data?.data?.number);
          toast({
            title: "Admission number generated",
            type: "success",
          });
        }
      },
      onError: error => {
        toast({
          title: error?.message ?? "Something went wrong",
          description: "Could not generate admission number",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="admissionNumber" className="text-text-default text-sm font-medium">
        Admission Number
      </Label>
      <div className="flex w-full items-center gap-2">
        <Input
          id="admissionNumber"
          onChange={handleChange}
          placeholder={admissionFormat() || "GFA/2023/01045"}
          onBlur={handleBlur}
          value={values.admissionNumber}
          type="text"
          className={cn(
            "text-text-muted bg-bg-input-soft! placeholder-text-hint! border-none text-sm font-normal",
            errors.admissionNumber && touched.admissionNumber && "border-border-destructive border",
          )}
        />
        <Tooltip
          Trigger={
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isGenerating}
              onClick={handleAutoGenerate}
              className="border-border-default shrink-0 cursor-pointer"
            >
              {isGenerating ? <Spinner className="text-text-muted h-4 w-4" /> : <Wand2 className="text-text-muted h-4 w-4" />}
            </Button>
          }
          description="auto generate admission number"
          side="top"
        />
      </div>
      {touched.admissionNumber && errors.admissionNumber && <p className="text-text-destructive text-xs font-light">{errors.admissionNumber}</p>}
    </div>
  );
};
