"use client";
import { BackLink } from "@/components/BackLink";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { useUploadParents } from "@/hooks/queryHooks/useParent";
import { parentUploadSchema } from "@/schema/parent";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";
import * as yup from "yup";
import { ConfirmUpload } from "../BulkUpload/ConfirmUpload";
import { CSVUpload, ValidationError } from "../BulkUpload/CSVUpload";
import { CSVUploadProgress } from "../BulkUpload/CSVUploadProgress";
import { parseServerRowErrors } from "../BulkUpload/parseServerRowErrors";
import { BulkUploadResult, ParentUploadType, Step } from "../BulkUpload/types";
import * as XLSX from "xlsx";
import { Branch } from "@/api/types";
import { Spinner } from "@/components/ui/spinner";

const REQUIRED_HEADERS = ["firstName", "lastName", "middleName", "gender", "address", "nationality", "stateOfOrigin", "phoneNumber"];

const steps: Step[] = [
  { id: 1, label: "Upload Parents", completed: false },
  { id: 2, label: "Confirm & Upload", completed: false },
];

export const ParentsUpload = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validRows, setValidRows] = useState<Record<string, unknown>[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [branchSelected, setBranchSelected] = useState<Branch | null>(null);
  const [uploadResult, setUploadResult] = useState<{ uploaded: number; errors: ValidationError[] } | null>(null);

  const { mutate, isPending } = useUploadParents({ branchId: branchSelected?.id });

  const goToNext = () => {
    // Check if the previous step is completed, then add step to completed steps array
    setCompletedSteps(completedSteps => [...completedSteps, currentStep]);

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }

    if (currentStep === steps.length) {
      mutate(
        {
          file,
        },
        {
          onSuccess: response => {
            const result: Partial<BulkUploadResult> & { duplicateEmails?: unknown[] } = response?.data ?? {};
            const duplicateCount = Array.isArray(result.duplicateEmails) ? result.duplicateEmails.length : 0;
            const failed = result.failed ?? duplicateCount;
            const uploaded = result.uploaded ?? 0;
            const hasRowErrors = Array.isArray(result.errors) && result.errors.length > 0;

            if (failed > 0 && hasRowErrors) {
              setUploadResult({ uploaded, errors: parseServerRowErrors(result.errors ?? []) });
              toast({
                title: `${uploaded} of ${uploaded + failed} parent(s) imported`,
                description: `${failed} row(s) had errors and were skipped — see the breakdown below.`,
                type: uploaded === 0 ? "error" : "warning",
              });
              return;
            }

            toast({
              title: `Successfully uploaded ${failed > 0 ? "some" : "all"} parents`,
              description:
                failed > 0
                  ? `${failed} parent(s) were not uploaded because their email or phone number is already in use.`
                  : (result.message ?? "Success"),
              type: failed > 0 ? "warning" : "success",
            });
            setFile(null);
            router.push("/staff/student-and-parent-record?tab=Parents");
          },
          onError: error => {
            toast({
              title: error.message ?? "Something went wrong",
              description: "Could not upload parents",
              type: "error",
            });
          },
        },
      );
    }
  };

  const handlePrevious = () => {
    if (uploadResult) {
      setUploadResult(null);
      setFile(null);
      setErrors([]);
      setValidRows([]);
      setCurrentStep(1);
      setCompletedSteps([]);
      return;
    }
    if (currentStep === steps.length) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const parseXLSX = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const json = XLSX.utils.sheet_to_json<ParentUploadType>(sheet, {
      defval: "",
    });

    processXlsxRows(json);
  };

  const processXlsxRows = async (data: ParentUploadType[]) => {
    if (!data.length) {
      setErrors([{ row: 0, errors: ["The File is empty. Please add some data to the file"] }]);
      return;
    }

    // Header validation
    const headers = Object.keys(data[0]);
    const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));

    if (missingHeaders.length) {
      setErrors([
        {
          row: 0,
          errors: [`Missing headers: ${missingHeaders.join(", ")}`],
        },
      ]);
      return;
    }

    const validRows: Record<string, unknown>[] = [];
    const rowErrors: {
      row: number;
      errors: string[];
    }[] = [];

    data.forEach((row, index) => {
      try {
        const validated = parentUploadSchema.validateSync(row, {
          abortEarly: true,
        });
        validRows.push(validated);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          rowErrors.push({
            row: index + 2, // Excel row number
            errors: [err.message],
          });
        }
      }
    });

    setValidRows(validRows);
    setErrors(rowErrors);
  };

  const validateFile = (fileToValidate: File, type: string) => {
    if (type === "xlsx") {
      parseXLSX(fileToValidate);
      return;
    }
    Papa.parse(fileToValidate, {
      header: true,
      complete: async results => {
        const rowErrors: ValidationError[] = [];
        const validData: Record<string, unknown>[] = [];

        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i];

          try {
            const validatedRow = await parentUploadSchema.validate(row, {
              abortEarly: false,
            });

            validData.push(validatedRow);
          } catch (err) {
            if (err instanceof yup.ValidationError) {
              rowErrors.push({
                row: i + 2, // header row = 1
                errors: err.errors,
              });
            }
          }
        }

        setErrors(rowErrors);
        setValidRows(validData);
      },
    });
  };

  const downloadErrorReport = () => {
    const reportErrors = uploadResult ? uploadResult.errors : errors;
    const headers = ["Row", "Errors"];

    // 2. CSV rows
    const rows = reportErrors.map(item => [item.row, item.errors.join(" | ")]);

    // 3. Build CSV string
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

    // 4. Create blob & download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "error-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-150 space-y-4 md:space-y-6">
        <div className="md:hidden">
          <BackLink href="/staff/student-and-parent-record?tab=Parents" />
        </div>
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" completedSteps={completedSteps} />

        {uploadResult ? (
          <ConfirmUpload
            entity="Parents"
            errors={uploadResult.errors}
            validCount={uploadResult.uploaded}
            downloadErrorReport={downloadErrorReport}
            title="Upload Results"
            subtitle="Here's what happened during the import."
            bannerText={`${uploadResult.errors.length} row(s) had errors and were not imported.`}
          />
        ) : currentStep === steps.length ? (
          <ConfirmUpload entity="Parents" errors={errors} validCount={validRows.length} downloadErrorReport={downloadErrorReport} />
        ) : (
          <CSVUpload
            branchSelected={branchSelected}
            setBranchSelected={setBranchSelected}
            file={file}
            setFile={setFile}
            entity="Parents"
            setErrors={setErrors}
            handleValidation={validateFile}
          />
        )}

        <div className="border-border-default mt-10 flex w-full justify-between border-t py-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
          >
            {uploadResult ? "Upload Another File" : currentStep === steps.length ? "Back" : "Cancel"}
          </Button>

          <Button
            disabled={
              !uploadResult &&
              ((file === null && currentStep === 1) ||
                (currentStep === steps.length && (errors.length > 0 || validRows.length === 0)) ||
                !branchSelected)
            }
            onClick={uploadResult ? () => router.push("/staff/student-and-parent-record?tab=Parents") : goToNext}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
          >
            {isPending && currentStep === steps.length && <Spinner className="text-text-white-default" />}
            <span className="text-sm font-medium">{uploadResult ? "Done" : currentStep === steps.length ? "Confirm & Import" : "Continue"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
