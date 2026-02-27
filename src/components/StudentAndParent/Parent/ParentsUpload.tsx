"use client";
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
import { ParentUploadType, Step } from "../BulkUpload/types";
import * as XLSX from "xlsx";
import { Branch } from "@/api/types";

const REQUIRED_HEADERS = [
  "firstName",
  "lastName",
  "middleName",
  "gender",
  "email",
  "relationship",
  "address",
  "nationality",
  "stateOfOrigin",
  "phoneNumber",
  "secondaryhoneNumber",
  "branch",
];

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

  const { mutate, isPending } = useUploadParents();

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
          onSuccess: data => {
            toast({
              title: "Successfully uploaded parents",
              description: data.message,
              type: "success",
            });
            setFile(null);
            setCurrentStep(1);
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
    const headers = ["Row", "Errors"];

    // 2. CSV rows
    const rows = errors.map(item => [item.row, item.errors.join(" | ")]);

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
        <CSVUploadProgress currentStep={currentStep} steps={steps} className="w-full" completedSteps={completedSteps} />

        {currentStep === steps.length ? (
          <ConfirmUpload entity="Parents" errors={errors} validRows={validRows} downloadErrorReport={downloadErrorReport} />
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
            {currentStep === steps.length ? "Back" : "Cancel"}
          </Button>

          <Button
            disabled={(file === null && currentStep === 1) || (currentStep === steps.length && (errors.length > 0 || validRows.length === 0))}
            onClick={goToNext}
            className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
          >
            <span className="text-sm font-medium">{currentStep === steps.length ? "Confirm & Import" : "Continue"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
