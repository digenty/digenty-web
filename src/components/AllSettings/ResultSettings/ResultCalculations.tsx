import { SchoolGrading } from "@/api/types";
import Edit from "@/components/Icons/Edit";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetActiveSession } from "@/hooks/queryHooks/useAcademic";
import { useGetClassesByLevel, useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useAddResultCalculation, useGetResultCalculation, useUpdateResultCalculation } from "@/hooks/queryHooks/useResult";
import { useGetSubjectsByLevel } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { defaultFormState, LevelFormProps, LevelFormState, PromotionType } from "./types";
import { extractUniqueSubjectsByName, Subject } from "./utils";
import { useGetGradingsByLevel } from "@/hooks/queryHooks/useLevel";
import { useRouter } from "next/navigation";
import { ErrorComponent } from "@/components/Error/ErrorComponent";

interface ResultCalculationRecord {
  id: number;
  classId: number;
  academicSessionId: number;
  calculationMethod: "THIRD_TERM_ONLY" | "CUMULATIVE";
  promotionType: "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE";
  minimumOverallPercentage: number;
  minimumPassGrade: string;
  requiredSubjectIds: number[];
}

interface DepartmentDetails {
  departmentId: number;
  departmentName: string;
  subjects: { id: number; name: string }[];
}

interface ClassInLevelDetails {
  classId: number;
  className: string;
  levelId: number;
  arms: { id: number; name: string }[];
  subjects: { id: number; name: string }[];
  departments: DepartmentDetails[];
}

