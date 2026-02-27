"use client";
import Download2 from "@/components/Icons/Download2";
import File from "@/components/Icons/File";
import { FileExcel } from "@/components/Icons/FileExcel";
import { FileExcel2 } from "@/components/Icons/FileExcel2";
import FileExcelFill from "@/components/Icons/FileExcelFill";
import Information from "@/components/Icons/Information";
import ViewComfyAlt from "@/components/Icons/ViewComfyAlt";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { Skeleton } from "@/components/ui/skeleton";
import { Branch } from "@/api/types";

export type ValidationError = {
  row: number;
  errors: string[];
};

const maxFileSize = 40 * 1024 * 1024;
const sizeQuotient = 1024 * 1024;

export const CSVUpload = ({
  entity,
  file,
  setFile,
  setErrors,
  handleValidation,
  branchSelected,
  setBranchSelected,
}: {
  entity: "Students" | "Parents";
  file: File | null;
  setFile: (file: File | null) => void;
  setErrors: Dispatch<SetStateAction<ValidationError[]>>;
  handleValidation: (file: File, filetype: string) => void;
  branchSelected: Branch | null;
  setBranchSelected: (branch: Branch | null) => void;
}) => {
  useBreadcrumb([
    { label: "Student & Parent Record", url: "/student-and-parent-record" },
    { label: entity, url: `/student-and-parent-record?tab=${entity}` },
    { label: "CSV Upload", url: "" },
  ]);

  const { data: branches, isPending: loadingBranches } = useGetBranches();

  const handleCSVDownload = () => {
    if (entity === "Students") {
      window.location.href = `/templates/student-upload-template.csv`;
    } else {
      window.location.href = `/templates/parent-upload-template.csv`;
    }
  };
  const [fileError, setFileError] = useState<string | null>(null);

  const handleXSLXDownload = async () => {
    const res = await fetch(`/api/upload-template?entity=${entity}`);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entity}-upload-template.xlsx`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        if (file.type !== "text/csv" && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          setFileError("Invalid file type. File type must be CSV or XLSX");
          return;
        }

        if (file.size > maxFileSize) {
          setFileError(`File size must be less than ${maxFileSize / sizeQuotient}MB`);
          return;
        }

        const extension = file.name.split(".").pop()?.toLowerCase() || "";

        if (!fileError) {
          setFile(file);
          handleValidation(file, extension);
        }
      });
    },
    [fileError, handleValidation, setFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxFiles: 1,
    disabled: !!file,
  });

  const clearFile = () => {
    setFile(null);
    setErrors([]);
    setFileError(null);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Upload {entity} List</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">
          Upload your {entity.toLowerCase()} records in CSV format to quickly add them into the system.
        </p>
      </div>

      <div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="text-text-default text-sm font-medium">
              Select Branch<small className="text-text-destructive text-xs">*</small>
            </Label>
          </div>
          {!branches || loadingBranches ? (
            <Skeleton className="bg-bg-input-soft h-9 w-full" />
          ) : (
            <Select
              onValueChange={value => {
                const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                setBranchSelected(branch);
              }}
            >
              <SelectTrigger className="bg-bg-input-soft! h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-light!">
                <span className="text-text-default! text-sm font-medium">{branchSelected ? branchSelected?.name : "Select a branch"}</span>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {branches.data.content.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-medium">
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div
        // {...(!file ? getRootProps() : {})}
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
        <p className="text-text-muted text-xs">Maximum of 40MB</p>

        <input id="file-upload" type="file" className="hidden" {...getInputProps()} />
      </div>

      {file && (
        <div className="border-border-default bg-bg-card shadow-light flex justify-between rounded-md border py-2 pr-5 pl-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <File />
              <span className="bg-bg-card-inverted text-text-inverted-default absolute top-[40%] left-0 flex h-2.5 items-center rounded-[2px] px-0.5 py-0! text-[9px]">
                {file.type === "text/csv" ? "csv" : "xlsx"}
              </span>
            </div>

            <div>
              <p className="text-text-default text-sm font-medium">{file.name}</p>
              <p className="text-text-muted text-xs">
                {(file.size / sizeQuotient).toFixed(2)}MB <span className="text-border-darker h-3">|</span>{" "}
                <span className="text-text-success">Uploaded</span>{" "}
              </p>
            </div>
          </div>
          <Button onClick={() => clearFile()} className="p-0!">
            <XIcon className="size-4" />
          </Button>
        </div>
      )}

      <div className="bg-bg-muted flex flex-col gap-5 rounded-lg p-4 sm:flex-row md:px-6 md:py-4">
        <div className="flex items-center gap-4">
          <FileExcelFill fill="var(--color-icon-success)" className="size-10" />

          <div>
            <h3 className="text-text-default text-base font-semibold">Download CSV or XLSX Template</h3>
            <p className="text-text-subtle text-xs">You can download the attached example and use them as a starting point for your file</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm font-medium">
              <Download2 fill="var(--color-icon-default-muted)" />
              Download
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-bg-card border-none" align="start">
            <DropdownMenuItem onClick={() => handleCSVDownload()} className="text-text-default">
              <FileExcel fill="var(--color-icon-default-subtle)" className="size-4" /> CSV Template
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleXSLXDownload()} className="text-text-default">
              <FileExcel2 fill="var(--color-default-subtle)" className="size-4" /> XSLX Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {entity === "Students" && (
        <div className="bg-bg-badge-blue border-border-default shadow-light flex items-center gap-2.5 rounded-md border px-3 py-2.5">
          <Information fill="var(--color-icon-informative)" className="size-6" />
          <p className="text-text-subtle text-xs">
            For a smoother import, make sure parent records are uploaded first so students can be linked automatically.
          </p>
        </div>
      )}
    </div>
  );
};
