"use client";

import { AddFill, Map } from "@digenty/icons";
import { AcademicSession, Level, NewBranchForm, Term } from "@/api/types";
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
import { useUpdateAcademic } from "@/hooks/queryHooks/useAcademic";
import { useAddBranch } from "@/hooks/queryHooks/useBranch";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useAddLevel, useDeleteLevel } from "@/hooks/queryHooks/useLevel";
import { useGetTerms } from "@/hooks/queryHooks/useTerm";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { getAcademicYears } from "@/lib/utils";
import { LEVELS } from "@/store/classes";
import { format, parseISO } from "date-fns";
import { Edit2 } from "lucide-react";
import { useEffect, useState } from "react";

type ClassLevel = Level["classLevels"][number];
type LevelType = ClassLevel["levelType"];

const emptyNewBranch = (): NewBranchForm => ({
  id: crypto.randomUUID(),
  branchName: "",
  address: "",
  levels: [],
  isSubmitting: false,
});

const ViewField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <Label className="text-text-default text-sm font-medium">{label}</Label>
    <div className="text-text-default bg-bg-input-soft rounded-md p-2 text-sm font-medium">{value || "—"}</div>
  </div>
);

interface BranchLevelSelectorProps {
  level: Level;
  branchLevels: Record<number, string[]>;
  isBusy: boolean;
  onToggle: (branchId: number, levelValue: string) => void;
  onSaveLevels: (level: Level, toAdd: string[], toRemove: string[]) => Promise<void>;
}
interface BranchLevelViewProps {
  level: Level;
}

const BranchLevelSelector = ({ level, branchLevels, isBusy, onToggle, onSaveLevels }: BranchLevelSelectorProps) => {
  const originalTypes = level.classLevels.map(l => l.levelType as string);
  const selectedTypes = branchLevels[level.branchId] ?? [];
  const toAdd = selectedTypes.filter(t => !originalTypes.includes(t));
  const toRemove = originalTypes.filter(t => !selectedTypes.includes(t));
  const hasChanges = toAdd.length > 0 || toRemove.length > 0;

  return (
    <div className="border-border-darker rounded-md border p-3">
      <div className="text-text-default mb-3 text-sm font-medium">Select Levels</div>
      <div className="flex flex-wrap gap-3">
        {LEVELS.map(lvlOption => {
          const checked = selectedTypes.includes(lvlOption.value);
          return (
            <div
              key={lvlOption.value}
              onClick={() => onToggle(level.branchId, lvlOption.value)}
              className="bg-bg-card text-text-default border-border-darker flex h-8 cursor-pointer items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
            >
              <Checkbox checked={checked} onCheckedChange={() => onToggle(level.branchId, lvlOption.value)} />
              <span className="capitalize">{lvlOption.label.toLowerCase()}</span>
            </div>
          );
        })}
      </div>

      {hasChanges && (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            disabled={isBusy}
            onClick={() => onSaveLevels(level, toAdd, toRemove)}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! w-fit"
          >
            {isBusy && <Spinner className="text-text-white-default size-3" />}
            Save Levels
          </Button>
        </div>
      )}
    </div>
  );
};

const BranchLevelView = ({ level }: BranchLevelViewProps) => (
  <div className="border-border-darker rounded-md border p-3">
    <div className="text-text-default mb-3 text-sm font-medium">Levels</div>
    <div className="flex flex-wrap gap-3">
      {level.classLevels.map(lvl => (
        <div
          key={lvl.id}
          className="bg-bg-card text-text-default border-border-darker flex h-8 items-center rounded-md border p-2.5 text-sm shadow-xs md:h-9"
        >
          <span className="capitalize">{lvl.levelName.replaceAll("_", " ").toLowerCase()}</span>
        </div>
      ))}
    </div>
  </div>
);

