import AlertFill from "@/components/Icons/AlertFill";
import Bill from "@/components/Icons/Bill";
import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import Download2 from "@/components/Icons/Download2";
import { OverviewCard } from "@/components/OverviewCard";
import { Button } from "@/components/ui/button";

export const ConfirmUpload = ({ entity }: { entity: "Students" | "Parents" }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-text-default text-lg font-semibold">Confirm {entity} Upload</h3>
        <p className="text-text-subtle max-w-100 text-center text-xs">Review the summary of your upload before completing the import.</p>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-3">
        <OverviewCard
          title="Total Records"
          Icon={() => (
            <div className="bg-bg-basic-teal-subtle border-bg-basic-teal-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <Bill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="287"
        />

        <OverviewCard
          title="Valid Records"
          Icon={() => (
            <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <CheckboxCircleFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="280"
        />

        <OverviewCard
          title="Invalid Records"
          Icon={() => (
            <div className="bg-bg-basic-red-subtle border-bg-basic-red-accent flex w-6 items-center justify-center rounded-xs border p-1">
              <AlertFill fill="var(--color-icon-default)" className="size-[10px]" />
            </div>
          )}
          value="7"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <div className="bg-bg-basic-orange-subtle border-border-default shadow-light flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5">
        <AlertFill fill="var(--color-bg-basic-orange-accent)" className="size-6" />
        <p className="text-text-subtle text-xs">Some records contain errors. They will not be imported unless corrected.</p>
      </div>

      <div className="border-border-darker w-full space-y-4 rounded-md border p-6">
        <h3 className="text-text-default text-lg font-semibold">Error Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-icon-destructive aspect-square size-2.5 rounded-full" />
            <p className="text-text-subtle text-sm">1 invalid email address</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-icon-destructive aspect-square size-2.5 rounded-full" />
            <p className="text-text-subtle text-sm">1 invalid email address</p>
          </div>
        </div>
      </div>

      <Button className="bg-bg-state-secondary border-border-darker text-text-default rounded-md border text-sm font-medium">
        <Download2 fill="var(--color-icon-default-muted)" />
        Download Error Report (CSV)
      </Button>
    </div>
  );
};