function ClassesResponsiveTabs({ levels, isLoading }: { isLoading: boolean; levels: { label: string; content: React.ReactNode }[] }) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        {isLoading && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
        {!isLoading && levels.length > 0 && (
          <>
            <div className="px-4">
              <Select value={String(activeIndex)} onValueChange={value => setActiveIndex(Number(value))}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm capitalize">{levels[activeIndex].label.replaceAll("_", " ").toLowerCase()}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {levels.map((level, idx) => (
                    <SelectItem key={level.label} value={String(idx)} className="text-text-default text-sm capitalize">
                      {level.label.replaceAll("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4">{levels[activeIndex].content}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="h-9 w-full p-4 md:w-fit md:p-8">
        {isLoading && <Skeleton className="bg-bg-input-soft h-8 w-50 rounded-3xl" />}
        {!isLoading && levels.length > 0 && (
          <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5">
            {levels.map((level, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "transit flex justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize",
                    isActive
                      ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                      : "text-text-muted flex h-8 items-center gap-1",
                  )}
                >
                  <span>{level.label.replace("_", " ")}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-4 w-full">
        {isLoading && (
          <div className="px-4 md:px-8">
            <Skeleton className="bg-bg-input-soft h-80 w-full rounded-md" />
          </div>
        )}
        {!isLoading && levels.length > 0 && (
          <div className="flex w-full">
            <div className="flex-1">{levels[activeIndex].content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const LevelForm = ({
  levelType,
  levelId,
  formState,
  onChange,
  onSave,
  onCancel,
  onEdit,
  isPending,
  existingRecord,
  isEditing,
}: LevelFormProps & {
  existingRecord?: ResultCalculationRecord;
  isEditing: boolean;
  onEdit: () => void;
}) => {
  const router = useRouter();
  const [hasOpenedForm, setHasOpenedForm] = useState(!!existingRecord);
  const [openDeptId, setOpenDeptId] = useState<number | null>(null);

  const isSeniorSecondary = levelType === "SENIOR_SECONDARY";

  const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjectsByLevel(levelType);
  const { data: gradingsData, isLoading: isLoadingGradings } = useGetGradingsByLevel(levelId);
  const { data: classesByLevelData, isLoading: isLoadingClasses } = useGetClassesByLevel(isSeniorSecondary ? levelId : undefined);

  const subjects = useMemo(() => extractUniqueSubjectsByName(subjectsData?.data ?? []), [subjectsData]);
  const gradings = gradingsData?.data ?? [];

  const allDepartments = useMemo<DepartmentDetails[]>(() => {
    if (!isSeniorSecondary) return [];
    const content: ClassInLevelDetails[] = classesByLevelData?.data?.content ?? [];
    const deptMap = new Map<number, DepartmentDetails>();
    content.forEach(cls => {
      cls.departments?.forEach(dept => {
        if (!deptMap.has(dept.departmentId)) {
          deptMap.set(dept.departmentId, {
            departmentId: dept.departmentId,
            departmentName: dept.departmentName,
            subjects: dept.subjects ?? [],
          });
        }
      });
    });
    return Array.from(deptMap.values());
  }, [classesByLevelData, isSeniorSecondary]);

  const setPromotionType = (type: PromotionType) => {
    onChange({
      promotionType: type,

      ...(type === "PROMOTE_ALL" || type === "MANUAL" ? { requiredSubjectIds: isSeniorSecondary ? {} : [] } : {}),
    });
  };

  const toggleSubjectInDept = (departmentId: number, subjectId: number) => {
    const map = formState.requiredSubjectIds as Record<number, number[]>;
    const current = map[departmentId] ?? [];
    const exists = current.includes(subjectId);
    onChange({
      requiredSubjectIds: {
        ...map,
        [departmentId]: exists ? current.filter(id => id !== subjectId) : [...current, subjectId],
      },
    });
  };

  const toggleSubjectFlat = (subjectId: number) => {
    const arr = formState.requiredSubjectIds as number[];
    const exists = arr.includes(subjectId);
    onChange({
      requiredSubjectIds: exists ? arr.filter(id => id !== subjectId) : [...arr, subjectId],
    });
  };

  const flatIds = isSeniorSecondary ? [] : (formState.requiredSubjectIds as number[]);
  const allSelected = subjects.length > 0 && subjects.every(s => flatIds.includes(s.id));

  const toggleAllSubjects = () => {
    onChange({ requiredSubjectIds: allSelected ? [] : subjects.map(s => s.id) });
  };

  if (!existingRecord && !hasOpenedForm) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <ErrorComponent
          title="Not Found"
          description="No result configurations set up for this level yet."
          onClick={() => {
            setHasOpenedForm(true);
            onEdit();
          }}
          buttonText="Set Up Result Calculation"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto flex w-full max-w-171 items-center justify-center px-4 pb-20">
        <div className="flex w-full flex-col gap-6">
          <div className="flex justify-between">
            <div className="text-text-default text-xl font-semibold">Result Calculation</div>
            {existingRecord && !isEditing && (
              <Button onClick={onEdit} className="text-text-default border-border-darker h-8! rounded-md border">
                <Edit fill="var(--color-icon-default-muted)" /> Edit
              </Button>
            )}
          </div>

          <div>
            <div className="text-text-default text-md font-semibold">Result Calculation Method</div>
            <div className="text-text-muted text-sm">Choose how the final results are calculated.</div>
          </div>
          <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
            <div className="flex items-start gap-2">
              <RoundedCheckbox
                checked={formState.calculationMethod === "THIRD_TERM_ONLY"}
                onChange={() => isEditing && onChange({ calculationMethod: "THIRD_TERM_ONLY" })}
                disabled={!isEditing}
              />
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm">Third Term Only</div>
                <div className="text-text-subtle text-sm">Use only the 3rd term scores for final results.</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RoundedCheckbox
                checked={formState.calculationMethod === "CUMULATIVE"}
                onChange={() => isEditing && onChange({ calculationMethod: "CUMULATIVE" })}
                disabled={!isEditing}
              />
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
          <div className="bg-bg-card border-border-darker flex flex-col gap-6 rounded-md border p-6">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <RoundedCheckbox
                    checked={formState.promotionType === "PROMOTE_ALL"}
                    onChange={() => isEditing && setPromotionType("PROMOTE_ALL")}
                    disabled={!isEditing}
                  />
                  <div className="text-text-default text-sm font-medium">Promote All</div>
                </div>
                <div className="text-text-subtle pl-6 text-sm">Automatically promote every student.</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <RoundedCheckbox
                    checked={formState.promotionType === "MANUAL"}
                    onChange={() => isEditing && setPromotionType("MANUAL")}
                    disabled={!isEditing}
                  />
                  <div className="text-text-default text-sm font-medium">Manual Promotion</div>
                </div>
                <div className="text-text-subtle pl-6 text-sm">Decide each student&apos;s promotion manually.</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <RoundedCheckbox
                    checked={formState.promotionType === "BY_PERFORMANCE"}
                    onChange={() => isEditing && setPromotionType("BY_PERFORMANCE")}
                    disabled={!isEditing}
                  />
                  <div className="text-text-default text-sm font-medium">By Performance</div>
                </div>
                <div className="text-text-subtle pl-6 text-sm">Promote students who meet a minimum score (either cumulative or final term)</div>
                <div className="space-y-2 pl-6">
                  <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
                  <div className="bg-bg-input-soft! text-text-muted flex w-32 items-center justify-between rounded-md">
                    <Input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      onKeyDown={e => (e.key === "-" || e.key === "e") && e.preventDefault()}
                      className="text-text-muted h-9! border-none text-sm"
                      placeholder="100"
                      disabled={!isEditing}
                      value={formState.minimumOverallPercentage}
                      onChange={e => onChange({ minimumOverallPercentage: e.target.value })}
                    />
                    <div className="text-text-muted">%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center gap-2">
                  <RoundedCheckbox
                    checked={formState.promotionType === "SUBJECT_COMBINATION"}
                    onChange={() => isEditing && setPromotionType("SUBJECT_COMBINATION")}
                    disabled={!isEditing}
                  />
                  <div className="text-text-default text-sm font-medium">Subject Combination</div>
                </div>
                <div className="text-text-subtle pl-6 text-sm">Set specific subject requirements and performance criteria</div>

                <div className="mt-4 flex flex-col gap-2 pl-6">
                  <Label className="text-text-default text-sm font-medium">A. Required passes (Compulsory)</Label>
                  <div className="text-text-subtle text-sm">Multi-select subjects that student must pass</div>

                  {isSeniorSecondary ? (
                    isLoadingClasses ? (
                      <div className="flex flex-col gap-3">
                        <Skeleton className="bg-bg-input-soft h-9 w-full rounded-md" />
                        <Skeleton className="bg-bg-input-soft h-9 w-full rounded-md" />
                        <Skeleton className="bg-bg-input-soft h-9 w-full rounded-md" />
                      </div>
                    ) : allDepartments.length === 0 ? (
                      <p className="text-text-subtle text-sm">No departments found for this level.</p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {allDepartments.map(dept => {
                          const deptSubjects = dept.subjects;
                          const map = formState.requiredSubjectIds as Record<number, number[]>;
                          const currentDeptIds = map[dept.departmentId] ?? [];
                          const allDeptSelected = deptSubjects.length > 0 && deptSubjects.every(s => currentDeptIds.includes(s.id));

                          const toggleAllDept = () => {
                            onChange({
                              requiredSubjectIds: {
                                ...map,
                                [dept.departmentId]: allDeptSelected ? [] : deptSubjects.map(s => s.id),
                              },
                            });
                          };

                          return (
                            <div key={dept.departmentId} className="flex flex-col gap-1">
                              <div className="text-text-default text-sm font-medium capitalize">{dept.departmentName.toLowerCase()} Subjects</div>
                              <Select
                                open={isEditing && openDeptId === dept.departmentId}
                                onOpenChange={open => setOpenDeptId(open ? dept.departmentId : null)}
                              >
                                <SelectTrigger
                                  className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal"
                                  disabled={!isEditing}
                                >
                                  <SelectValue placeholder="Select subjects" />
                                </SelectTrigger>
                                <SelectContent className="bg-bg-default border-border-default">
                                  <div
                                    className="hover:bg-bg-input-soft flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2"
                                    onClick={toggleAllDept}
                                  >
                                    <Checkbox checked={allDeptSelected} />
                                    <span className="text-text-default text-sm font-medium">Select All</span>
                                  </div>
                                  {deptSubjects.map(sub => (
                                    <div
                                      key={sub.id}
                                      className="hover:bg-bg-input-soft text-text-default flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm capitalize"
                                      onClick={() => toggleSubjectInDept(dept.departmentId, sub.id)}
                                    >
                                      <Checkbox checked={currentDeptIds.includes(sub.id)} />
                                      {sub.name.toLowerCase()}
                                    </div>
                                  ))}
                                </SelectContent>
                              </Select>

                              {currentDeptIds.length > 0 && (
                                <div className="mt-1 flex flex-wrap items-center gap-1">
                                  {deptSubjects
                                    .filter(s => currentDeptIds.includes(s.id))
                                    .map(s => (
                                      <div key={s.id} className="bg-bg-badge-default text-text-subtle flex items-center gap-1 rounded-sm p-1 text-xs">
                                        <span className="capitalize">{s.name.toLowerCase()}</span>
                                        {isEditing && (
                                          <button
                                            onClick={() => toggleSubjectInDept(dept.departmentId, s.id)}
                                            className="text-text-muted hover:text-text-default"
                                          >
                                            ×
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              )}
                              <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : isLoadingSubjects ? (
                    <Skeleton className="bg-bg-input-soft h-9 w-full rounded-md" />
                  ) : (
                    <>
                      <Select open={isEditing ? undefined : false}>
                        <SelectTrigger
                          className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal"
                          disabled={!isEditing}
                        >
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                        <SelectContent className="bg-bg-default border-border-default">
                          <div
                            className="hover:bg-bg-input-soft flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2"
                            onClick={toggleAllSubjects}
                          >
                            <Checkbox checked={allSelected} />
                            <span className="text-text-default text-sm font-medium">Select All</span>
                          </div>
                          {subjects.map((sub: Subject) => (
                            <div
                              key={sub.id}
                              className="hover:bg-bg-input-soft text-text-default flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm capitalize"
                              onClick={() => toggleSubjectFlat(sub.id)}
                            >
                              <Checkbox checked={flatIds.includes(sub.id)} />
                              {sub.name.toLowerCase()}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>

                      {flatIds.length > 0 && (
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          {subjects
                            .filter((s: Subject) => flatIds.includes(s.id))
                            .map((s: Subject) => (
                              <div key={s.id} className="bg-bg-badge-default text-text-subtle flex items-center gap-1 rounded-sm p-1 text-xs">
                                <span className="capitalize">{s.name.toLowerCase()}</span>
                                {isEditing && (
                                  <button onClick={() => toggleSubjectFlat(s.id)} className="text-text-muted hover:text-text-default">
                                    ×
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
                    </>
                  )}
                </div>

                <div className="mt-4 pl-6">
                  {isLoadingGradings ? (
                    <Skeleton className="bg-bg-input-soft h-9 w-57 rounded-md" />
                  ) : (
                    <div className="flex flex-col gap-1">
                      <Label className="text-text-default text-sm font-medium">Grade required to pass a subject</Label>
                      <Select value={formState.minimumPassGrade} disabled={!isEditing} onValueChange={val => onChange({ minimumPassGrade: val })}>
                        <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal md:w-57">
                          <SelectValue placeholder="Select grade">
                            <span className="text-text-default text-sm">{formState.minimumPassGrade}</span>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-bg-default border-border-default">
                          {gradings.length === 0 && (
                            <div className="text-text-default flex flex-col items-center justify-center gap-2 px-4 py-2 text-sm">
                              No grades set for this level
                              <Button
                                onClick={() => router.push("/staff/settings/academic")}
                                className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
                              >
                                Set Grades
                              </Button>
                            </div>
                          )}
                          {gradings.map((grading: SchoolGrading) =>
                            grading.grade ? (
                              <SelectItem key={grading.id} value={grading.grade} className="text-text-default text-sm">
                                {grading.grade}
                              </SelectItem>
                            ) : null,
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2 pl-6">
                  <div className="text-text-default text-sm font-medium">B. Overall Performance</div>
                  <div className="text-text-subtle text-sm">Set minimum overall percentage</div>
                  <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
                  <div className="bg-bg-input-soft! text-text-muted flex w-32 items-center justify-between rounded-md">
                    <Input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min="0"
                      onKeyDown={e => (e.key === "-" || e.key === "e") && e.preventDefault()}
                      className="text-text-muted h-9! border-none text-xs"
                      placeholder="100"
                      disabled={!isEditing}
                      value={formState.subjectCombinationMinPercentage}
                      onChange={e => onChange({ subjectCombinationMinPercentage: e.target.value })}
                    />
                    <div className="text-text-muted">%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
          <Button onClick={onCancel} disabled={isPending} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isPending}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
          >
            {isPending && <Spinner className="text-text-white-default size-4" />}
            {existingRecord ? "Save changes" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
};

export const ResultCalculations = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const { data: academicData } = useGetActiveSession();
  const { data: resultCalculationsData } = useGetResultCalculation();
  const { mutate: addResult, isPending: isAdding } = useAddResultCalculation();
  const { mutate: updateResult, isPending: isUpdating } = useUpdateResultCalculation();

  const levels = extractUniqueLevelsByType(classLevel?.data || []);
  const academicSessionId = academicData?.data?.id;

  const existingRecordsMap = useMemo(() => {
    const records: Record<number, ResultCalculationRecord> = {};
    (resultCalculationsData?.data ?? []).forEach((r: ResultCalculationRecord) => {
      records[r.classId] = r;
    });
    return records;
  }, [resultCalculationsData]);

  const [formStates, setFormStates] = useState<Record<string, LevelFormState>>({});
  const [editingLevels, setEditingLevels] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!resultCalculationsData?.data) return;
    setFormStates(prev => {
      const next = { ...prev };
      (resultCalculationsData.data as ResultCalculationRecord[]).forEach(record => {
        const level = levels.find(l => l.id === record.classId);
        if (!level || next[level.levelName]) return;

        const isSeniorSecondary = level.levelType === "SENIOR_SECONDARY";

        const promotionType: PromotionType =
          record.promotionType === "BY_PERFORMANCE" && (record.requiredSubjectIds?.length ?? 0) > 0 ? "SUBJECT_COMBINATION" : record.promotionType;

        next[level.levelName] = {
          calculationMethod: record.calculationMethod,
          promotionType,
          minimumOverallPercentage: String(record.minimumOverallPercentage ?? ""),
          minimumPassGrade: record.minimumPassGrade ?? "",
          requiredSubjectIds: isSeniorSecondary ? {} : (record.requiredSubjectIds ?? []),
          subjectCombinationMinPercentage: "",
        };
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultCalculationsData]);

  const getFormState = (levelName: string): LevelFormState => formStates[levelName] ?? defaultFormState();

  const updateFormState = (levelName: string, updates: Partial<LevelFormState>) =>
    setFormStates(prev => ({ ...prev, [levelName]: { ...getFormState(levelName), ...updates } }));

  const setEditing = (levelName: string, value: boolean) => setEditingLevels(prev => ({ ...prev, [levelName]: value }));

  const handleSave = (levelName: string, levelId: number) => {
    const state = getFormState(levelName);
    const existingRecord = existingRecordsMap[levelId];
    const isSeniorSecondary = levels.find(l => l.id === levelId)?.levelType === "SENIOR_SECONDARY";

    if (!state.calculationMethod) {
      toast({ title: "Error", description: "Please select a calculation method.", type: "error" });
      return;
    }
    if (!state.promotionType) {
      toast({ title: "Error", description: "Please select a promotion type.", type: "error" });
      return;
    }

    const apiPromotionType = state.promotionType === "SUBJECT_COMBINATION" ? "BY_PERFORMANCE" : state.promotionType;

    const flatSubjectIds: number[] = isSeniorSecondary
      ? Object.values(state.requiredSubjectIds as Record<number, number[]>).flat()
      : (state.requiredSubjectIds as number[]);

    const sharedPayload = {
      calculationMethod: state.calculationMethod,
      promotionType: apiPromotionType as "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE",
      minimumOverallPercentage: Number(state.minimumOverallPercentage) || 0,
      minimumPassGrade: state.minimumPassGrade,
      requiredSubjectIds: flatSubjectIds,
    };

    const onSuccess = () => {
      toast({
        title: "Success",
        description: `Result ${existingRecord ? "updated" : "saved"} for ${levelName}`,
        type: "success",
      });
      setEditing(levelName, false);
    };

    const onError = (error: Error) => {
      toast({
        title: `Failed to ${existingRecord ? "update" : "save"}`,
        description: error?.message || `Could not save result settings for ${levelName}`,
        type: "error",
      });
    };

    if (existingRecord) {
      updateResult({ payload: sharedPayload, resultSettingId: existingRecord.id }, { onSuccess, onError });
    } else {
      addResult({ ...sharedPayload, levelId, academicSessionId }, { onSuccess, onError });
    }
  };

  const handleCancel = (levelName: string, levelId: number) => {
    const existingRecord = existingRecordsMap[levelId];
    setEditing(levelName, false);
    if (!existingRecord) {
      setFormStates(prev => {
        const next = { ...prev };
        delete next[levelName];
        return next;
      });
    }
  };

  const isPending = isAdding || isUpdating;

  return (
    <div>
      <ClassesResponsiveTabs
        isLoading={isLoadingLevels}
        levels={levels.map(({ levelName, levelType, id }) => {
          const existingRecord = existingRecordsMap[id];
          const isEditing = editingLevels[levelName] ?? false;
          return {
            label: levelName.charAt(0) + levelName.slice(1).toLowerCase(),
            content: (
              <LevelForm
                key={existingRecord ? `existing-${id}` : `new-${id}`}
                levelType={levelType}
                levelId={id}
                academicSessionId={academicSessionId}
                formState={getFormState(levelName)}
                onChange={updates => updateFormState(levelName, updates)}
                onSave={() => handleSave(levelName, id)}
                onCancel={() => handleCancel(levelName, id)}
                onEdit={() => setEditing(levelName, true)}
                isEditing={isEditing}
                isPending={isPending}
                existingRecord={existingRecord}
              />
            ),
          };
        })}
      />
    </div>
  );
};