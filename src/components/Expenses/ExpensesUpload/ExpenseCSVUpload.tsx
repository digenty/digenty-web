"use client";

import { Branch, BranchWithClassLevels } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { Download2, File, FileExcelFill, ViewComfyAlt } from "@digenty/icons";
import { XIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SIZE_QUOTIENT = 1024 * 1024;

export const ExpenseCSVUpload = ({
  file,
  setFile,
  branchSelected,
  setBranchSelected,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
  branchSelected: Branch | null;
  setBranchSelected: (branch: Branch | null) => void;
}) => {
  useBreadcrumb([
    { label: "Expenses", url: "/staff/expense" },
    { label: "CSV Upload", url: "" },
  ]);

  const { data: branches, isPending: loadingBranches } = useGetBranches();
  const { isAdmin, isMain, branchIds } = useLoggedInUser();
  const [fileError, setFileError] = useState<string | null>(null);

  // A branch-restricted staff member can only record expenses against their own branch(es).
  const isBranchRestricted = !isAdmin && !isMain && !!branchIds?.length;
  const allBranches: BranchWithClassLevels[] = branches?.data ?? [];
  const selectableBranches = isBranchRestricted ? allBranches.filter(b => branchIds?.includes(b.branch.id)) : allBranches;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const next = acceptedFiles[0];
      if (!next) return;

      if (!next.name.toLowerCase().endsWith(".csv")) {
        setFileError("Invalid file type. File type must be CSV");
        return;
      }

      if (next.size > MAX_FILE_SIZE) {
        setFileError(`File size must be less than ${MAX_FILE_SIZE / SIZE_QUOTIENT}MB`);
        return;
      }

      setFileError(null);
      setFile(next);
    },
    [setFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
    disabled: !!file,
  });

  const clearFile = () => {
    setFile(null);
    setFileError(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Upload Expenses List</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">
          Upload your expense records in CSV format to quickly add them into the system.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-text-default text-sm font-medium">
          Select Branch<small className="text-text-destructive text-xs">*</small>
        </Label>
        {!branches || loadingBranches ? (
          <Skeleton className="bg-bg-input-soft h-9 w-full" />
        ) : (
          <Select
            value={branchSelected ? String(branchSelected.id) : ""}
            onValueChange={value => {
              const branch = selectableBranches.find(b => String(b.branch.id) === value);
              setBranchSelected(branch?.branch ?? null);
            }}
          >
            <SelectTrigger className="bg-bg-input-soft! h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-light!">
              <span className="text-text-default! text-sm font-medium">{branchSelected ? branchSelected.name : "Select a branch"}</span>
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {selectableBranches.map(branch => (
                <SelectItem key={branch.branch.id} value={String(branch.branch.id)} className="text-text-default text-sm font-medium">
                  {branch.branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div
        {...getRootProps()}
        className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-6 py-8"
      >
        <ViewComfyAlt fill="var(--color-icon-white-default)" />

        <div className="text-center text-sm font-medium">
          {isDragActive ? (
            <span className="text-text-muted">Drop the file here...</span>
          ) : (
            <span className="text-text-default">
              Drag and drop a CSV file here, or <span className="text-text-informative p-0!">click to browse</span>
            </span>
          )}
        </div>
        <p className="text-text-muted text-xs">Maximum of {MAX_FILE_SIZE / SIZE_QUOTIENT}MB</p>

        <input id="file-upload" type="file" className="hidden" {...getInputProps()} />
      </div>

      {fileError && <p className="text-text-destructive text-xs font-light">{fileError}</p>}

      {file && (
        <div className="border-border-default bg-bg-card shadow-light flex justify-between rounded-md border py-2 pr-5 pl-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <File />
              <span className="bg-bg-card-inverted text-text-inverted-default absolute top-[40%] left-0 flex h-2.5 items-center rounded-[2px] px-0.5 py-0! text-[9px]">
                csv
              </span>
            </div>

            <div>
              <p className="text-text-default text-sm font-medium">{file.name}</p>
              <p className="text-text-muted text-xs">
                {(file.size / SIZE_QUOTIENT).toFixed(2)}MB <span className="text-border-darker h-3">|</span>{" "}
                <span className="text-text-success">Uploaded</span>
              </p>
            </div>
          </div>
          <Button onClick={clearFile} className="p-0!">
            <XIcon className="text-text-default! size-4" />
          </Button>
        </div>
      )}

      <div className="bg-bg-muted flex flex-col gap-5 rounded-lg p-4 sm:flex-row md:px-6 md:py-4">
        <div className="flex items-center gap-4">
          <FileExcelFill fill="var(--color-icon-success)" className="size-10" />

          <div>
            <h3 className="text-text-default text-base font-semibold">Download CSV Template</h3>
            <p className="text-text-subtle text-xs">You can download the attached example and use it as a starting point for your file</p>
          </div>
        </div>

        <Button
          onClick={() => {
            window.location.href = "/templates/expense-upload-template.csv";
          }}
          className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm font-medium"
        >
          <Download2 fill="var(--color-icon-default-muted)" />
          Download
        </Button>
      </div>
    </div>
  );
};
