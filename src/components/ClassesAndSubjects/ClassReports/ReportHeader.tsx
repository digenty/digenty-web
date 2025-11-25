import Approve from "@/components/Icons/Approve";
import { Button } from "@/components/ui/button";

export const ReportHeader = () => {
  return (
    <div>
      <div className="border-border-default border-b">
        <div className="flex md:items-center md:justify-between md:p-4">
          <h2 className="text-text-default text-lg font-semibold">JSS 1A, Spreadsheet</h2>

          <div className="flex items-center gap-1">
            <Button className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium">
              Export
            </Button>
            <Button className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-46 items-center gap-1 rounded-md border text-sm font-medium">
              Return Result
            </Button>
            <Button className="bg-bg-state-secondary border-border-default text-text-default flex h-8 w-32.5 items-center gap-1 rounded-md border text-sm font-medium">
              <Approve fill="var(--color-icon-default-muted)" />
              Approve Result
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
