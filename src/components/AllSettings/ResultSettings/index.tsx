"use client";
import Edit from "@/components/Icons/Edit";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Submission } from "./Submission";

const tabs = ["Result Calculation", "Submission Deadline"];
const subjects = ["English Language", "Mathematics", "Physics"];
const grades = ["A", "B", "C", "D", "E", "F"];

export const SettingsResult = () => {
  const [activeTab, setActiveTab] = useState("Result Calculation");
  return (
    <div>
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => {
                setActiveTab(tab);
              }}
              key={tab}
              className={cn(
                "w-1/2 cursor-pointer py-2.5 text-center transition-all duration-150",
                isActive && "border-border-informative border-b-[1.5px]",
              )}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>
      {activeTab === "Result Calculation" && <ClassesSetup />}
      {activeTab === "Submission Deadline" && <Submission />}
    </div>
  );
};

function ClassesResponsiveTabs({ items }: { items: { label: string; content: React.ReactNode }[] }) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        <Select value={String(activeIndex)} onValueChange={value => setActiveIndex(Number(value))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm">{items[activeIndex].label}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {items.map((it, idx) => (
              <SelectItem key={it.label} value={String(idx)} className="text-text-default text-sm">
                {it.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">{items[activeIndex].content}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-9 w-full p-4 md:w-fit md:p-8">
        <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5">
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "transit flex justify-center px-4 py-2 text-sm font-medium",
                  isActive
                    ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                    : "text-text-muted flex h-8 items-center gap-1",
                )}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="flex w-full">
          <div className="flex-1">{items[activeIndex].content}</div>
        </div>
      </div>
    </div>
  );
}

