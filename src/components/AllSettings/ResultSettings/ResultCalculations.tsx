import { AcademicSession, Levelsubject, SchoolGrading } from "@/api/types";
import Edit from "@/components/Icons/Edit";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAcademic } from "@/hooks/queryHooks/useAcademic";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useGetSchoolGradings } from "@/hooks/queryHooks/useGrading";
import { useAddResultCalculation } from "@/hooks/queryHooks/useResult";
import { useGetSubjectsByLevel } from "@/hooks/queryHooks/useSubject";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import React, { useState } from "react";
import { defaultFormState, LevelFormProps, LevelFormState } from "./types";

function ClassesResponsiveTabs({ items, isLoading }: { isLoading: boolean; items: { label: string; content: React.ReactNode }[] }) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        {isLoading && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
        {!isLoading && items.length > 0 && (
          <>
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
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="h-9 w-full p-4 md:w-fit md:p-8">
        {isLoading && <Skeleton className="bg-bg-input-soft h-8 w-50 rounded-3xl" />}
        {!isLoading && items.length > 0 && (
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
        )}
      </div>
      <div className="mt-4 w-full">
        {isLoading && <Skeleton className="bg-bg-input-soft h-80 w-full rounded-md" />}
        {!isLoading && items.length > 0 && (
          <div className="flex w-full">
            <div className="flex-1">{items[activeIndex].content}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const LevelForm = ({ levelType, formState, onChange, onSave, onCancel, isPending }: LevelFormProps) => {
  const { data: subjectsData, isLoading: isLoadingSubjects } = useGetSubjectsByLevel(levelType);
  const { data: gradingsData, isLoading: isLoadingGradings } = useGetSchoolGradings();

  const subjects = subjectsData?.data?.content ?? [];
  const gradings = gradingsData?.data ?? [];

  const toggleSubject = (subjectId: number) => {
    const exists = formState.requiredSubjectIds.includes(subjectId);
    onChange({
      requiredSubjectIds: exists ? formState.requiredSubjectIds.filter(id => id !== subjectId) : [...formState.requiredSubjectIds, subjectId],
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-171 items-center justify-center">
      <div className="flex w-full flex-col gap-6">
        <div className="flex justify-between">
          <div className="text-text-default text-xl font-semibold">Result Calculation</div>
          <Button className="text-text-default border-border-darker rounded-md border">
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        </div>

        <div>
          <div className="text-text-default text-md font-semibold">Result Calculation Method</div>
          <div className="text-text-muted text-sm">Choose how the final results are calculated.</div>
        </div>
        <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
          <div className="flex items-start gap-2">
            <RoundedCheckbox
              checked={formState.calculationMethod === "THIRD_TERM_ONLY"}
              onChange={() => onChange({ calculationMethod: "THIRD_TERM_ONLY" })}
            />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm">Third Term Only</div>
              <div className="text-text-subtle text-sm">Use only the 3rd term scores for final results.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox checked={formState.calculationMethod === "CUMULATIVE"} onChange={() => onChange({ calculationMethod: "CUMULATIVE" })} />
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
            <RoundedCheckbox checked={formState.promotionType === "PROMOTE_ALL"} onChange={() => onChange({ promotionType: "PROMOTE_ALL" })} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Promote All</div>
              <div className="text-text-subtle text-sm">Automatically promote every student.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox checked={formState.promotionType === "MANUAL"} onChange={() => onChange({ promotionType: "MANUAL" })} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Manual Promotion</div>
              <div className="text-text-subtle text-sm">Decide each student&apos;s promotion manually.</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <RoundedCheckbox checked={formState.promotionType === "BY_PERFORMANCE"} onChange={() => onChange({ promotionType: "BY_PERFORMANCE" })} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">By Performance</div>
              <div className="text-text-subtle text-sm">Promote students who meet a minimum score (either cumulative or final term)</div>
              <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
              <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                <Input
                  type="number"
                  className="text-text-muted border-none"
                  placeholder="100"
                  value={formState.minimumOverallPercentage}
                  onChange={e => onChange({ minimumOverallPercentage: e.target.value })}
                />
                <div className="text-text-muted">%</div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <RoundedCheckbox checked={false} onChange={() => {}} />
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-sm font-medium">Subject Combination</div>
              <div className="text-text-subtle text-sm">Set specific subject requirements and performance criteria</div>
              <Label className="text-text-default text-sm font-medium">A. Required passes (Compulsory)</Label>
              <div className="text-text-subtle text-sm">Multi-select subjects that student must pass</div>

              {isLoadingSubjects ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full rounded-md" />
              ) : (
                <>
                  <Select value="">
                    <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                      <SelectValue placeholder="Select subjects" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-default border-border-default">
                      {subjects.map((sub: Levelsubject) => (
                        <SelectItem key={sub.id} value={String(sub.id)} className="text-text-default text-sm" onSelect={() => toggleSubject(sub.id)}>
                          <div className="flex items-center gap-2">
                            <Checkbox checked={formState.requiredSubjectIds.includes(sub.id)} onChange={() => toggleSubject(sub.id)} />
                            {sub.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formState.requiredSubjectIds.length > 0 && (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {subjects
                        .filter((s: Levelsubject) => formState.requiredSubjectIds.includes(s.id))
                        .map((s: Levelsubject) => (
                          <div key={s.id} className="bg-bg-badge-default text-text-subtle flex items-center gap-1 rounded-sm p-1 text-xs">
                            <span>{s.name}</span>
                            <button onClick={() => toggleSubject(s.id)} className="text-text-muted hover:text-text-default">
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                  <div className="text-text-muted text-xs">Condition: Must pass all selected</div>
                </>
              )}

              {isLoadingGradings ? (
                <Skeleton className="bg-bg-input-soft h-9 w-57 rounded-md" />
              ) : (
                <Select value={formState.minimumPassGrade} onValueChange={val => onChange({ minimumPassGrade: val })}>
                  <Label className="text-text-default text-sm font-medium">Grade required to pass a subject</Label>
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal md:w-57">
                    <SelectValue placeholder="Select grade">
                      <span className="text-text-default text-sm">{formState.minimumPassGrade}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {gradings.map((g: SchoolGrading) => (
                      <SelectItem key={g.id} value={g.grade} className="text-text-default text-sm">
                        {g.grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">B. Overall Performance</div>
                <div className="text-text-subtle text-sm">Set minimum overall percentage</div>
                <Label className="text-text-default text-sm font-medium">Minimum Overall %</Label>
                <div className="bg-bg-input-soft! text-text-muted flex h-7 w-32 items-center justify-between rounded-md">
                  <Input
                    type="number"
                    className="text-text-muted border-none"
                    placeholder="100"
                    value={formState.subjectCombinationMinPercentage}
                    onChange={e => onChange({ subjectCombinationMinPercentage: e.target.value })}
                  />
                  <div className="text-text-muted">%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border-default mt-5 flex items-center justify-between border-t py-4">
          <Button className="bg-bg-state-soft! text-text-subtle rounded-md" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isPending}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default rounded-md"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ClassesSetup = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const { data: academicData } = useGetAcademic();
  const { mutate, isPending } = useAddResultCalculation();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);

  const academicSessionId = academicData?.data?.find((s: AcademicSession) => s.isActive)?.id ?? academicData?.data?.[0]?.id;


  const [formStates, setFormStates] = useState<Record<string, LevelFormState>>({});

  const getFormState = (levelName: string): LevelFormState => formStates[levelName] ?? defaultFormState();

  const updateFormState = (levelName: string, updates: Partial<LevelFormState>) =>
    setFormStates(prev => ({ ...prev, [levelName]: { ...getFormState(levelName), ...updates } }));

  const handleSave = async (levelName: string, levelId: number) => {
    const state = getFormState(levelName);

    if (!state.calculationMethod) {
      toast({ title: "Error", description: "Please select a calculation method.", type: "error" });
      return;
    }
    if (!state.promotionType) {
      toast({ title: "Error", description: "Please select a promotion type.", type: "error" });
      return;
    }

    const payload ={
      levelId,
      academicSessionId,
      calculationMethod: state.calculationMethod!,
      promotionType: state.promotionType!,
      minimumOverallPercentage: Number(state.minimumOverallPercentage) || 0,
      minimumPassGrade: state.minimumPassGrade,
      requiredSubjectIds: state.requiredSubjectIds,
    };

    try {
      await mutate(payload, {
        onSuccess: () => {
          toast({ title: "Success", description: `Result saved for ${levelName}`, type: "success" });
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : `Could not save result settings for ${levelName}`;
          toast({ title: "Failed to save", description: message, type: "error" });
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Failed to save", description: message, type: "error" });
    }
  };

  const handleCancel = (levelName: string) => {
    setFormStates(prev => {
      const next = { ...prev };
      delete next[levelName];
      return next;
    });
  };

  return (
    <div>
      <ClassesResponsiveTabs
        isLoading={isLoadingLevels}
        items={levels.map(({ levelName, levelType, id }) => ({
          label: levelName.charAt(0) + levelName.slice(1).toLowerCase(),
          content: (
            <LevelForm
              levelType={levelType}
              academicSessionId={academicSessionId}
              formState={getFormState(levelName)}
              onChange={updates => updateFormState(levelName, updates)}
              onSave={() => handleSave(levelName, id)}
              onCancel={() => handleCancel(levelName)}
              isPending={isPending}
            />
          ),
        }))}
      />
    </div>
  );
};
