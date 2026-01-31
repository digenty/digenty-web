import React, { useState } from "react";
import School from "../Icons/School";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Map from "../Icons/Map";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import DeleteBin from "../Icons/DeleteBin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type BranchType = "one" | "multiple";
const numbersOfBrnaches = [2, 3, 4, 5, 6, 7];
export const SchoolOverview = () => {
  const [activeOption, setActiveOption] = useState<BranchType | null>(null);
  const [numOfBrnaches, setNumOfBranches] = useState<number>(numbersOfBrnaches[0]);
  const branches = Array.from({ length: numOfBrnaches }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">School Overview</div>
        <div className="text-text-muted text-sm">Tell us about your school&apos;s structure</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => setActiveOption("one")}
          role="button"
          className={`border-border-darker flex flex-col gap-1 rounded-sm border p-4 ${activeOption === "one" && "border-border-informative border-2"}`}
        >
          <School fill="var(--color-icon-default-subtle)" />

          <div className="text-text-default text-sm font-medium">One Branch</div>
        </div>
        {/*  */}

        <div
          onClick={() => setActiveOption("multiple")}
          role="button"
          className={`border-border-darker flex flex-col gap-1 rounded-sm border p-4 ${activeOption === "multiple" && "border-border-informative border-2"}`}
        >
          <School fill="var(--color-icon-default-subtle)" />

          <div className="text-text-default text-sm font-medium">Multiple Branches</div>
        </div>
      </div>

      {activeOption === "one" && (
        <div className="bg-bg-muted rounded-lg p-3">
          <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                {" "}
                <Map fill="var(--color-icon-default-muted)" /> School Address
              </Label>
              <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g 11 example street" />
            </div>

            <div className="border-border-default flex flex-col gap-3 rounded-md border p-3">
              <div className="text-text-default text-sm font-medium">Select Levels</div>
              <div className="flex flex-wrap gap-3">
                {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(cl => (
                  <div
                    key={cl}
                    className="border-border-darker text-text-default flex items-center gap-3 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                  >
                    <Checkbox /> {cl}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeOption === "multiple" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">How many branches?</Label>
            <Select value={String(numOfBrnaches)} onValueChange={value => setNumOfBranches(Number(value))}>
              <SelectTrigger className="bg-bg-input-soft! w-full border-none">
                <SelectValue placeholder="Select one">
                  {" "}
                  <span className="text-text-default flex text-sm font-medium"> {numOfBrnaches}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default border">
                {numbersOfBrnaches.map(nb => (
                  <SelectItem key={nb} value={String(nb)} className="text-text-default">
                    {nb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <div className="flex max-h-50 min-h-0 flex-col gap-3 overflow-y-auto">
              {branches.map(branch => (
                <div key={branch} className="bg-bg-muted flex flex-col gap-3 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-text-default text-md font-semibold">Branch {branch}</div>
                    <Button className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! p-1">
                      <DeleteBin fill="var(--color-icon-default-subtle)" />
                    </Button>
                  </div>

                  <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                      <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder={`e.g Branch ${branch}`} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                        <Map fill="var(--color-icon-default-muted)" /> Branch Address
                      </Label>
                      <Input className="bg-bg-input-soft! text-text-default w-full border-none text-sm" placeholder="e.g 11 example street" />
                    </div>

                    <div className="border-border-default flex flex-col gap-3 rounded-md border p-3">
                      <div className="text-text-default text-sm font-medium">Select Levels</div>
                      <div className="flex flex-wrap gap-3">
                        {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(cl => (
                          <div
                            key={cl}
                            className="border-border-darker text-text-default flex items-center gap-3 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                          >
                            <Checkbox /> {cl}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