export const ClassesSetup = () => {
  return (
    <div>
      <div className="w-full">
        <ClassesResponsiveTabs
          items={[
            {
              label: "Nusery",
              content: <Nursery />,
            },
            {
              label: "Primary",
              content: <Nursery />,
            },
            {
              label: "Junior Secondary",
              content: <Nursery />,
            },
            {
              label: "Senior Secondary",
              content: <Secondary />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export const Nursery = () => {
  const [nurserySub, setNurserySub] = useState(subjects[0]);
  const [nurseryGrade, setNurseryGrade] = useState(grades[0]);
  return (
    <div className="mx-auto flex w-full max-w-171 items-center justify-center">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div className="text-text-default text-xl font-semibold">Result Calculation</div>
          <Button className="text-text-default border-border-darker rounded-md border">
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        </div>
        <div className="">
          <div className="text-text-default text-md font-semibold">Result Calculation Method</div>
          <div className="text-text-muted text-sm">Choose how the final results are calculated.</div>
        </div>
        <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm">Third Term Only</div>
              <div className="text-text-subtle text-sm">Use only the 3rd term scores for final results.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm">Cumulative Average</div>
              <div className="text-text-subtle text-sm">Combine all terms (1st, 2nd, and 3rd) to calculate an overall average.</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-text-default text-md font-semibold">Promotion Rules</div>
          <div className="text-text-muted text-sm">Decide how students are promoted at the end of the session.</div>
        </div>

        <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Promote All</div>
              <div className="text-text-subtle text-sm">Automatically promote every student.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Manual Promotion</div>
              <div className="text-text-subtle text-sm">Decide each student&apos;s promotion manually.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">By Performance</div>
              <div className="text-text-subtle text-sm">Promote students who meet a minimum score (either cumulative or final term)</div>
              <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
              <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                <Input type="number" className="text-text-muted border-none" placeholder="100" />
                <div className="text-text-muted">%</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Subject Combination</div>
              <div className="text-text-subtle text-sm">Set specific subject requirements and performance criteria</div>
              <Label className="text-text-default text-sm font-medium">A. Required passes (Compulsory)</Label>
              <div className="text-text-subtle text-sm">Multi-select subjects that student must pass</div>

              <Select value={nurserySub} onValueChange={setNurserySub}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{nurserySub}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {subjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="text-text-default text-sm">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {["English Language", "Mathematics", "Physics"].map(sb => (
                  <div className="bg-bg-badge-default text-text-subtle rounded-sm p-1 text-xs" key={sb}>
                    <div>{sb}</div>
                  </div>
                ))}
              </div>
              <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
              <Select value={nurseryGrade} onValueChange={setNurseryGrade}>
                <Label className="text-text-default text-sm font-medium">Grade required to pass a subject</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal md:w-57">
                  <SelectValue>
                    <span className="text-text-default text-sm">{nurseryGrade}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {grades.map(grd => (
                    <SelectItem key={grd} value={grd} className="text-text-default text-sm">
                      {grd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">By Performance</div>
                <div className="text-text-subtle text-sm">Set minimum overall percentage</div>
                <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
                <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                  <Input type="number" className="text-text-muted border-none" placeholder="100" />
                  <div className="text-text-muted">%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border-default mt-5 flex items-center justify-between border-t py-4">
          <Button className="bg-bg-state-soft! text-text-subtle rounded-md">Cancel</Button>
          <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md">Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export const Secondary = () => {
  const [secondaryArtSub, setSecondaryArtSub] = useState(subjects[0]);
  const [secondaryCommercialSub, setSecondaryCommercialSub] = useState(subjects[0]);
  const [secondaryScienceSub, setSecondaryScienceSub] = useState(subjects[0]);
  const [secondaryGrade, setSecondaryGrade] = useState(grades[0]);
  return (
    <div className="mx-auto flex w-full max-w-171 items-center justify-center">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <div className="text-text-default text-xl font-semibold">Result Calculation</div>
          <Button className="text-text-default border-border-darker rounded-md border">
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        </div>
        <div className="">
          <div className="text-text-default text-md font-semibold">Result Calculation Method</div>
          <div className="text-text-muted text-sm">Choose how the final results are calculated.</div>
        </div>
        <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm">Third Term Only</div>
              <div className="text-text-subtle text-sm">Use only the 3rd term scores for final results.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm">Cumulative Average</div>
              <div className="text-text-subtle text-sm">Combine all terms (1st, 2nd, and 3rd) to calculate an overall average.</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-text-default text-md font-semibold">Promotion Rules</div>
          <div className="text-text-muted text-sm">Decide how students are promoted at the end of the session.</div>
        </div>

        <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Promote All</div>
              <div className="text-text-subtle text-sm">Automatically promote every student.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Manual Promotion</div>
              <div className="text-text-subtle text-sm">Decide each student&apos;s promotion manually.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">By Performance</div>
              <div className="text-text-subtle text-sm">Promote students who meet a minimum score (either cumulative or final term)</div>
              <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
              <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                <Input type="number" className="text-text-muted border-none" placeholder="100" />
                <div className="text-text-muted">%</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <RoundedCheckbox onChange={() => {}} checked={false} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Subject Combination</div>
              <div className="text-text-subtle text-sm">Set specific subject requirements and performance criteria</div>
              <Label className="text-text-default text-sm font-medium">A. Required passes (Compulsory)</Label>
              <div className="text-text-subtle text-sm">Multi-select subjects that student must pass</div>

              <Select value={secondaryArtSub} onValueChange={setSecondaryArtSub}>
                <Label className="text-text-default text-sm font-medium">Art Subjects</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{secondaryArtSub}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {subjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="text-text-default text-sm">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {["English Language", "Mathematics", "Physics"].map(sb => (
                  <div className="bg-bg-badge-default text-text-subtle rounded-sm p-1 text-xs" key={sb}>
                    <div>{sb}</div>
                  </div>
                ))}
              </div>
              <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
              <Select value={secondaryCommercialSub} onValueChange={setSecondaryCommercialSub}>
                <Label className="text-text-default text-sm font-medium">Commercial Subjects</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{secondaryCommercialSub}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {subjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="text-text-default text-sm">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {["English Language", "Mathematics", "Physics"].map(sb => (
                  <div className="bg-bg-badge-default text-text-subtle rounded-sm p-1 text-xs" key={sb}>
                    <div>{sb}</div>
                  </div>
                ))}
              </div>
              <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
              <Select value={secondaryScienceSub} onValueChange={setSecondaryScienceSub}>
                <Label className="text-text-default text-sm font-medium">Art Subjects</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm">{secondaryScienceSub}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {subjects.map(sub => (
                    <SelectItem key={sub} value={sub} className="text-text-default text-sm">
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {["English Language", "Mathematics", "Physics"].map(sb => (
                  <div className="bg-bg-badge-default text-text-subtle rounded-sm p-1 text-xs" key={sb}>
                    <div>{sb}</div>
                  </div>
                ))}
              </div>
              <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
              <Select value={secondaryGrade} onValueChange={setSecondaryGrade}>
                <Label className="text-text-default text-sm font-medium">Grade required to pass a subject</Label>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal md:w-57">
                  <SelectValue>
                    <span className="text-text-default text-sm">{secondaryGrade}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {grades.map(grd => (
                    <SelectItem key={grd} value={grd} className="text-text-default text-sm">
                      {grd}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">By Performance</div>
                <div className="text-text-subtle text-sm">Set minimum overall percentage</div>
                <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
                <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                  <Input type="number" className="text-text-muted border-none" placeholder="100" />
                  <div className="text-text-muted">%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border-default mt-5 flex items-center justify-between border-t py-4">
          <Button className="bg-bg-state-soft! text-text-subtle rounded-md">Cancel</Button>
          <Button className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md">Save changes</Button>
        </div>
      </div>
    </div>
  );
};
