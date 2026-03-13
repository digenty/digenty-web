import { AddFill } from "@/components/Icons/AddFill";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { useAddPrinciapleComment } from "@/hooks/queryHooks/useResult";
import { toast } from "@/components/Toast";
import { CommentRow, LevelRowsState, LevelTab } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

const defaultRow = (): CommentRow => ({
  id: crypto.randomUUID(),
  minPercentage: "",
  maxPercentage: "",
  comment: "",
});

function LevelsTabs({ items, isLoadingLevels }: { isLoadingLevels: boolean; items: { label: string; content: React.ReactNode }[] }) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
        {!isLoadingLevels && items.length > 0 && (
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
      <div className="h-9 w-full p-4 md:p-8">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-10 w-80 rounded-4xl" />}
        {!isLoadingLevels && items.length > 0 && (
          <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5 md:w-fit">
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
      <div className="mx-auto mt-6 flex w-full items-center justify-center md:max-w-150">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-50 w-full rounded-md" />}
        {!isLoadingLevels && items.length > 0 && <div className="flex-1">{items[activeIndex].content}</div>}
      </div>
    </div>
  );
}

interface CommentSetupProps {
  rows: CommentRow[];
  onChange: (rows: CommentRow[]) => void;
}

export const CommentSetup = ({ rows, onChange }: CommentSetupProps) => {
  const addRow = () => onChange([...rows, defaultRow()]);
  const removeRow = (id: string) => onChange(rows.filter(r => r.id !== id));
  const updateRow = (id: string, field: keyof Omit<CommentRow, "id">, value: string) =>
    onChange(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));

  return (
    <div className="bg-bg-card border-border-default rounded-md border p-4 md:px-5 md:py-6">
      <div className="flex flex-col gap-4">
        {rows.map(row => (
          <div key={row.id} className="items-bottom mb-2 flex flex-col gap-2 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2">
              <Label className="text-text-muted text-sm font-medium">Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="bg-bg-input-soft! text-text-default h-9! border-none"
                  placeholder="1"
                  type="number"
                  value={row.minPercentage}
                  onChange={e => updateRow(row.id, "minPercentage", e.target.value)}
                />
                <span className="text-text-muted">-</span>
                <Input
                  className="bg-bg-input-soft! text-text-default h-9! border-none"
                  placeholder="51"
                  type="number"
                  value={row.maxPercentage}
                  onChange={e => updateRow(row.id, "maxPercentage", e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-text-muted text-sm font-medium">Comment</Label>
              <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                <Input
                  className="text-text-default h-7! w-full border-none bg-none! p-0"
                  placeholder="Good"
                  type="text"
                  value={row.comment}
                  onChange={e => updateRow(row.id, "comment", e.target.value)}
                />
                <span className="text-text-muted">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-0 md:gap-2">
              <span className="invisible">-</span>
              <Button
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
              >
                <DeleteBin2 fill="var(--color-icon-default-subtle)" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button className="text-text-subtle hover:bg-bg-none! rounde-md w-fit bg-none! text-sm" onClick={addRow}>
        <AddFill fill="var(--color-icon-default-muted)" /> Add Row
      </Button>
    </div>
  );
};

export const PrincipaleComment = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const branches = classLevel?.data ?? [];

  const [levelRowsState, setLevelRowsState] = useState<LevelRowsState>({});
  const { mutateAsync, isPending } = useAddPrinciapleComment();

  const deduplicatedLevels = React.useMemo<LevelTab[]>(() => {
    const map = new Map<string, number[]>();
    for (const branch of branches) {
      for (const level of branch.classLevels) {
        const existing = map.get(level.levelName) ?? [];
        map.set(level.levelName, [...existing, level.id]);
      }
    }
    return Array.from(map.entries()).map(([levelName, levelIds]) => ({ levelName, levelIds }));
  }, [branches]);

  const getRows = (levelName: string): CommentRow[] => levelRowsState[levelName] ?? [defaultRow()];
  const updateRows = (levelName: string, rows: CommentRow[]) => setLevelRowsState(prev => ({ ...prev, [levelName]: rows }));

  const handleSave = async () => {
    for (const { levelName } of deduplicatedLevels) {
      const rows = getRows(levelName);
      const hasIncomplete = rows.some(r => !r.minPercentage || !r.maxPercentage || !r.comment.trim());
      if (hasIncomplete) {
        toast({ title: "Error", description: `Please fill all fields for ${levelName} before saving.`, type: "error" });
        return;
      }
    }

    const payloads = deduplicatedLevels.flatMap(({ levelName, levelIds }) => {
      const rows = getRows(levelName).map(r => ({
        minPercentage: Number(r.minPercentage),
        maxPercentage: Number(r.maxPercentage),
        comment: r.comment,
      }));
      return levelIds.map(levelId => ({ levelId, rows }));
    });

    try {
      await Promise.all(payloads.map(payload => mutateAsync(payload)));
      toast({ title: "Success", description: "Principal comments saved successfully.", type: "success" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({ title: "Failed to save", description: message, type: "error" });
    }
  };

  const handleCancel = () => setLevelRowsState({});

  return (
    <div>
      <LevelsTabs
        isLoadingLevels={isLoadingLevels}
        items={deduplicatedLevels.map(({ levelName }) => ({
          label: levelName.charAt(0) + levelName.slice(1).toLowerCase(),
          content: <CommentSetup rows={getRows(levelName)} onChange={rows => updateRows(levelName, rows)} />,
        }))}
      />

      {!isLoadingLevels && deduplicatedLevels.length > 0 && (
        <div className="border-border-default bg-bg-default fixed right-0 bottom-0 mx-auto flex w-full place-content-center items-center border-t md:left-30 md:max-w-200">
          <div className="flex w-full items-center justify-between pt-6">
            <Button className="bg-bg-state-soft! text-text-subtle rounded-md" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
