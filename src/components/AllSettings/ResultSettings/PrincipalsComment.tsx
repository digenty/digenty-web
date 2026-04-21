import { ClassLevel, PrincipalsComment } from "@/api/types";
import { AddFill } from "@/components/Icons/AddFill";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import Edit from "@/components/Icons/Edit";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { useAddPrinciapleComment, useDeletePrincipalComment, useGetPrincipalCommentByLevel } from "@/hooks/queryHooks/useResult";
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

interface CommentSetupProps {
  rows: CommentRow[];
  onChange: (rows: CommentRow[]) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isLoading: boolean;
}

export const CommentSetup = ({ rows, onChange, isEditing, setIsEditing, isLoading }: CommentSetupProps) => {
  const { mutate: deleteComment, isPending: isDeleting } = useDeletePrincipalComment();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addRow = () => onChange([...rows, defaultRow()]);
  const removeRow = (id: string) => {
    if (!isNaN(Number(id))) {
      setDeletingId(id);
      deleteComment(Number(id), {
        onSuccess: () => {
          toast({ title: "Comment deleted successfully", type: "success" });
          setDeletingId(null);
        },
        onError: () => {
          toast({ title: "Failed to delete comment", type: "error" });
          setDeletingId(null);
        },
      });
    } else {
      onChange(rows.filter(r => r.id !== id));
    }
  };
  const updateRow = (id: string, field: keyof Omit<CommentRow, "id">, value: string) =>
    onChange(rows.map(r => (r.id === id ? { ...r, [field]: value } : r)));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-text-default text-xl font-semibold">Principal&apos;s Comment</h2>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default flex h-7! items-center justify-center rounded-md border px-1! py-2"
            >
              <Edit fill="var(--color-icon-default-muted)" className="bg-bg-" /> Edit
            </Button>
          )}
        </div>

        <div className="text-text-default text-md font-semibold">Principal&apos;s Comment Automation</div>
        <div className="text-text-muted text-sm">Auto-generate principal comments based on student average scores.</div>
      </div>
      <div className="bg-bg-card border-border-default rounded-md border p-4 md:px-5 md:py-6">
        <div className="flex flex-col gap-4">
          {isLoading && <Skeleton className="h-40 w-full" />}
          {!isLoading && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <span className="text-text-muted text-sm">No principal comments for this level</span>
            </div>
          )}
          {!isLoading &&
            rows.map(row => (
              <div key={row.id} className="items-bottom mb-2 flex flex-col gap-2 md:flex-row md:justify-between">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-muted text-sm font-medium">Percentage</Label>
                  <div className="flex items-center gap-2">
                    <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                      {isEditing ? (
                        <Input
                          className="text-text-muted placeholder:text-text-muted/40 h-9! border-none text-sm font-normal md:w-24"
                          placeholder="1"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min={0}
                          max={100}
                          onKeyDown={e => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault();
                            }
                          }}
                          value={row.minPercentage}
                          onChange={e => updateRow(String(row.id), "minPercentage", e.target.value)}
                        />
                      ) : (
                        <Input
                          className="text-text-muted placeholder:text-text-muted/40 h-9! border-none text-sm font-normal focus-visible:border-none! focus-visible:ring-0! md:w-24"
                          readOnly
                          placeholder="1"
                          type="number"
                          value={row.minPercentage}
                        />
                      )}
                      <span className="text-text-muted">%</span>
                    </div>

                    <span className="text-text-muted">-</span>

                    <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                      {isEditing ? (
                        <Input
                          className="text-text-muted placeholder:text-text-muted/40 h-9! border-none text-sm font-normal md:w-24"
                          placeholder="51"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max="100"
                          onKeyDown={e => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault();
                            }
                          }}
                          value={row.maxPercentage}
                          onChange={e => {
                            if (Number(e.target.value) <= 100) {
                              updateRow(String(row.id), "maxPercentage", e.target.value);
                            } else {
                              updateRow(String(row.id), "maxPercentage", "100");
                            }
                          }}
                        />
                      ) : (
                        <Input
                          className="text-text-muted placeholder:text-text-muted/40 h-9! border-none text-sm font-normal focus-visible:border-none! focus-visible:ring-0! md:w-24"
                          readOnly
                          placeholder="51"
                          type="number"
                          value={row.maxPercentage}
                        />
                      )}
                      <span className="text-text-muted">%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <Label className="text-text-muted text-sm font-medium">Comment</Label>
                  <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                    {isEditing ? (
                      <Input
                        className="text-text-muted placeholder:text-text-muted/40 h-7! w-full border-none bg-none! px-2 py-0 text-sm font-normal"
                        placeholder="Good"
                        type="text"
                        value={row.comment}
                        onChange={e => updateRow(String(row.id), "comment", e.target.value)}
                      />
                    ) : (
                      <Input
                        className="text-text-muted placeholder:text-text-muted/40 h-7! w-full border-none bg-none! px-2 py-0 text-sm font-normal focus-visible:border-none! focus-visible:ring-0!"
                        placeholder="Good"
                        readOnly
                        type="text"
                        value={row.comment}
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-0 md:gap-2">
                  <span className="invisible">-</span>
                  <Button
                    onClick={() => removeRow(String(row.id))}
                    disabled={deletingId === String(row.id)}
                    className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
                  >
                    {deletingId === String(row.id) ? <Spinner className="size-4" /> : <DeleteBin2 fill="var(--color-icon-default-subtle)" />}
                  </Button>
                </div>
              </div>
            ))}
        </div>

        {isEditing && (
          <Button className="text-text-subtle hover:bg-bg-none! rounde-md w-fit bg-none! text-xs" onClick={addRow}>
            <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Row
          </Button>
        )}
      </div>
    </div>
  );
};

