import { ClassLevel } from "@/api/types";
import { AddFill } from "@/components/Icons/AddFill";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useAddPrinciapleComment } from "@/hooks/queryHooks/useResult";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CommentRow, LevelRowsState } from "./types";

const defaultRow = (): CommentRow => ({
  id: crypto.randomUUID(),
  minPercentage: "",
  maxPercentage: "",
  comment: "",
});

function LevelsTabs({ levels, isLoadingLevels, activeLevel, setActiveLevel }: { isLoadingLevels: boolean; levels: ClassLevel[]; activeLevel?: ClassLevel; setActiveLevel: (level?: ClassLevel) => void }) {
  const isMobile = useIsMobile();

  const [levelRowsState, setLevelRowsState] = useState<LevelRowsState>({});
  const { mutate, isPending } = useAddPrinciapleComment();

  const getRows = (levelName: string): CommentRow[] => levelRowsState[levelName] ?? [defaultRow()];
  const updateRows = (levelName: string, rows: CommentRow[]) => setLevelRowsState(prev => ({ ...prev, [levelName]: rows }));


  const handleSave = async () => {
    const rows = getRows(activeLevel?.levelName!);
    const payload = {
      levelId: activeLevel?.id!,
      rows: rows.map(row => ({
        minPercentage: Number(row.minPercentage),
        maxPercentage: Number(row.maxPercentage),
        comment: row.comment,
        // commentId: ,
      })),
    };

    await mutate(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: `Comment for ${activeLevel?.levelName} saved successfully`, type: "success" });
      },
      onError: () => {
        toast({ title: "Error", description: `Failed to save comment for ${activeLevel?.levelName}`, type: "error" });
      },
    });

  }

  const handleCancel = () => {
    setLevelRowsState({});
  }

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
        {!isLoadingLevels && levels.length > 0 && (
          <>
            <Select value={String(activeLevel?.id)} onValueChange={value => {
              const level = levels.find(level => level.id === Number(value));
              setActiveLevel(level);
            }}>
              <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                <SelectValue>
                  <span className="text-text-default text-sm">{activeLevel?.levelName}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-default border-border-default">
                {levels.map((level, idx) => (
                  <SelectItem key={level.levelName} value={String(level.id)} className="text-text-default text-sm">
                    {level.levelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="mt-4">
              <CommentSetup rows={getRows(activeLevel?.levelName!)} onChange={rows => updateRows(activeLevel?.levelName!, rows)} />
            </div>
          </>
        )}

        <div className="border-border-default bg-bg-default fixed right-0 bottom-0 mx-auto flex w-full place-content-center items-center border-t md:left-30 md:max-w-200">
          <div className="flex w-full items-center justify-between pt-6">
            <Button onClick={handleCancel} className="bg-bg-state-soft! text-text-subtle rounded-md" >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-9 w-full p-4 md:p-8">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-10 w-80 rounded-4xl" />}
        {!isLoadingLevels && levels.length > 0 && (
          <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5 md:w-fit">
            {levels.map((level, index) => {
              const isActive = level.id === activeLevel?.id;
              return (
                <button
                  key={index}
                  onClick={() => setActiveLevel(level)}
                  className={cn(
                    "transit flex justify-center px-4 py-2 text-sm font-medium",
                    isActive
                      ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                      : "text-text-muted flex h-8 items-center gap-1",
                  )}
                >
                  <span>{level.levelName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="mx-auto mt-6 flex w-full items-center justify-center md:max-w-150">
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-50 w-full rounded-md" />}
        {!isLoadingLevels && levels.length > 0 && <div className="flex-1">
          <CommentSetup rows={getRows(activeLevel?.levelName!)} onChange={rows => updateRows(activeLevel?.levelName!, rows)} /></div>}
      </div>

      <div className="border-border-default bg-bg-default fixed right-0 bottom-0 mx-auto flex w-full place-content-center items-center border-t md:left-30 md:max-w-200">
          <div className="flex w-full items-center justify-between pt-6">
            <Button onClick={handleCancel} className="bg-bg-state-soft! text-text-subtle rounded-md" >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
            >
              {isPending && <Spinner className="text-text-white-default" />}
              Save Changes
            </Button>
          </div>
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-md font-semibold">Principal&apos;s Comment Automation</div>
        <div className="text-text-muted text-sm">Auto-generate principal comments based on student average scores.</div>
      </div>
      <div className="bg-bg-card border-border-default rounded-md border p-4 md:px-5 md:py-6">
        <div className="flex flex-col gap-4">
          {rows.map(row => (
            <div key={row.id} className="items-bottom mb-2 flex flex-col gap-2 md:flex-row md:justify-between">
              <div className="flex flex-col gap-2">
                <Label className="text-text-muted text-sm font-medium">Percentage</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="bg-bg-input-soft! text-text-default h-9! border-none md:w-24"
                    placeholder="1"
                    type="number"
                    value={row.minPercentage}
                    onChange={e => updateRow(row.id, "minPercentage", e.target.value)}
                  />
                  <span className="text-text-muted">-</span>
                  <Input
                    className="bg-bg-input-soft! text-text-default h-9! border-none md:w-24"
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
    </div>
  );
};

export const PrincipaleComment = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();

  useEffect(() => {
    if (classLevel && levels.length > 0) {
      setActiveLevel(levels[0]);
    }
  }, [classLevel]);

  return (
    <div>
      <LevelsTabs
        isLoadingLevels={isLoadingLevels}
        levels={levels}
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
      />
    </div>
  );
};
