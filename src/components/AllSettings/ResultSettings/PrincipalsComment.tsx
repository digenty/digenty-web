import { AddFill, DeleteBin2, Edit } from "@digenty/icons";
import { ClassLevel, PrincipalsComment } from "@/api/types";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import {
  useAddPrinciapleComment,
  useDeletePrincipalComment,
  useGetPrincipalCommentByLevel,
  useUpdatePrincipalComment,
} from "@/hooks/queryHooks/useResult";
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
  hasExistingData: boolean;
}
interface PercentInputProps {
  value: string;
  placeholder: string;
  readOnly: boolean;
  onChange: (v: string) => void;
}

const CommentSetup = ({ rows, onChange, isEditing, setIsEditing, isLoading, hasExistingData }: CommentSetupProps) => {
  const { mutate: deleteComment, isPending: isDeleting } = useDeletePrincipalComment();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addRow = () => onChange([...rows, defaultRow()]);

  const removeRow = (id: string) => {
    if (!isNaN(Number(id))) {
      setDeletingId(id);
      deleteComment(Number(id), {
        onSuccess: () => {
          toast({ title: "Comment deleted successfully", type: "success" });
          onChange(rows.filter(r => String(r.id) !== id));
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
              <Edit fill="var(--color-icon-default-muted)" /> Edit
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
              <div key={row.id} className="mb-2 flex flex-row items-baseline gap-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-text-muted text-sm font-medium">Percentage</Label>
                  <div className="flex items-center gap-2">
                    <PercentInput
                      value={row.minPercentage}
                      placeholder="1"
                      readOnly={!isEditing}
                      onChange={v => updateRow(String(row.id), "minPercentage", v)}
                    />
                    <span className="text-text-muted">-</span>
                    <PercentInput
                      value={row.maxPercentage}
                      placeholder="100"
                      readOnly={!isEditing}
                      onChange={v => {
                        const capped = Number(v) > 100 ? "100" : v;
                        updateRow(String(row.id), "maxPercentage", capped);
                      }}
                    />
                  </div>
                </div>

                <div className="flex w-full items-baseline gap-2">
                  <div className="flex flex-1 flex-col gap-2">
                    <Label className="text-text-muted text-sm font-medium">Comment</Label>
                    <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                      <Input
                        className="text-text-muted placeholder:text-text-muted/40 h-9! w-full border-none bg-none! px-2 py-0 text-sm font-normal focus-visible:border-none! focus-visible:ring-0!"
                        placeholder="Good"
                        type="text"
                        readOnly={!isEditing}
                        value={row.comment}
                        onChange={e => updateRow(String(row.id), "comment", e.target.value)}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex flex-col gap-2">
                      <span className="invisible">-</span>
                      <Button
                        onClick={() => removeRow(String(row.id))}
                        disabled={deletingId === String(row.id)}
                        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! w-fit rounded-md text-sm"
                      >
                        {deletingId === String(row.id) ? <Spinner className="size-4" /> : <DeleteBin2 fill="var(--color-icon-default-subtle)" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {isEditing && !hasExistingData && (
          <Button className="text-text-subtle hover:bg-bg-none! mt-2 w-fit rounded-md bg-none! text-xs" onClick={addRow}>
            <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Row
          </Button>
        )}
      </div>
    </div>
  );
};

const PercentInput = ({ value, placeholder, readOnly, onChange }: PercentInputProps) => (
  <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
    <Input
      className="text-text-muted placeholder:text-text-muted/40 h-9! w-24 border-none text-sm font-normal focus-visible:border-none! focus-visible:ring-0!"
      placeholder={placeholder}
      inputMode="numeric"
      pattern="[0-9]*"
      readOnly={readOnly}
      value={value}
      onKeyDown={e => (e.key === "-" || e.key === "e") && e.preventDefault()}
      onChange={e => onChange(e.target.value)}
    />
    <span className="text-text-muted">%</span>
  </div>
);

const validateRows = (rows: CommentRow[]): string | null => {
  for (let i = 0; i < rows.length; i++) {
    const { minPercentage, maxPercentage, comment } = rows[i];
    if (minPercentage === "" || maxPercentage === "" || comment.trim() === "") {
      return `Row ${i + 1} has empty fields. Please fill in all fields before saving.`;
    }
  }
  return null;
};

export const PrincipalComment = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();
  const [levelRowsState, setLevelRowsState] = useState<LevelRowsState>({});
  const [isEditing, setIsEditing] = useState(false);

  const isMobile = useIsMobile();

  const { data: principalComments, isFetching: isLoadingComments } = useGetPrincipalCommentByLevel(activeLevel?.id);
  const { mutate: addComment, isPending: isAdding } = useAddPrinciapleComment();
  const { mutate: updateComment, isPending: isUpdating } = useUpdatePrincipalComment();

  const isPending = isAdding || isUpdating;
  const existingRows: PrincipalsComment[] = principalComments?.data?.rows ?? [];
  const hasExistingData = existingRows.length > 0;

  useEffect(
    () => {
      if (classLevel && levels.length > 0 && !activeLevel) {
        setActiveLevel(levels[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classLevel],
  );

  useEffect(
    () => {
      if (isLoadingComments || !activeLevel?.levelName) return;

      if (hasExistingData) {
        const mapped = existingRows.map((row: PrincipalsComment) => ({
          id: String(row.id),
          minPercentage: String(row.minPercentage),
          maxPercentage: String(row.maxPercentage),
          comment: row.comment,
        }));
        setLevelRowsState(prev => ({ ...prev, [activeLevel.levelName]: mapped }));
        setIsEditing(false);
      } else {
        setLevelRowsState(prev => ({ ...prev, [activeLevel.levelName]: [defaultRow()] }));
        setIsEditing(true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [principalComments, activeLevel, isLoadingComments],
  );

  const getRows = () => levelRowsState[activeLevel?.levelName ?? ""] ?? [];
  const setRows = (rows: CommentRow[]) => setLevelRowsState(prev => ({ ...prev, [activeLevel?.levelName ?? ""]: rows }));

  const handleSave = () => {
    const rows = getRows();
    const validationError = validateRows(rows);
    if (validationError) {
      toast({ title: "Validation Error", description: validationError, type: "error" });
      return;
    }

    if (hasExistingData) {
      updateComment(
        {
          levelId: activeLevel!.id,
          rows: rows.map(row => ({
            commentId: Number(row.id),
            minPercentage: Number(row.minPercentage),
            maxPercentage: Number(row.maxPercentage),
            comment: row.comment,
          })),
        },
        {
          onSuccess: () => {
            toast({ title: "Success", description: `Comments for ${activeLevel?.levelName} updated successfully`, type: "success" });
            setIsEditing(false);
          },
          onError: () => toast({ title: "Error", description: `Failed to update comments for ${activeLevel?.levelName}`, type: "error" }),
        },
      );
    } else {
      addComment(
        {
          levelId: activeLevel?.id,
          rows: rows.map(row => ({
            minPercentage: Number(row.minPercentage),
            maxPercentage: Number(row.maxPercentage),
            comment: row.comment,
          })),
        },
        {
          onSuccess: () => {
            toast({ title: "Success", description: `Comments for ${activeLevel?.levelName} saved successfully`, type: "success" });
            setIsEditing(false);
          },
          onError: () => toast({ title: "Error", description: `Failed to save comments for ${activeLevel?.levelName}`, type: "error" }),
        },
      );
    }
  };

  const handleCancel = () => {
    if (hasExistingData && activeLevel?.levelName) {
      const mapped = existingRows.map((row: PrincipalsComment) => ({
        id: String(row.id),
        minPercentage: String(row.minPercentage),
        maxPercentage: String(row.maxPercentage),
        comment: row.comment,
      }));
      setRows(mapped);
      setIsEditing(false);
    } else if (activeLevel?.levelName) {
      setRows([defaultRow()]);
      setIsEditing(true);
    }
  };

  const commentSetupProps = {
    rows: getRows(),
    onChange: setRows,
    isEditing,
    setIsEditing,
    isLoading: isLoadingComments,
    hasExistingData,
  };

  if (isMobile) {
    return (
      <div className="mt-4 w-full">
        <div className="mb-20 px-4">
          {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-8 w-full rounded-3xl" />}
          {!isLoadingLevels && levels.length > 0 && (
            <>
              <Select value={String(activeLevel?.id)} onValueChange={value => setActiveLevel(levels.find(l => l.id === Number(value)))}>
                <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-sm font-normal">
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
              <div className="mt-4">
                <CommentSetup {...commentSetupProps} />
              </div>
            </>
          )}
        </div>

        {isEditing && (
          <div className="border-border-default bg-bg-default fixed right-0 bottom-0 w-full border-t">
            <div className="flex items-center justify-between px-4 py-4">
              <Button onClick={handleCancel} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
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
          )}
        </div>

        <div className="mx-auto mt-6 flex w-full items-center justify-center md:max-w-150">
          {isLoadingLevels ? (
            <Skeleton className="bg-bg-input-soft h-50 w-full rounded-md" />
          ) : (
            levels.length > 0 && (
              <div className="flex-1">
                <CommentSetup {...commentSetupProps} />
              </div>
            )
          )}
        </div>
      </div>

      {isEditing && (
        <div className="border-border-default bg-bg-default absolute bottom-0 flex w-full justify-between border-t px-4 py-3 md:px-36">
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
