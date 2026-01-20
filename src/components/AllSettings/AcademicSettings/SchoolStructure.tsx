import { DateRangePicker } from "@/components/DatePicker";
import { AddFill } from "@/components/Icons/AddFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Map from "@/components/Icons/Map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

const accademicsSessions = [{ label: "2023/2024", value: "2023/2024" }];
const terms = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const SchoolStructure = () => {
  const [academic, setAcademic] = useState(accademicsSessions[0]);
  const [term, setTerm] = useState(terms[0]);
  const [firstTermStartValue, setFirstTermStartValue] = useState<DateRange | undefined>();
  const [firstTermEndValue, setFirstTermEndValue] = useState<DateRange | undefined>();
  const [secondTermStartValue, setSecondTermStartValue] = useState<DateRange | undefined>();
  const [secondTermEndtValue, setSecondTermEndtValue] = useState<DateRange | undefined>();
  const [thirdTermStartValue, setThirdTermStartValue] = useState<DateRange | undefined>();
  const [thirdTermEndtValue, setThirdTermEndValue] = useState<DateRange | undefined>();
  const [branches, setBranches] = useState([{ id: crypto.randomUUID() }]);

  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-150 md:px-4">
      <div className="text-text-default text-lg font-semibold">Academic Session & Term</div>
      <div className="border-border-default grid w-full grid-cols-1 items-center gap-6 border-b pb-6 md:grid-cols-2">
        {/* Academic */}
        <Select value={academic.label} onValueChange={() => setAcademic(academic)}>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">Academic Session</Label>
            <SelectTrigger className="bg-bg-input-soft! h-9! w-auto border-none">
              <SelectValue>
                <span className="text-text-default text-sm font-medium">{academic.label}</span>
              </SelectValue>
            </SelectTrigger>
          </div>
          <SelectContent className="bg-bg-card border-border-default">
            {accademicsSessions.map(academic => (
              <SelectItem key={academic.label} value={academic.label} className="text-text-default text-sm font-medium">
                {academic.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Terms */}
        <Select value={term} onValueChange={setTerm}>
          <div className="flex flex-col gap-2">
            <Label className="text-text-default text-sm font-medium">
              Current Term <span className="text-text-destructive text-sm">*</span>
            </Label>
            <SelectTrigger className="bg-bg-input-soft! h-9! w-auto border-none">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-text-default text-sm font-semibold">{term}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
          </div>
          <SelectContent className="bg-bg-card border-border-default">
            {terms.map(term => (
              <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* First Term */}
        <DateRangePicker
          label="First Term Start Date"
          value={firstTermStartValue}
          onChange={setFirstTermStartValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="First Term End Date"
          value={firstTermEndValue}
          onChange={setFirstTermEndValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        {/* Second Term */}
        <DateRangePicker
          label="Second Term Start Date"
          value={secondTermStartValue}
          onChange={setSecondTermStartValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Second Term End Date"
          value={secondTermEndtValue}
          onChange={setSecondTermEndtValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        {/* Third Term */}
        <DateRangePicker
          label="Third Term Start Date"
          value={thirdTermStartValue}
          onChange={setThirdTermStartValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Third Term End Date"
          value={thirdTermEndtValue}
          onChange={setThirdTermEndValue}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
      </div>

      <div className="flex flex-col gap-6">
        {branches.map((branch, index) => (
          <div key={branch.id} className="bg-bg-state-soft rounded-md p-1">
            <div className="flex items-center justify-between px-5 py-2">
              <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">Branch {index + 1}</Badge>
              <Button
                onClick={() => setBranches(prev => prev.filter(b => b.id !== branch.id))}
                className="bg-bg-state-soft! hover:bg-bg-none! flex h-7! w-7! items-center justify-center rounded-md p-2"
              >
                <DeleteBin fill="var(--color-icon-default-muted)" className="bg-bg-" />
              </Button>
            </div>
            <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" placeholder="e.g Lawanson Branch" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-text-default text-sm font-medium">
                  {" "}
                  <Map fill="var(--color-icon-default-muted)" /> Branch Address
                </Label>
                <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" placeholder="e.g 11 example street" />
              </div>
              <div className="border-border-darker rounded-md border p-3">
                <div className="text-text-default mb-3 text-sm font-medium">Select Levels</div>
                <div className="flex flex-wrap gap-3">
                  {["Creche", "Kindergarten", "Nursery", "Primary", "Secondary"].map(level => (
                    <div
                      key={level}
                      className="bg-bg-card text-text-default border-border-darker flex h-8 items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                    >
                      <Checkbox /> {level}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
          onClick={() => setBranches(prev => [...prev, { id: crypto.randomUUID() }])}
        >
          {" "}
          <AddFill fill="var(--color-icon-default-muted)" /> Add Branch
        </Button>
      </div>
    </div>
  );
};
