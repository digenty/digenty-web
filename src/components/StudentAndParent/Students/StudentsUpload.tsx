"use client";
import { BackLink } from "@/components/BackLink";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCommitStudentsUpload, useValidateStudentsUpload } from "@/hooks/queryHooks/useStudent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmUpload } from "../BulkUpload/ConfirmUpload";
import { CSVUpload, ValidationError } from "../BulkUpload/CSVUpload";
import { CSVUploadProgress } from "../BulkUpload/CSVUploadProgress";
import { Step, UploadInvalidRow, ValidateUploadResponse } from "../BulkUpload/types";
import { Branch } from "@/api/types";

const steps: Step[] = [
  { id: 1, label: "Upload Students", completed: false },
  { id: 2, label: "Confirm & Upload", completed: false },
];

const mapInvalidRows = (rows: UploadInvalidRow[] = []): ValidationError[] =>
  rows.map(row => ({
    row: row.rowNumber,
    errors: row.errors.map(error => (error.field ? `${error.field}: ${error.message}` : error.message)),
  }));

export const StudentsUpload = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [branchSelected, setBranchSelected] = useState<Branch | null>(null);
  const [validation, setValidation] = useState<ValidateUploadResponse | null>(null);
  const [uploadResult, setUploadResult] = useState<{ uploaded: number; errors: ValidationError[] } | null>(null);

  const { mutate: validateUpload, isPending: isValidating } = useValidateStudentsUpload({ branchId: branchSelected?.id });
  const { mutate: commitUpload, isPending: isCommitting } = useCommitStudentsUpload();

  const validationErrors = mapInvalidRows(validation?.invalidRows);
  const validCount = validation?.summary?.valid ?? 0;

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setValidation(null);
  };

  const goToNext = () => {
    if (currentStep === 1) {
      if (!file || !branchSelected) return;

      validateUpload(
        { file },
        {
          onSuccess: response => {
            setValidation(response);
            setCompletedSteps(prev => [...prev, 1]);
            setCurrentStep(2);
          },
          onError: error => {
            toast({
              title: error.message ?? "Could not validate file",
              description: "Check that the file matches the template and try again.",
              type: "error",
            });
          },
        },
      );
      return;
    }

    if (!validation) return;

    commitUpload(
      { batchId: validation.batchId },
      {
        onSuccess: result => {
          const imported = result?.summary?.imported ?? 0;
          const failed = result?.summary?.failed ?? 0;

          if (failed > 0) {
            setUploadResult({ uploaded: imported, errors: mapInvalidRows(result.failedRows) });
            toast({
              title: `${imported} of ${imported + failed} student(s) imported`,
              description: `${failed} row(s) had errors and were skipped — see the breakdown below.`,
              type: imported === 0 ? "error" : "warning",
            });
            return;
          }

          toast({
            title: "Successfully uploaded students",
            description: result?.message ?? "Success",
            type: "success",
          });
          setFile(null);
          router.push("/staff/student-and-parent-record?tab=Students");
        },
        onError: error => {
          toast({
            title: error.message ?? "Something went wrong",
            description: "Could not upload students",
            type: "error",
          });
        },
      },
    );
  };

  const handlePrevious = () => {
    if (uploadResult) {
      setUploadResult(null);
      setFile(null);
      setValidation(null);
      setCurrentStep(1);
      setCompletedSteps([]);
      return;
    }
    if (currentStep === steps.length) {
      setValidation(null);
      setCompletedSteps([]);
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const downloadErrorReport = () => {
    const reportErrors = uploadResult ? uploadResult.errors : validationErrors;
    const headers = ["Row", "Errors"];

    const rows = reportErrors.map(item => [item.row, item.errors.join(" | ")]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

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
          <BackLink href="/staff/student-and-parent-record?tab=Students" />
        </div>
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" completedSteps={completedSteps} />

        {uploadResult ? (
          <ConfirmUpload
            entity="Students"
            errors={uploadResult.errors}
            validCount={uploadResult.uploaded}
            downloadErrorReport={downloadErrorReport}
            title="Upload Results"
            subtitle="Here's what happened during the import."
            bannerText={`${uploadResult.errors.length} row(s) had errors and were not imported.`}
          />
        ) : currentStep === steps.length ? (
          <ConfirmUpload
            entity="Students"
            errors={validationErrors}
            validCount={validCount}
            downloadErrorReport={downloadErrorReport}
            bannerText={
              validationErrors.length > 0
                ? `${validationErrors.length} row(s) have errors and will be skipped. Only the ${validCount} valid row(s) will be imported.`
                : undefined
            }
          />
        ) : (
          <CSVUpload branchSelected={branchSelected} setBranchSelected={setBranchSelected} file={file} setFile={handleFileChange} entity="Students" />
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
              ((currentStep === 1 && (file === null || !branchSelected || isValidating)) ||
                (currentStep === steps.length && (validCount === 0 || isCommitting)))
            }
            onClick={uploadResult ? () => router.push("/staff/student-and-parent-record?tab=Students") : goToNext}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
          >
            {(isValidating || isCommitting) && <Spinner className="text-text-white-default" />}
            <span className="text-sm font-medium">{uploadResult ? "Done" : currentStep === steps.length ? "Confirm & Import" : "Continue"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