export const PrincipalComment = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();

  useEffect(() => {
    if (classLevel) {
      setActiveLevel(levels[0]);
    }
  }, [classLevel]);

  const isMobile = useIsMobile();

  const [levelRowsState, setLevelRowsState] = useState<LevelRowsState>({});
  const [isEditing, setIsEditing] = useState(false);
  const { data: principalComments, isFetching: isLoadingComments } = useGetPrincipalCommentByLevel(activeLevel?.id);
  const { mutate, isPending } = useAddPrinciapleComment();

  const getRows = (levelName: string): CommentRow[] => levelRowsState[levelName] ?? [];
  const updateRows = (levelName: string, rows: CommentRow[]) => setLevelRowsState(prev => ({ ...prev, [levelName]: rows }));

  useEffect(() => {
    if (!isLoadingComments && principalComments?.data && activeLevel?.levelName) {
      const rows = principalComments.data.rows || [];
      if (rows.length > 0) {
        const existingRows = rows.map((row: PrincipalsComment) => ({
          id: String(row.id),
          minPercentage: String(row.minPercentage),
          maxPercentage: String(row.maxPercentage),
          comment: row.comment,
        }));
        updateRows(activeLevel.levelName, existingRows);
        setIsEditing(false);
      } else {
        updateRows(activeLevel.levelName, [defaultRow()]);
        setIsEditing(true);
      }
    }
  }, [principalComments, activeLevel, isLoadingComments]);

  const handleSave = async () => {
    const rows = getRows(activeLevel?.levelName || "");
    const payload = {
      levelId: activeLevel?.id,
      rows: rows.map(row => ({
        minPercentage: Number(row.minPercentage),
        maxPercentage: Number(row.maxPercentage),
        comment: row.comment,
      })),
    };

    await mutate(payload, {
      onSuccess: () => {
        toast({ title: "Success", description: `Comment for ${activeLevel?.levelName} saved successfully`, type: "success" });
        setIsEditing(false);
      },
      onError: () => {
        toast({ title: "Error", description: `Failed to save comment for ${activeLevel?.levelName}`, type: "error" });
      },
    });
  };

  const handleCancel = () => {
    if (principalComments?.data?.rows && principalComments.data.rows.length > 0 && activeLevel?.levelName) {
      const existingRows = principalComments.data.rows.map((row: PrincipalsComment) => ({
        id: String(row.id),
        minPercentage: String(row.minPercentage),
        maxPercentage: String(row.maxPercentage),
        comment: row.comment,
      }));
      updateRows(activeLevel.levelName, existingRows);
      setIsEditing(false);
    } else if (activeLevel?.levelName) {
      updateRows(activeLevel.levelName, [defaultRow()]);
      setIsEditing(true);
    }
  };

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        <div className="mb-20">
          {isLoadingLevels && !principalComments && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
          {!isLoadingLevels && levels.length > 0 && (
            <div className="px-4">
              <Select
                value={String(activeLevel?.id)}
                onValueChange={value => {
                  const level = levels.find(level => level.id === Number(value));
                  setActiveLevel(level);
                }}
              >
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                  <SelectValue>
                    <span className="text-text-default text-sm capitalize">{activeLevel?.levelName.replaceAll("_", " ").toLowerCase()}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-bg-default border-border-default">
                  {levels.map((level, idx) => (
                    <SelectItem key={level.levelName} value={String(level.id)} className="text-text-default text-sm capitalize">
                      {level.levelName.replaceAll("_", " ").toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4">
                <CommentSetup
                  rows={getRows(activeLevel?.levelName || "")}
                  onChange={rows => updateRows(activeLevel?.levelName || "", rows)}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  isLoading={isLoadingComments}
                />
              </div>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="border-border-default bg-bg-default fixed right-0 bottom-0 mx-auto flex w-full place-content-center items-center border-t md:left-30 md:max-w-200">
            <div className="flex w-full items-center justify-between px-4 py-4">
              <Button onClick={() => setIsEditing(false)} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
              >
                {isPending && <Spinner className="text-text-white-default" />}
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 md:px-8 md:py-12">
        <div className="h-9 w-full px-4 md:px-8">
          {isLoadingLevels && !principalComments && <Skeleton className="bg-bg-input-soft h-10 w-80 rounded-4xl" />}
          {!isLoadingLevels && levels.length > 0 && (
            <div className="bg-bg-state-soft flex w-full items-center justify-between gap-2.5 rounded-full p-0.5 md:w-fit">
              {levels.map((level, index) => {
                const isActive = level.id === activeLevel?.id;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveLevel(level)}
                    className={cn(
                      "transit flex justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize",
                      isActive
                        ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center justify-center gap-1 rounded-full border shadow-sm"
                        : "text-text-muted flex h-8 items-center gap-1",
                    )}
                  >
                    <span>{level.levelName.replaceAll("_", " ").toLowerCase()}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="mx-auto mt-6 flex w-full items-center justify-center md:max-w-150">
          {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-50 w-full rounded-md" />}
          {!isLoadingLevels && levels.length > 0 && (
            <div className="flex-1">
              <CommentSetup
                rows={getRows(activeLevel?.levelName || "")}
                onChange={rows => updateRows(activeLevel?.levelName || "", rows)}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                isLoading={isLoadingComments}
              />
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 mx-auto flex w-full justify-between border-t px-4 py-3 md:px-36">
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
