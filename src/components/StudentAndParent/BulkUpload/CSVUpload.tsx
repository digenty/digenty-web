import Download2 from "@/components/Icons/Download2";
import File from "@/components/Icons/File";
import FileExcelFill from "@/components/Icons/FileExcelFill";
import Information from "@/components/Icons/Information";
import ViewComfyAlt from "@/components/Icons/ViewComfyAlt";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export const CSVUpload = ({ entity }: { entity: "Students" | "Parents" }) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Upload {entity} List</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">
          Upload your {entity.toLowerCase()} records in CSV format to quickly add them into the system.
        </p>
      </div>

      <div className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover flex flex-col items-center justify-center rounded-md border border-dashed px-6 py-8">
        <ViewComfyAlt fill="var(--color-icon-white-default)" />

        <div className="text-center text-sm font-medium">
          <span className="text-text-default">Drag and drop a CSV file here, or </span>
          <Button className="text-text-informative p-0!">click to browse</Button>
        </div>
        <p className="text-text-muted text-xs">Maximum of 40MB</p>
      </div>

      <div className="border-border-default bg-bg-card shadow-light flex justify-between rounded-md border py-2 pr-5 pl-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <File />
            <span className="bg-bg-card-inverted text-text-inverted-default absolute top-[40%] left-0 flex h-2.5 items-center rounded-[2px] px-0.5 py-0! text-[9px]">
              csv
            </span>
          </div>

          <div>
            <p className="text-text-default text-sm font-medium">filename.csv</p>
            <p className="text-text-muted text-xs">
              1.5MB <span className="text-border-darker h-3">|</span> <span className="text-text-success">Uploaded</span>{" "}
            </p>
          </div>
        </div>
        <Button className="p-0!">
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="bg-bg-muted flex flex-col gap-5 rounded-lg p-4 sm:flex-row md:px-6 md:py-4">
        <div className="flex items-center gap-4">
          <FileExcelFill fill="var(--color-icon-success)" className="size-10" />

          <div>
            <h3 className="text-text-default text-base font-semibold">CSV Template</h3>
            <p className="text-text-subtle text-xs">You can download the attached example and use them as a starting point for your file</p>
          </div>
        </div>
        <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm font-medium">
          <Download2 fill="var(--color-icon-default-muted)" />
          Download
        </Button>
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
