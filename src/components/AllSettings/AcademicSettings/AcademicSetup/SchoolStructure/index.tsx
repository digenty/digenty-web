"use client";

import { AddFill, Map } from "@digenty/icons";
import { BranchWithClassLevels, NewBranchForm, SchoolStructurePayload, Term, Terms } from "@/api/types";
import { DateRangePicker } from "@/components/DatePicker";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

import { toast } from "@/components/Toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useAddSchoolStructure, useGetActiveSession, useUpdateAcademic } from "@/hooks/queryHooks/useAcademic";
import { useAddBranch, useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getAcademicYears } from "@/lib/utils";
import { schoolStructureSchema } from "@/schema/academic";
import { LEVELS } from "@/store/classes";
import { terms } from "@/types";
import { format, parseISO } from "date-fns";
import { useFormik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export type SchoolStructureHandle = {
  submit: () => Promise<boolean>;
};

type TermDates = {
  firstTermStart?: Date | undefined;
  firstTermEnd?: Date | undefined;
  secondTermStart?: Date | undefined;
  secondTermEnd?: Date | undefined;
  thirdTermStart?: Date | undefined;
  thirdTermEnd?: Date | undefined;
};

type FormValues = {
  name: string;
  currentTerm: string;
  termDates: TermDates;
  branchLevels: Record<number, string[]>;
};

const emptyNewBranch = (): NewBranchForm => ({
  id: crypto.randomUUID(),
  branchName: "",
  address: "",
  levels: [],
  isSubmitting: false,
});

const defaultTermDates: TermDates = {};

const mapApiToFormik = (data: Terms): FormValues => {
  const termsMap: Record<string, Term> = {};
  data.terms.forEach((t: Term) => {
    termsMap[t.term] = t;
  });

  return {
    name: data.academicSessionName,
    currentTerm: data.terms.find((t: Term) => t.isActiveTerm)?.term || "",
    termDates: {
      firstTermStart: termsMap.FIRST?.startDate ? parseISO(termsMap.FIRST.startDate) : undefined,
      firstTermEnd: termsMap.FIRST?.endDate ? parseISO(termsMap.FIRST.endDate) : undefined,
      secondTermStart: termsMap.SECOND?.startDate ? parseISO(termsMap.SECOND.startDate) : undefined,
      secondTermEnd: termsMap.SECOND?.endDate ? parseISO(termsMap.SECOND.endDate) : undefined,
      thirdTermStart: termsMap.THIRD?.startDate ? parseISO(termsMap.THIRD.startDate) : undefined,
      thirdTermEnd: termsMap.THIRD?.endDate ? parseISO(termsMap.THIRD.endDate) : undefined,
    },
    branchLevels: {},
  };
};

export const SchoolStructure = ({ setCompletedSteps, completedSteps }: { setCompletedSteps: (step: string[]) => void; completedSteps: string[] }) => {
  const router = useRouter();
  const pathname = usePathname();
  const schoolID = useLoggedInUser()?.schoolId;

  useBreadcrumb([
    {
      label: "Academic Settings",
      url: "/settings/academic",
    },
    {
      label: "School Structure",
      url: pathname,
    },
  ]);

  const { data: academicData } = useGetTerms(schoolID);
  const { mutateAsync: updateAcademic, isPending: isUpdating } = useUpdateAcademic();
  const { data: branchesData, isFetching: isLoadingBranches, refetch: refetchBranches, isError } = useGetBranches();
  const existingBranches: BranchWithClassLevels[] = branchesData?.data ?? [];

  const [newBranches, setNewBranches] = useState<NewBranchForm[]>([]);
  const { mutateAsync: submitSchoolStructure, isPending: isSubmitting } = useAddSchoolStructure();
  const { mutateAsync: createBranch } = useAddBranch();
  const { data: session } = useGetActiveSession();
  const activeSession = session?.data;

  const isEditMode = !!academicData?.data;

  const formik = useFormik<FormValues>({
    initialValues: {
      name: getAcademicYears(new Date().getFullYear() - 1)[0],
      currentTerm: "",
      termDates: defaultTermDates,
      branchLevels: {},
    },
    validationSchema: schoolStructureSchema,
    onSubmit: async values => {
      const { termDates } = values;

      const branchesAndLevelsDtos = existingBranches
        .filter(branch => (values.branchLevels[branch.branch.id] ?? []).length > 0)
        .map(branch => ({
          branchId: branch.branch.id,
          levels: values.branchLevels[branch.branch.id],
        }));

      if (!isEditMode && branchesAndLevelsDtos.length === 0) {
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
        firstTermStartDate: termDates.firstTermStart ? format(termDates.firstTermStart, "yyyy-MM-dd") : "",
        firstTermEndDate: termDates.firstTermEnd ? format(termDates.firstTermEnd, "yyyy-MM-dd") : "",
        secondTermStartDate: termDates.secondTermStart ? format(termDates.secondTermStart, "yyyy-MM-dd") : "",
        secondTermEndDate: termDates.secondTermEnd ? format(termDates.secondTermEnd, "yyyy-MM-dd") : "",
        thirdTermStartDate: termDates.thirdTermStart ? format(termDates.thirdTermStart, "yyyy-MM-dd") : "",
        thirdTermEndDate: termDates.thirdTermEnd ? format(termDates.thirdTermEnd, "yyyy-MM-dd") : "",
        branchesAndLevelsDtos,
      };

      if (isEditMode && schoolID && activeSession) {
        await updateAcademic(
          {
            payload: {
              name: values.name,
              currentTerm: values.currentTerm,
              firstTermStartDate: termDates.firstTermStart ? format(termDates.firstTermStart, "yyyy-MM-dd") : "",
              firstTermEndDate: termDates.firstTermEnd ? format(termDates.firstTermEnd, "yyyy-MM-dd") : "",
              secondTermStartDate: termDates.secondTermStart ? format(termDates.secondTermStart, "yyyy-MM-dd") : "",
              secondTermEndDate: termDates.secondTermEnd ? format(termDates.secondTermEnd, "yyyy-MM-dd") : "",
              thirdTermStartDate: termDates.thirdTermStart ? format(termDates.thirdTermStart, "yyyy-MM-dd") : "",
              thirdTermEndDate: termDates.thirdTermEnd ? format(termDates.thirdTermEnd, "yyyy-MM-dd") : "",
            },
            sessionId: activeSession.id,
          },
          {
            onSuccess: () => {
              toast({ title: "Academic session updated", type: "success" });
              router.push(`${pathname}?step=class-and-arms`);
            },
            onError: error => {
              toast({
                title: "Failed to update academic session",
                description: error?.message || "Something went wrong. Please try again.",
                type: "error",
              });
            },
          },
        );
      } else {
        await submitSchoolStructure(payload, {
          onSuccess: () => {
            toast({ title: "School structure saved", type: "success" });

            setCompletedSteps([...completedSteps, "school-structure"]);
            router.push(`${pathname}?step=class-and-arms`);
          },
          onError: error => {
            toast({
              title: "Failed to save school structure",
              description: error?.message || "Something went wrong. Please try again.",
              type: "error",
            });
          },
        });
      }
    },
  });

  const setTermDate = useCallback(
    (field: keyof TermDates, value: Date | undefined) => {
      formik.setFieldValue("termDates", {
        ...formik.values.termDates,
        [field]: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formik.values.termDates],
  );

  useEffect(() => {
    if (academicData?.data) {
      const mapped = mapApiToFormik(academicData.data);
      formik.setValues(prev => ({
        ...prev,
        name: mapped.name,
        currentTerm: mapped.currentTerm,
        termDates: mapped.termDates,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicData]);

  useEffect(() => {
    if (existingBranches.length === 0) return;

    const hasUserSelection = Object.keys(formik.values.branchLevels).length > 0;

    if (hasUserSelection) return;

    const branchLevels: Record<number, string[]> = {};

    existingBranches.forEach(branch => {
      branchLevels[branch.branch.id] = branch.classLevels.map(l => l.levelType);
    });

    formik.setFieldValue("branchLevels", branchLevels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingBranches]);

  const toggleExistingBranchLevel = (branchId: number, level: string) => {
    const current = formik.values.branchLevels[branchId] ?? [];
    const updated = current.includes(level) ? current.filter(l => l !== level) : [...current, level];
    formik.setFieldValue("branchLevels", {
      ...formik.values.branchLevels,
      [branchId]: updated,
    });
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

  const { termDates } = formik.values;

  return (
    <section>
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
                {getAcademicYears(new Date().getFullYear() - 2).map(session => (
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

          <DateRangePicker label="First Term Start Date" date={termDates.firstTermStart} setDate={value => setTermDate("firstTermStart", value)} />
          <DateRangePicker label="First Term End Date" date={termDates.firstTermEnd} setDate={value => setTermDate("firstTermEnd", value)} />
          <DateRangePicker label="Second Term Start Date" date={termDates.secondTermStart} setDate={value => setTermDate("secondTermStart", value)} />
          <DateRangePicker label="Second Term End Date" date={termDates.secondTermEnd} setDate={value => setTermDate("secondTermEnd", value)} />
          <DateRangePicker label="Third Term Start Date" date={termDates.thirdTermStart} setDate={value => setTermDate("thirdTermStart", value)} />
          <DateRangePicker label="Third Term End Date" date={termDates.thirdTermEnd} setDate={value => setTermDate("thirdTermEnd", value)} />
        </div>

        {isLoadingBranches && <Skeleton className="bg-bg-state-soft! h-100 w-full" />}
        {isError && (
          <div className="flex items-center justify-center py-6">
            <ErrorComponent
              title="Could not get Branch"
              description="This is our problem, we are looking into it so as to serve you better"
              // buttonText="Go to the Home page"
            />
          </div>
        )}

        {!isLoadingBranches && existingBranches.length > 0 && (
          <div className="flex flex-col gap-6">
            {existingBranches.map(branch => (
              <div key={branch.branch.id} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center justify-between px-5 py-2">
                  <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">{branch.branch.name}</Badge>
                </div>
                <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                    <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" disabled value={String(branch.branch.name)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">
                      <Map fill="var(--color-icon-default-muted)" /> Branch Address
                    </Label>
                    <Input className="bg-bg-input-soft! text-text-muted rounded-md border-none" disabled value={String(branch.branch.address)} />
                  </div>
                  <div className="border-border-darker rounded-md border p-3">
                    <div className="text-text-default mb-3 text-sm font-medium">Select Levels</div>
                    <div className="flex flex-wrap gap-3">
                      {LEVELS.map(level => {
                        const checked = (formik.values.branchLevels[branch.branch.id] ?? []).includes(level.value);
                        return (
                          <div
                            key={level.value}
                            onClick={() => toggleExistingBranchLevel(branch.branch.id, level.value)}
                            className="bg-bg-card text-text-default border-border-darker flex h-8 cursor-pointer items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                          >
                            <Checkbox checked={checked} onCheckedChange={() => toggleExistingBranchLevel(branch.branch.id, level.value)} />
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
                    className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-muted h-7! w-fit"
                    onClick={() => handleCancelNewBranch(branch.id)}
                    disabled={branch.isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! w-fit"
                    onClick={() => handleAddBranch(branch.id)}
                    disabled={branch.isSubmitting}
                  >
                    {branch.isSubmitting && <Spinner className="text-text-white-default size-3" />}
                    Add
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
          <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Branch
        </Button>
      </div>

      <div className="border-border-default bg-bg-default absolute bottom-0 flex w-full justify-between border-t px-4 py-3 lg:px-36">
        <Button className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle h-7!" disabled>
          Previous
        </Button>

        <Button
          type="button"
          onClick={() => formik.handleSubmit()}
          disabled={isSubmitting || isUpdating}
          className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
        >
          {isSubmitting && <Spinner className="text-text-white-default h-4 w-4" />}
          Next
        </Button>
      </div>
    </section>
  );
};

SchoolStructure.displayName = "SchoolStructure";
