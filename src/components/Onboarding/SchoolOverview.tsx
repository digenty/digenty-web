import React from "react";
import School from "../Icons/School";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Map from "../Icons/Map";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import DeleteBin from "../Icons/DeleteBin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { BranchType } from "./types";
import { FormikProps } from "formik";

const numbersOfBranches = [2, 3, 4, 5, 6, 7];

interface BranchFormValues {
  activeOption: BranchType | null;
  numOfBranches: number;
  branches: { branchName: string; address: string; levels: string[] }[];
  singleBranch: { branchName: string; address: string; levels: string[] };
}

interface SchoolOverviewProps {
  formik: FormikProps<BranchFormValues>;
}

export const SchoolOverview = ({ formik }: SchoolOverviewProps) => {
  const { activeOption, numOfBranches, branches } = formik.values;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">School Overview</div>
        <div className="text-text-muted text-sm">Tell us about your school&apos;s structure</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          role="button"
          onClick={() => formik.setFieldValue("activeOption", "one")}
          className={`border-border-darker flex flex-col gap-1 rounded-sm border p-4 ${activeOption === "one" ? "border-border-informative border-2" : ""}`}
        >
          <School fill="var(--color-icon-default-subtle)" />
          <div className="text-text-default text-sm font-medium">One Branch</div>
        </div>

        <div
          role="button"
          onClick={() => formik.setFieldValue("activeOption", "multiple")}
          className={`border-border-darker flex flex-col gap-1 rounded-sm border p-4 ${activeOption === "multiple" ? "border-border-informative border-2" : ""}`}
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
                <Map fill="var(--color-icon-default-muted)" /> Branch Name
              </Label>
              <Input
                className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                placeholder="e.g Branch 1"
                value={formik.values.singleBranch.branchName}
                onChange={e => formik.setFieldValue("singleBranch.branchName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                <Map fill="var(--color-icon-default-muted)" /> Branch Address
              </Label>
              <Input
                className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                placeholder="e.g 11 example street"
                value={formik.values.singleBranch.address}
                onChange={e => formik.setFieldValue("singleBranch.address", e.target.value)}
              />
            </div>

            <div className="border-border-default flex flex-col gap-3 rounded-md border p-3">
              <div className="text-text-default text-sm font-medium">Select Levels</div>
              <div className="flex flex-wrap gap-3">
                {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(level => {
                  const checked = formik.values.singleBranch.levels.includes(level);
                  return (
                    <div
                      key={level}
                      role="button"
                      onClick={() => {
                        const updated = checked
                          ? formik.values.singleBranch.levels.filter(l => l !== level)
                          : [...formik.values.singleBranch.levels, level];
                        formik.setFieldValue("singleBranch.levels", updated);
                      }}
                      className={`border-border-darker text-text-default flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                        checked ? "border-border-informative bg-bg-state-soft" : ""
                      }`}
                    >
                      <Checkbox checked={checked} />
                      {level}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MULTIPLE BRANCHES */}
      {activeOption === "multiple" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">How many branches?</Label>
            <Select
              value={String(numOfBranches)}
              onValueChange={value => {
                const n = Number(value);
                const newBranches = Array.from({ length: n }, (_, i) => branches[i] ?? { branchName: "", address: "", levels: [] });
                formik.setFieldValue("numOfBranches", n);
                formik.setFieldValue("branches", newBranches);
              }}
            >
              <SelectTrigger className="bg-bg-input-soft! w-full border-none">
                <SelectValue>
                  <span className="text-text-default flex text-sm font-medium">{numOfBranches}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default border">
                {numbersOfBranches.map(nb => (
                  <SelectItem key={nb} value={String(nb)} className="text-text-default">
                    {nb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex max-h-50 min-h-0 flex-col gap-3 overflow-y-auto">
            {branches.map((b, index) => (
              <div key={index} className="bg-bg-muted flex flex-col gap-3 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="text-text-default text-md font-semibold">Branch {index + 1}</div>
                  <Button
                    type="button"
                    className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! p-1"
                    onClick={() => {
                      const updated = [...branches];
                      updated.splice(index, 1);
                      formik.setFieldValue("branches", updated);
                      formik.setFieldValue("numOfBranches", updated.length);
                    }}
                  >
                    <DeleteBin fill="var(--color-icon-default-subtle)" />
                  </Button>
                </div>

                <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                      placeholder={`e.g Branch ${index + 1}`}
                      value={b.branchName}
                      onChange={e => formik.setFieldValue(`branches.${index}.branchName`, e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default flex items-center gap-2 text-sm font-medium">
                      <Map fill="var(--color-icon-default-muted)" /> Branch Address
                    </Label>
                    <Input
                      className="bg-bg-input-soft! text-text-default w-full border-none text-sm"
                      placeholder="e.g 11 example street"
                      value={b.address}
                      onChange={e => formik.setFieldValue(`branches.${index}.address`, e.target.value)}
                    />
                  </div>

                  <div className="border-border-default flex flex-col gap-3 rounded-md border p-3">
                    <div className="text-text-default text-sm font-medium">Select Levels</div>
                    <div className="flex flex-wrap gap-3">
                      {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(level => {
                        const checked = b.levels.includes(level);
                        return (
                          <div
                            key={level}
                            role="button"
                            onClick={() => {
                              const updated = checked ? b.levels.filter(l => l !== level) : [...b.levels, level];
                              formik.setFieldValue(`branches.${index}.levels`, updated);
                            }}
                            className={`border-border-darker text-text-default flex cursor-pointer items-center gap-3 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                              checked ? "border-border-informative bg-bg-state-soft" : ""
                            }`}
                          >
                            <Checkbox checked={checked} />
                            {level}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
