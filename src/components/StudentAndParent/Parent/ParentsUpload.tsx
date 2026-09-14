"use client";
import { BackLink } from "@/components/BackLink";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCommitParentsUpload, useValidateParentsUpload } from "@/hooks/queryHooks/useParent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmUpload } from "../BulkUpload/ConfirmUpload";
import { CSVUpload, ValidationError } from "../BulkUpload/CSVUpload";
import { CSVUploadProgress } from "../BulkUpload/CSVUploadProgress";
import { Step, UploadInvalidRow, ValidateUploadResponse } from "../BulkUpload/types";
import { getUploadErrorMessage, isBatchExpired } from "../BulkUpload/uploadErrors";
import { Branch } from "@/api/types";
import { SendLoginDetailsStep } from "./SendLoginDetailsStep";

const steps: Step[] = [
  { id: 1, label: "Upload Parents", completed: false },
  { id: 2, label: "Confirm & Upload", completed: false },
  { id: 3, label: "Send Login Details", completed: false },
];

// The step that runs the import. The step after it asks whether to send login details.
const CONFIRM_STEP = 2;
const SEND_STEP = 3;
const PARENTS_TAB_URL = "/staff/student-and-parent-record?tab=Parents";

const mapInvalidRows = (rows: UploadInvalidRow[] = []): ValidationError[] =>
  rows.map(row => ({
    row: row.rowNumber,
    errors: row.errors.map(error => (error.field ? `${error.field}: ${error.message}` : error.message)),
  }));

export const ParentsUpload = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [branchSelected, setBranchSelected] = useState<Branch | null>(null);
  const [validation, setValidation] = useState<ValidateUploadResponse | null>(null);
  const [uploadResult, setUploadResult] = useState<{ uploaded: number; errors: ValidationError[] } | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const { mutate: validateUpload, isPending: isValidating } = useValidateParentsUpload({ branchId: branchSelected?.id });
  const { mutate: commitUpload, isPending: isCommitting } = useCommitParentsUpload();

  const validationErrors = mapInvalidRows(validation?.invalidRows);
  const validCount = validation?.summary?.valid ?? 0;
  // Parents are all-or-nothing: commit is refused outright if any row is invalid, so the
  // import button only opens up once the file is entirely clean.
  const hasInvalidRows = validationErrors.length > 0;

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setValidation(null);
  };

  const goToSendStep = () => {
    setCompletedSteps(completedSteps => (completedSteps.includes(CONFIRM_STEP) ? completedSteps : [...completedSteps, CONFIRM_STEP]));
    setCurrentStep(SEND_STEP);
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
            setCurrentStep(CONFIRM_STEP);
          },
          onError: error => {
            toast({
              title: getUploadErrorMessage(error, "Could not validate file"),
              description: "Check that the file matches the template and try again.",
              type: "error",
            });
          },
        },
      );
      return;
    }

    if (currentStep === CONFIRM_STEP) {
      if (!validation) return;

      commitUpload(
        { batchId: validation.batchId },
        {
          onSuccess: result => {
            const imported = result?.summary?.imported ?? 0;
            const failed = result?.summary?.failed ?? 0;

            setImportedCount(imported);

            if (failed > 0) {
              // Rows that were valid at validate time but lost a race before commit.
              setUploadResult({ uploaded: imported, errors: mapInvalidRows(result.failedRows) });
              toast({
                title: `${imported} of ${imported + failed} parent(s) imported`,
                description: `${failed} row(s) failed on import — see the breakdown below.`,
                type: imported === 0 ? "error" : "warning",
              });
              return;
            }

            toast({
              title: "Successfully uploaded parents",
              description: result?.message ?? "Success",
              type: "success",
            });
            setFile(null);
            // Parents are registered but not emailed - the next step asks whether to
            // send their login details now.
            goToSendStep();
          },
          onError: error => {
            if (isBatchExpired(error)) {
              toast({
                title: "This import session expired",
                description: "Re-upload the file to try again.",
                type: "warning",
              });
              setValidation(null);
              setFile(null);
              setCompletedSteps([]);
              setCurrentStep(1);
              return;
            }

            toast({
              title: getUploadErrorMessage(error, "Something went wrong"),
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
      setValidation(null);
      setCurrentStep(1);
      setCompletedSteps([]);
      return;
    }
    if (currentStep === CONFIRM_STEP) {
      setValidation(null);
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
          <BackLink href={PARENTS_TAB_URL} />
        </div>
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" completedSteps={completedSteps} />

        {currentStep === SEND_STEP ? (
          <SendLoginDetailsStep
            branchId={branchSelected?.id}
            branchName={branchSelected?.name ?? undefined}
            importedCount={importedCount}
            onLater={() => router.push(PARENTS_TAB_URL)}
          />
        ) : uploadResult ? (
          <ConfirmUpload
            entity="Parents"
            errors={uploadResult.errors}
            validCount={uploadResult.uploaded}
            downloadErrorReport={downloadErrorReport}
            title="Upload Results"
            subtitle="Here's what happened during the import."
            bannerText={`${uploadResult.errors.length} row(s) had errors and were not imported.`}
          />
        ) : currentStep === CONFIRM_STEP ? (
          <ConfirmUpload
            entity="Parents"
            errors={validationErrors}
            validCount={validCount}
            downloadErrorReport={downloadErrorReport}
            bannerText={
              hasInvalidRows
                ? `${validationErrors.length} row(s) have errors. Fix them and re-upload — nothing will be imported until then.`
                : undefined
            }
          />
        ) : (
          <CSVUpload branchSelected={branchSelected} setBranchSelected={setBranchSelected} file={file} setFile={handleFileChange} entity="Parents" />
        )}

        {currentStep !== SEND_STEP && (
          <div className="border-border-default mt-10 flex w-full justify-between border-t py-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
            >
              {uploadResult ? "Upload Another File" : currentStep === CONFIRM_STEP ? "Back" : "Cancel"}
            </Button>

            <Button
              disabled={
                !uploadResult &&
                ((currentStep === 1 && (file === null || !branchSelected || isValidating)) ||
                  (currentStep === CONFIRM_STEP && (validCount === 0 || hasInvalidRows || isCommitting)))
              }
              onClick={uploadResult ? (uploadResult.uploaded > 0 ? goToSendStep : () => router.push(PARENTS_TAB_URL)) : goToNext}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
            >
              {(isValidating || isCommitting) && <Spinner className="text-text-white-default" />}
              <span className="text-sm font-medium">
                {uploadResult ? (uploadResult.uploaded > 0 ? "Continue" : "Done") : currentStep === CONFIRM_STEP ? "Confirm & Import" : "Continue"}
              </span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