export const SchoolSectionAndTerm = ({ session, isLoadingSession }: { session: AcademicSession | undefined; isLoadingSession: boolean }) => {
  const user = useLoggedInUser();
  const schoolId = user?.schoolId;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newBranches, setNewBranches] = useState<NewBranchForm[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [firstTermStart, setFirstTermStart] = useState<Date | undefined>();
  const [firstTermEnd, setFirstTermEnd] = useState<Date | undefined>();
  const [secondTermStart, setSecondTermStart] = useState<Date | undefined>();
  const [secondTermEnd, setSecondTermEnd] = useState<Date | undefined>();
  const [thirdTermStart, setThirdTermStart] = useState<Date | undefined>();
  const [thirdTermEnd, setThirdTermEnd] = useState<Date | undefined>();
  const [branchLevels, setBranchLevels] = useState<Record<number, string[]>>({});

  const { data: termList } = useGetTerms(schoolId);
  const { data: levelsData, isLoading: isLoadingLevels, isError: isLevelError, refetch: refetchBranches } = useGetClassLevel();
  const { mutateAsync: updateAcademic } = useUpdateAcademic();
  const { mutateAsync: createBranch } = useAddBranch();
  const { mutateAsync: addLevel, isPending: isAddingLevel } = useAddLevel();
  const { mutateAsync: removeLevel, isPending: isRemovingLevel } = useDeleteLevel();

  const terms: Term[] = termList?.data?.terms ?? [];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const levels: Level[] = levelsData?.data ?? [];
  const isBusy = isSaving || isAddingLevel || isRemovingLevel;

  const findTerm = (name: string) => terms.find(t => t.term === name);

  useEffect(() => {
    if (!termList) return;
    const activeTerm = termList.data.terms.find((t: Term) => t.isActiveTerm);
    setCurrentTerm(activeTerm?.term ?? "");
    setSessionName(termList.data.academicSessionName ?? "");
  }, [termList]);

  useEffect(() => {
    if (!terms.length) return;
    const first = findTerm("FIRST");
    const second = findTerm("SECOND");
    const third = findTerm("THIRD");
    if (first) {
      setFirstTermStart(first.startDate ? parseISO(first.startDate) : undefined);
      setFirstTermEnd(first.endDate ? parseISO(first.endDate) : undefined);
    }
    if (second) {
      setSecondTermStart(second.startDate ? parseISO(second.startDate) : undefined);
      setSecondTermEnd(second.endDate ? parseISO(second.endDate) : undefined);
    }
    if (third) {
      setThirdTermStart(third.startDate ? parseISO(third.startDate) : undefined);
      setThirdTermEnd(third.endDate ? parseISO(third.endDate) : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  useEffect(() => {
    if (!levels.length) return;
    const map: Record<number, string[]> = {};
    levels.forEach((level: Level) => {
      map[level.branchId] = level.classLevels.map(l => l.levelType);
    });
    setBranchLevels(map);
  }, [levels]);

  const resetBranchLevels = () => {
    const map: Record<number, string[]> = {};
    levels.forEach((level: Level) => {
      map[level.branchId] = level.classLevels.map(l => l.levelType);
    });
    setBranchLevels(map);
  };

  const handleTermChange = (selected: string) => {
    setCurrentTerm(selected);
    const matched = findTerm(selected);
    if (!matched) return;
    const start = matched.startDate ? parseISO(matched.startDate) : undefined;
    const end = matched.endDate ? parseISO(matched.endDate) : undefined;
    if (selected === "FIRST") {
      setFirstTermStart(start);
      setFirstTermEnd(end);
    } else if (selected === "SECOND") {
      setSecondTermStart(start);
      setSecondTermEnd(end);
    } else if (selected === "THIRD") {
      setThirdTermStart(start);
      setThirdTermEnd(end);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (session) {
      setSessionName(session.name ?? "");
      setCurrentTerm(session.currentTerm ?? "");
    }
    const first = findTerm("FIRST");
    const second = findTerm("SECOND");
    const third = findTerm("THIRD");
    if (first) {
      setFirstTermStart(first.startDate ? parseISO(first.startDate) : undefined);
      setFirstTermEnd(first.endDate ? parseISO(first.endDate) : undefined);
    }
    if (second) {
      setSecondTermStart(second.startDate ? parseISO(second.startDate) : undefined);
      setSecondTermEnd(second.endDate ? parseISO(second.endDate) : undefined);
    }
    if (third) {
      setThirdTermStart(third.startDate ? parseISO(third.startDate) : undefined);
      setThirdTermEnd(third.endDate ? parseISO(third.endDate) : undefined);
    }
    resetBranchLevels();
    setNewBranches([]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!session?.id) return;
    setIsSaving(true);
    try {
      await updateAcademic({
        payload: {
          name: sessionName,
          currentTerm,
          firstTermStartDate: firstTermStart ? format(firstTermStart, "yyyy-MM-dd") : "",
          firstTermEndDate: firstTermEnd ? format(firstTermEnd, "yyyy-MM-dd") : "",
          secondTermStartDate: secondTermStart ? format(secondTermStart, "yyyy-MM-dd") : "",
          secondTermEndDate: secondTermEnd ? format(secondTermEnd, "yyyy-MM-dd") : "",
          thirdTermStartDate: thirdTermStart ? format(thirdTermStart, "yyyy-MM-dd") : "",
          thirdTermEndDate: thirdTermEnd ? format(thirdTermEnd, "yyyy-MM-dd") : "",
        },
        sessionId: session.id,
      });
      toast({ title: "Session updated", description: "Academic session updated successfully.", type: "success" });
      setIsEditing(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Failed to update", description: message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExistingBranchLevel = (branchId: number, levelValue: string) => {
    setBranchLevels(prev => {
      const current = prev[branchId] ?? [];
      const updated = current.includes(levelValue) ? current.filter(l => l !== levelValue) : [...current, levelValue];
      return { ...prev, [branchId]: updated };
    });
  };

  const handleSaveLevels = async (level: Level, toAdd: string[], toRemove: string[]) => {
    try {
      await Promise.all([
        ...toAdd.map(levelType =>
          addLevel({
            name: levelType,
            levelType: levelType as LevelType,
            branchId: level.branchId,
          }),
        ),
        ...toRemove.map(levelType => {
          const existing = level.classLevels.find(l => l.levelType === levelType);
          if (!existing) return Promise.resolve();
          return removeLevel(existing.id);
        }),
      ]);
      await refetchBranches();
      toast({ title: "Levels updated", description: `Levels updated for ${level.branchName}.`, type: "success" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast({ title: "Failed to update levels", description: message, type: "error" });
    }
  };

  const updateNewBranch = (id: string, field: keyof NewBranchForm, value: string | string[] | boolean) => {
    setNewBranches(prev => prev.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const toggleNewBranchLevel = (id: string, levelValue: string) => {
    setNewBranches(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const updated = b.levels.includes(levelValue) ? b.levels.filter(l => l !== levelValue) : [...b.levels, levelValue];
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

  const handleCancelNewBranch = (id: string) => setNewBranches(prev => prev.filter(b => b.id !== id));

  return (
    <div>
      <div className="mx-auto mb-10 flex w-full flex-col gap-4 px-4 pb-12 md:w-150">
        <div className="flex items-center justify-between">
          <div className="text-text-default text-lg font-semibold">Academic Session & Term</div>
          {!isEditing && (
            <Button
              type="button"
              onClick={handleEdit}
              className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-subtle border-border-darker flex h-7 items-center gap-1.5 border text-sm"
            >
              <Edit2 className="h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>

        {isLoadingSession ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-9 w-full" />
            ))}
          </div>
        ) : (
          <div className="border-border-default grid w-full grid-cols-1 items-start gap-6 border-b pb-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">Academic Session</Label>
              {isEditing ? (
                <Select value={sessionName} onValueChange={setSessionName}>
                  <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                    <SelectValue>
                      <span className="text-text-default text-sm font-medium">{sessionName || "Select session"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {getAcademicYears(new Date().getFullYear() - 2).map(year => (
                      <SelectItem key={year} value={year} className="text-text-default text-sm font-medium">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium">
                  {sessionName || "—"}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-text-default text-sm font-medium">
                Current Term {isEditing && <span className="text-text-destructive">*</span>}
              </Label>
              {isEditing ? (
                <Select value={currentTerm} onValueChange={handleTermChange}>
                  <SelectTrigger className="bg-bg-input-soft! h-9! w-full border-none">
                    <SelectValue>
                      <span className="text-text-default text-sm font-medium capitalize">{currentTerm.toLowerCase() || "Select term"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-card border-border-default">
                    {terms.map((t: Term) => (
                      <SelectItem key={t.termId} value={t.term} className="text-text-default text-sm font-semibold capitalize">
                        {t.term.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-bg-input-soft text-text-default flex h-9 items-center rounded-md px-3 text-sm font-medium capitalize">
                  {currentTerm.toLowerCase() || "—"}
                </div>
              )}
            </div>

            {isEditing ? (
              <>
                <DateRangePicker
                  label="First Term Start Date"
                  date={firstTermStart}
                  setDate={setFirstTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="First Term End Date"
                  date={firstTermEnd}
                  setDate={setFirstTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term Start Date"
                  date={secondTermStart}
                  setDate={setSecondTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Second Term End Date"
                  date={secondTermEnd}
                  setDate={setSecondTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term Start Date"
                  date={thirdTermStart}
                  setDate={setThirdTermStart}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
                <DateRangePicker
                  label="Third Term End Date"
                  date={thirdTermEnd}
                  setDate={setThirdTermEnd}
                  className="bg-bg-input-soft! text-text-default h-9!"
                />
              </>
            ) : (
              <>
                <ViewField label="First Term Start Date" value={firstTermStart ? format(firstTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="First Term End Date" value={firstTermEnd ? format(firstTermEnd, "yyyy/MM/dd") : ""} />
                <ViewField label="Second Term Start Date" value={secondTermStart ? format(secondTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="Second Term End Date" value={secondTermEnd ? format(secondTermEnd, "yyyy/MM/dd") : ""} />
                <ViewField label="Third Term Start Date" value={thirdTermStart ? format(thirdTermStart, "yyyy/MM/dd") : ""} />
                <ViewField label="Third Term End Date" value={thirdTermEnd ? format(thirdTermEnd, "yyyy/MM/dd") : ""} />
              </>
            )}
          </div>
        )}

        <div className="text-text-default text-lg font-semibold">Branches & Levels</div>

        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-50 w-full" />}

        {isLevelError && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent
              title="Could not get Branch"
              description="This is our problem, we are looking into it so as to serve you better"
              buttonText="Go to the Home page"
              url="/staff/"
            />
          </div>
        )}

        {!isLoadingLevels && !isLevelError && levels.length === 0 && (
          <div className="flex h-80 items-center justify-center">
            <ErrorComponent title="No Branch" description="No Branch has been added yet" buttonText="Add a branch" url="/staff/settings/general" />
          </div>
        )}

        {!isLoadingLevels && !isLevelError && levels.length > 0 && (
          <div className="flex flex-col gap-6">
            {levels.map((level: Level, index: number) => (
              <div key={level.branchId} className="bg-bg-state-soft rounded-md p-1">
                <div className="flex items-center px-5 py-2">
                  <Badge className="bg-bg-badge-default! text-text-subtle rounded-md">Branch {index + 1}</Badge>
                </div>
                <div className="bg-bg-card flex flex-col gap-4 rounded-md px-5 py-6">
                  <div className="flex flex-col gap-2">
                    <Label className="text-text-default text-sm font-medium">Branch Name</Label>
                    <div className="bg-bg-input-soft text-text-muted rounded-md p-2 text-sm">{level.branchName}</div>
                  </div>
                  {isEditing ? (
                    <BranchLevelSelector
                      level={level}
                      branchLevels={branchLevels}
                      isBusy={isBusy}
                      onToggle={toggleExistingBranchLevel}
                      onSaveLevels={handleSaveLevels}
                    />
                  ) : (
                    <BranchLevelView level={level} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditing && newBranches.length > 0 && (
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
                      {LEVELS.map(lvlOption => {
                        const selected = branch.levels.includes(lvlOption.value);
                        return (
                          <div
                            key={lvlOption.value}
                            onClick={() => toggleNewBranchLevel(branch.id, lvlOption.value)}
                            className="bg-bg-card text-text-default border-border-darker flex h-8 cursor-pointer items-center gap-3 rounded-md border p-2.5 text-sm shadow-xs md:h-9"
                          >
                            <Checkbox checked={selected} onCheckedChange={() => toggleNewBranchLevel(branch.id, lvlOption.value)} />
                            <span>{lvlOption.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2 py-2">
                  <Button
                    type="button"
                    onClick={() => handleCancelNewBranch(branch.id)}
                    disabled={branch.isSubmitting}
                    className="bg-bg-state-soft! hover:bg-bg-state-soft-hover! text-text-muted h-7! w-fit"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAddBranch(branch.id)}
                    disabled={branch.isSubmitting}
                    className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! w-fit"
                  >
                    {branch.isSubmitting && <Spinner className="text-text-white-default size-3" />}
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isEditing && (
          <Button
            type="button"
            onClick={() => setNewBranches(prev => [...prev, emptyNewBranch()])}
            className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit text-sm"
          >
            <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Branch
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
          <Button onClick={handleCancel} disabled={isBusy} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isBusy}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
          >
            {isSaving && <Spinner className="text-text-white-default size-4" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
