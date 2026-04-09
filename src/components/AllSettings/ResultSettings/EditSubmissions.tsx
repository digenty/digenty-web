import { DateRangePicker } from "@/components/DatePicker";
import Edit from "@/components/Icons/Edit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const EditSubmissions = () => {
  const [firstTermStartValue, setFirstTermStartValue] = useState<Date | undefined>();
  const [firstTermEndValue, setFirstTermEndValue] = useState<Date | undefined>();
  const [secondTermStartValue, setSecondTermStartValue] = useState<Date | undefined>();
  const [secondTermEndtValue, setSecondTermEndtValue] = useState<Date | undefined>();
  const [thirdTermStartValue, setThirdTermStartValue] = useState<Date | undefined>();
  const [thirdTermEndtValue, setThirdTermEndValue] = useState<Date | undefined>();

  return (
    <div className="mx-auto flex w-full max-w-181 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-between">
          <div className="text-text-default text-xl font-semibold">Submission Deadline</div>
          <Button className="text-text-default border-border-darker rounded-md border">
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        </div>
        <div className="bg-bg-card border-border-darker w-full rounded-md border p-4 md:p-6">
          <div className="text-text-default text-md mb-4 font-semibold">First Term</div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <DateRangePicker
              label="Open Date"
              date={firstTermStartValue}
              setDate={setFirstTermStartValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
            <DateRangePicker
              label="close Date"
              date={firstTermEndValue}
              setDate={setFirstTermEndValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox />
            <div className="text-text-muted text-sm font-medium">Auto-lock after deadline</div>
          </div>
        </div>

        <div className="bg-bg-card border-border-darker w-full rounded-md border p-4 md:p-6">
          <div className="text-text-default text-md mb-4 font-semibold">Second Term</div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <DateRangePicker
              label="Open Date"
              date={secondTermStartValue}
              setDate={setSecondTermStartValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
            <DateRangePicker
              label="Close Date"
              date={secondTermEndtValue}
              setDate={setSecondTermEndtValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox />
            <div className="text-text-muted text-sm font-medium">Auto-lock after deadline</div>
          </div>
        </div>

        <div className="bg-bg-card border-border-darker w-full rounded-md border p-4 md:p-6">
          <div className="text-text-default text-md mb-4 font-semibold">Third Term</div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <DateRangePicker
              label="Open Date"
              date={thirdTermStartValue}
              setDate={setThirdTermStartValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
            <DateRangePicker
              label="Close Date"
              date={thirdTermEndtValue}
              setDate={setThirdTermEndValue}
              className="bg-bg-input-soft! text-text-default h-9! w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox />
            <div className="text-text-muted text-sm font-medium">Auto-lock after deadline</div>
          </div>
        </div>
      </div>
    </div>
  );
};
