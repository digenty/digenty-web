"use client";

import { Edit } from "@digenty/icons";
import { ClassLevel } from "@/api/types";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { RoundedCheckbox } from "@/components/RoundedCheckbox";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useGetAttendanceSettingsByLevel, useUpdateAttendanceSettings } from "@/hooks/queryHooks/useAttendanceSettings";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LevelForm {
  sessionsPerDay: 1 | 2;
  effectiveFrom: string;
}

const defaultForm = (): LevelForm => ({ sessionsPerDay: 1, effectiveFrom: "" });

export const AttendanceSettings = () => {
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Attendance", url: "/staff/settings/attendance" },
  ]);

  const isMobile = useIsMobile();
  const { data: classLevel, isFetching: isLoadingLevels, isError: isLevelsError, refetch: refetchLevels } = useGetClassLevel();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();
  const [form, setForm] = useState<LevelForm>(defaultForm());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (levels.length > 0 && !activeLevel) {
      setActiveLevel(levels[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classLevel]);

  const { data: settingsData, isFetching: isLoadingSettings } = useGetAttendanceSettingsByLevel(activeLevel?.id);
  const { mutate: updateSettings, isPending } = useUpdateAttendanceSettings();

  const settings = settingsData?.data;

  useEffect(() => {
    if (isLoadingSettings || !activeLevel) return;

    if (settings?.configured) {
      setForm({ sessionsPerDay: settings.sessionsPerDay, effectiveFrom: settings.effectiveFrom ?? "" });
    } else {
      setForm(defaultForm());
    }
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsData, activeLevel, isLoadingSettings]);

  const handleSave = () => {
    if (!activeLevel) return;

    updateSettings(
      {
        levelId: activeLevel.id,
        payload: {
          sessionsPerDay: form.sessionsPerDay,
          ...(form.effectiveFrom ? { effectiveFrom: form.effectiveFrom } : {}),
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: `Attendance settings for ${activeLevel.levelName} saved`, type: "success" });
          setIsEditing(false);
        },
        onError: (error: Error) => {
          toast({
            title: "Failed to save",
            description: error?.message || `Could not save attendance settings for ${activeLevel.levelName}`,
            type: "error",
          });
        },
      },
    );
  };

  const handleCancel = () => {
    if (settings?.configured) {
      setForm({ sessionsPerDay: settings.sessionsPerDay, effectiveFrom: settings.effectiveFrom ?? "" });
    } else {
      setForm(defaultForm());
    }
    setIsEditing(false);
  };

  const levelTabs =
    !isLoadingLevels && levels.length > 0 ? (
      isMobile ? (
        <Select value={String(activeLevel?.id)} onValueChange={value => setActiveLevel(levels.find(l => l.id === Number(value)))}>
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue>
              <span className="text-text-default text-sm capitalize">{activeLevel?.levelName.replaceAll("_", " ").toLowerCase()}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {levels.map(level => (
              <SelectItem key={level.levelName} value={String(level.id)} className="text-text-default text-sm capitalize">
                {level.levelName.replaceAll("_", " ").toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="bg-bg-state-soft flex w-fit items-center gap-2.5 rounded-full p-0.5">
          {levels.map(level => {
            const isActive = level.id === activeLevel?.id;
            return (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level)}
                className={cn(
                  "flex justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize transition-all",
                  isActive
                    ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center gap-1 rounded-full border shadow-sm"
                    : "text-text-muted flex h-8 items-center gap-1",
                )}
              >
                {level.levelName.replaceAll("_", " ").toLowerCase()}
              </button>
            );
          })}
        </div>
      )
    ) : (
      <Skeleton className="bg-bg-input-soft h-9 w-64 rounded-3xl" />
    );

  return (
    <div className="relative pb-20">
      <div className="mx-auto flex w-full max-w-171 flex-col gap-6 px-4 py-8 md:px-8">
        <div className="flex justify-between">
          <div className="text-text-default text-xl font-semibold">Attendance Settings</div>
          {!isLoadingLevels && !isLevelsError && levels.length > 0 && activeLevel && !isLoadingSettings && !isEditing && (
            <Button onClick={() => setIsEditing(true)} className="text-text-default border-border-darker h-8! rounded-md border">
              <Edit fill="var(--color-icon-default-muted)" /> Edit
            </Button>
          )}
        </div>

        {!isLoadingLevels && isLevelsError ? (
          <div className="flex justify-center py-12">
            <ErrorComponent
              title="Couldn't load levels"
              description="Something went wrong while fetching class levels. Please try again."
              buttonText="Retry"
              onClick={() => refetchLevels()}
            />
          </div>
        ) : !isLoadingLevels && levels.length === 0 ? (
          <div className="border-border-default flex flex-col items-center gap-2 rounded-xl border border-dashed py-12">
            <p className="text-text-default text-sm font-medium">No levels found</p>
            <p className="text-text-muted text-xs">Set up class levels before configuring attendance registers.</p>
          </div>
        ) : (
          <>
            {levelTabs}

            {isLoadingSettings ? (
              <Skeleton className="bg-bg-input-soft h-60 w-full rounded-md" />
            ) : (
              <div className="bg-bg-card border-border-darker flex flex-col gap-4 rounded-md border p-6">
                <div>
                  <div className="text-text-default text-md font-semibold">Registers per day</div>
                  <div className="text-text-muted text-sm">
                    Choose whether this level takes one register a day or a separate morning and afternoon register.
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-2">
                    <RoundedCheckbox
                      checked={form.sessionsPerDay === 1}
                      onChange={() => isEditing && setForm(prev => ({ ...prev, sessionsPerDay: 1 }))}
                      disabled={!isEditing}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="text-text-default text-sm">One register a day</div>
                      <div className="text-text-subtle text-sm">A single attendance record covers the whole school day.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <RoundedCheckbox
                      checked={form.sessionsPerDay === 2}
                      onChange={() => isEditing && setForm(prev => ({ ...prev, sessionsPerDay: 2 }))}
                      disabled={!isEditing}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="text-text-default text-sm">Morning and afternoon registers</div>
                      <div className="text-text-subtle text-sm">Teachers take a separate register in the morning and in the afternoon.</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-text-default text-sm font-medium">Effective from (optional)</Label>
                  <Input
                    type="date"
                    disabled={!isEditing}
                    value={form.effectiveFrom}
                    onChange={e => setForm(prev => ({ ...prev, effectiveFrom: e.target.value }))}
                    className="bg-bg-input-soft! text-text-default h-9! w-full max-w-60 border-none"
                  />
                  <div className="text-text-muted text-xs">
                    Can only move forward from today, and cannot switch two registers back to one mid-term.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 flex w-full justify-between border-t px-4 py-3 md:px-8">
          <Button onClick={handleCancel} disabled={isPending} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
          >
            {isPending && <Spinner className="text-text-white-default size-4" />}
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
