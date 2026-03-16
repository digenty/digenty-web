"use client";

import { Branch, NewBranchForm, SchoolStructurePayload } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { AddFill } from "@/components/Icons/AddFill";
import Map from "@/components/Icons/Map";
import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddSchoolStructure } from "@/hooks/queryHooks/useAcademic";
import { useAddBranch, useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getAcademicYears } from "@/lib/utils";
import { schoolStructureSchema } from "@/schema/academic";
import { LEVELS } from "@/store/classes";
import { terms } from "@/types";
import { format } from "date-fns";
import { useFormik } from "formik";
import { forwardRef, useImperativeHandle, useState } from "react";
import { DateRange } from "react-day-picker";

export type SchoolStructureHandle = {
  submit: () => Promise<boolean>;
};

type FormValues = {
  name: string;
  currentTerm: string;
  firstTermStart?: DateRange;
  firstTermEnd?: DateRange;
  secondTermStart?: DateRange;
  secondTermEnd?: DateRange;
  thirdTermStart?: DateRange;
  thirdTermEnd?: DateRange;
  branchLevels: Record<number, string[]>;
};

const toDateStr = (range?: DateRange): string | undefined => (range?.from ? format(range.from, "yyyy-MM-dd") : undefined);

const emptyNewBranch = (): NewBranchForm => ({
  id: crypto.randomUUID(),
  branchName: "",
  address: "",
  levels: [],
  isSubmitting: false,
});

export const SchoolStructure = forwardRef<SchoolStructureHandle>((_, ref) => {
  const { data: branchesData, isFetching: isLoadingBranches, refetch: refetchBranches, isError } = useGetBranches();
  console.log(useLoggedInUser());
  const existingBranches: Branch[] = branchesData?.data?.content ?? [];
  const [newBranches, setNewBranches] = useState<NewBranchForm[]>([]);
  const { mutateAsync: submitSchoolStructure } = useAddSchoolStructure();
  const { mutateAsync: createBranch } = useAddBranch();

  const formik = useFormik<FormValues>({
    initialValues: {
      name: getAcademicYears()[0],
      currentTerm: "",
      branchLevels: {},
    },
    validationSchema: schoolStructureSchema,
    onSubmit: () => {},
  });

  const toggleExistingBranchLevel = (branchId: number, level: string) => {
    const current = formik.values.branchLevels[branchId] ?? [];
    const updated = current.includes(level) ? current.filter(l => l !== level) : [...current, level];
    formik.setFieldValue("branchLevels", { ...formik.values.branchLevels, [branchId]: updated });
  };

  const updateNewBranch = (id: string, field: keyof NewBranchForm, value: string | string[] | boolean) => {
    setNewBranches(prev => prev.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const toggleNewBranchLevel = (id: string, level: string) => {
    setNewBranches(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const updated = b.levels.includes(level) ? b.levels.filter(l => l !== level) : [...b.levels, level];
        return { ...b, levels: updated };
      }),
    );
  };

  const handleAddBranch = async (id: string) => {
    const branch = newBranches.find(b => b.id === id);
    if (!branch) return;

    if (!branch.branchName.trim()) {
      toast({ title: "Branch name is required", description: "Please enter a name for the branch.", type: "warning" });
      return;
    }
    if (branch.levels.length === 0) {
      toast({ title: "Select at least one level", description: "Please select at least one level for this branch.", type: "warning" });
      return;
    }

    updateNewBranch(id, "isSubmitting", true);

    try {
      await createBranch({
        branchDtos: [{ branchName: branch.branchName, address: branch.address, levels: branch.levels }],
      });

      setNewBranches(prev => prev.filter(b => b.id !== id));
      await refetchBranches();
      toast({ title: "Branch created", description: `${branch.branchName} has been added successfully.`, type: "success" });
    } catch (error: unknown) {
      updateNewBranch(id, "isSubmitting", false);
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Failed to create branch", description: message, type: "error" });
    }
  };

  const handleCancelNewBranch = (id: string) => {
    setNewBranches(prev => prev.filter(b => b.id !== id));
  };

  useImperativeHandle(ref, () => ({
    submit: async (): Promise<boolean> => {
      const errors = await formik.validateForm();

      if (Object.keys(errors).length > 0) {
        formik.setTouched({ name: true, currentTerm: true });
        toast({ title: "Please fill in required fields", description: "Academic session and current term are required.", type: "warning" });
        return false;
      }

      const values = formik.values;

      try {
        const branchesAndLevelsDtos = existingBranches
          .filter(branch => (values.branchLevels[branch.id] ?? []).length > 0)
          .map(branch => ({ branchId: branch.id, levels: values.branchLevels[branch.id] }));

        if (branchesAndLevelsDtos.length === 0) {
          toast({
            title: "Select levels for at least one branch",
            description: "Please select at least one level for a branch before proceeding.",
            type: "warning",
          });
          return false;
        }

        const payload: SchoolStructurePayload = {
          name: values.name,
          currentTerm: values.currentTerm,
          firstTermStartDate: toDateStr(values.firstTermStart),
          firstTermEndDate: toDateStr(values.firstTermEnd),
          secondTermStartDate: toDateStr(values.secondTermStart),
          secondTermEndDate: toDateStr(values.secondTermEnd),
          thirdTermStartDate: toDateStr(values.thirdTermStart),
          thirdTermEndDate: toDateStr(values.thirdTermEnd),
          branchesAndLevelsDtos,
        };

        await submitSchoolStructure(payload);
        toast({ title: "School structure saved", description: "Academic session and term have been set up successfully.", type: "success" });
        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        toast({ title: "Failed to save school structure", description: message, type: "error" });
        return false;
      }
    },
  }));

  return (
    <div className="mx-auto flex w-full flex-col gap-4 md:w-150 md:px-4">
      <div className="text-text-default text-lg font-semibold">Academic Session & Term</div>

      <div className="border-border-default grid w-full grid-cols-1 items-center gap-6 border-b pb-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">
            Academic Session <span className="text-text-destructive text-sm">*</span>
          </Label>
          <Select value={formik.values.name} onValueChange={val => formik.setFieldValue("name", val)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Session" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {getAcademicYears().map(session => (
                <SelectItem key={session} className="text-text-default" value={session}>
                  {session}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.name && formik.errors.name && <p className="text-text-destructive text-xs">{formik.errors.name}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-text-default text-sm font-medium">
            Current Term <span className="text-text-destructive text-sm">*</span>
          </Label>

          <Select value={formik.values.currentTerm} onValueChange={val => formik.setFieldValue("currentTerm", val)}>
            <SelectTrigger className="text-text-muted bg-bg-input-soft! w-full border-none text-sm font-normal">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent className="bg-bg-card border-border-default">
              {terms.map(term => (
                <SelectItem key={term.label} className="text-text-default" value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {formik.touched.currentTerm && formik.errors.currentTerm && <p className="text-text-destructive text-xs">{formik.errors.currentTerm}</p>}
        </div>

        {/* Term Date Pickers */}
        <DateRangePicker
          label="First Term Start Date"
          value={formik.values.firstTermStart}
          onChange={val => formik.setFieldValue("firstTermStart", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="First Term End Date"
          value={formik.values.firstTermEnd}
          onChange={val => formik.setFieldValue("firstTermEnd", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Second Term Start Date"
          value={formik.values.secondTermStart}
          onChange={val => formik.setFieldValue("secondTermStart", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Second Term End Date"
          value={formik.values.secondTermEnd}
          onChange={val => formik.setFieldValue("secondTermEnd", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Third Term Start Date"
          value={formik.values.thirdTermStart}
          onChange={val => formik.setFieldValue("thirdTermStart", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
        <DateRangePicker
          label="Third Term End Date"
          value={formik.values.thirdTermEnd}
          onChange={val => formik.setFieldValue("thirdTermEnd", val)}
          className="bg-bg-input-soft! text-text-default h-9!"
        />
      </div>

      {isLoadingBranches && <Skeleton className="h-40 w-full" />}
      {isError && (
        <ErrorComponent
          title="Could not get Branch"
          description="This is our problem, we are looking into it so as to serve you better"
          buttonText="Go to the Home page"
        />
      )}

      {!isLoadingBranches && existingBranches.length > 0 && (
        <div className="flex flex-col gap-6">
          {existingBranches.map(branch => (
            <div key={branch.id} className="bg-bg-state-soft rounded-md p-1">
              <div className="flex items-center justify-between px-5 py-2">
                <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">{branch.name}</Badge>
              </div>
              <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                  <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" disabled value={String(branch.name)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    <Map fill="var(--color-icon-default-muted)" /> Branch Address
                  </Label>
                  <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" disabled value={String(branch.address)} />
                </div>
                <div className="border-border-darker rounded-md border p-3">
                  <div className="text-text-default mb-3 text-sm font-medium">Select Levels</div>
                  <div className="flex flex-wrap gap-3">
                    {LEVELS.map(level => {
                      const selected = (formik.values.branchLevels[branch.id] ?? []).includes(level.value);
                      return (
                        <div
                          key={level.value}
                          onClick={() => toggleExistingBranchLevel(branch.id, level.value)}
                          className="bg-bg-card text-text-default border-border-darker flex h-8 cursor-pointer items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                        >
                          <Checkbox checked={selected} onCheckedChange={() => toggleExistingBranchLevel(branch.id, level.value)} />
                          {level.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {newBranches.length > 0 && (
        <div className="flex flex-col gap-6">
          {newBranches.map(branch => (
            <div key={branch.id} className="bg-bg-state-soft rounded-md p-1">
              <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                  <Input
                    className="bg-bg-input-soft! text-text-muted rounded-md border-none"
                    placeholder="e.g Lawanson Branch"
                    value={branch.branchName}
                    onChange={e => updateNewBranch(branch.id, "branchName", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">
                    <Map fill="var(--color-icon-default-muted)" /> Branch Address
                  </Label>
                  <Input
                    className="bg-bg-input-soft! text-text-muted rounded-md border-none"
                    placeholder="e.g 11 example street"
                    value={branch.address}
                    onChange={e => updateNewBranch(branch.id, "address", e.target.value)}
                  />
                </div>
                <div className="border-border-darker rounded-md border p-3">
                  <div className="text-text-default mb-3 text-sm font-medium">Select Levels</div>
                  <div className="flex flex-wrap gap-3">
                    {LEVELS.map(level => {
                      const selected = branch.levels.includes(level.value);
                      return (
                        <div
                          key={level.value}
                          onClick={() => toggleNewBranchLevel(branch.id, level.value)}
                          className="bg-bg-card text-text-default border-border-darker flex h-8 cursor-pointer items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                        >
                          <Checkbox checked={selected} onCheckedChange={() => toggleNewBranchLevel(branch.id, level.value)} />
                          {level.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 py-2">
                <Button
                  type="button"
                  className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-muted w-fit"
                  onClick={() => handleCancelNewBranch(branch.id)}
                  disabled={branch.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default w-fit"
                  onClick={() => handleAddBranch(branch.id)}
                  disabled={branch.isSubmitting}
                >
                  {branch.isSubmitting ? "Adding..." : "Add Branch"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit text-sm"
        onClick={() => setNewBranches(prev => [...prev, emptyNewBranch()])}
      >
        <AddFill fill="var(--color-icon-default-muted)" /> Add Branch
      </Button>
    </div>
  );
});

SchoolStructure.displayName = "SchoolStructure";
