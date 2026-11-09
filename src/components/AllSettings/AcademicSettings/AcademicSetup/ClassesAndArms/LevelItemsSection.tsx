import { Check, CloseFill, Edit } from "@digenty/icons";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn, toTitleCase } from "@/lib/utils";
import { useState } from "react";

export const LevelItemsSection = ({
  existingItems,
  globalOptions,
  isLoadingOptions,
  onAdd,
  onDelete,
  onRename,
  isAdding,
  deletingName,
  renamingName,
  placeholder,
  twoPerRow,
}: {
  existingItems: string[];
  globalOptions: string[];
  isLoadingOptions: boolean;
  onAdd: (names: string[]) => void;
  onDelete: (name: string) => void;
  onRename?: (oldName: string, newName: string) => void;
  isAdding: boolean;
  deletingName: string | null;
  renamingName?: string | null;
  placeholder: string;
  /** Lay existing items out two per row, each taking the full width of its column, instead of wrapping by content width. */
  twoPerRow?: boolean;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    const names = inputValue
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "" && !existingItems.includes(s));
    if (!names.length) {
      setInputValue("");
      return;
    }
    onAdd(names);
    setInputValue("");
  };

  const startEditing = (name: string) => {
    setEditingName(name);
    setEditValue(toTitleCase(name));
  };

  const saveEdit = () => {
    if (!editingName) return;
    const trimmed = editValue.trim();
    const isDuplicate = existingItems.some(item => item !== editingName && item.toLowerCase() === trimmed.toLowerCase());
    if (trimmed && trimmed.toLowerCase() !== editingName.toLowerCase() && !isDuplicate) {
      onRename?.(editingName, trimmed);
    }
    setEditingName(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-bg-input-soft flex h-9 items-center gap-2 rounded-md p-2">
        <Input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="text-text-default h-7! w-full rounded-md border-none text-sm font-normal"
        />
        {inputValue.trim() && (
          <PermissionCheck permissionUtility={canManageSettings}>
            <Button
              type="button"
              onClick={handleAdd}
              disabled={isAdding}
              className="text-text-white-default! bg-bg-state-primary! hover:bg-bg-state-primary-hover! h-6! shrink-0 rounded-md px-2 text-xs"
            >
              {isAdding ? <Spinner className="text-text-white-default size-3" /> : "Add"}
            </Button>
          </PermissionCheck>
        )}
      </div>

      {existingItems.length > 0 && (
        <div className={twoPerRow ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2"}>
          {existingItems.map(name =>
            editingName === name ? (
              <div
                key={name}
                className={cn(
                  "bg-bg-card border-border-informative flex items-center gap-1.5 rounded-md border px-1.5 py-0.5",
                  twoPerRow && "w-full",
                )}
              >
                <Input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEdit();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setEditingName(null);
                    }
                  }}
                  className={cn("text-text-default h-5! rounded-none border-none bg-transparent p-0 text-xs", twoPerRow ? "w-full" : "w-24")}
                />
                <PermissionCheck permissionUtility={canManageSettings}>
                  <button type="button" onClick={saveEdit} disabled={renamingName === name} className="shrink-0 cursor-pointer disabled:opacity-50">
                    {renamingName === name ? (
                      <Spinner className="text-text-muted size-3" />
                    ) : (
                      <Check fill="var(--color-icon-success)" className="size-3" />
                    )}
                  </button>
                </PermissionCheck>
                <button type="button" onClick={() => setEditingName(null)} className="shrink-0 cursor-pointer">
                  <CloseFill fill="var(--color-icon-default-muted)" className="size-3" />
                </button>
              </div>
            ) : (
              <div
                key={name}
                className={cn(
                  "bg-bg-state-primary/10 border-border-default flex items-center gap-2 rounded-md border px-1.5 py-0.5",
                  twoPerRow && "w-full",
                )}
              >
                <PermissionCheck permissionUtility={canManageSettings}>
                  <Tooltip
                    description="Remove"
                    Trigger={
                      <button
                        type="button"
                        onClick={() => onDelete(name)}
                        disabled={deletingName === name}
                        className="shrink-0 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {deletingName === name ? (
                          <Spinner className="text-text-muted size-3" />
                        ) : (
                          <CloseFill fill="var(--color-icon-destructive)" className="size-3" />
                        )}
                      </button>
                    }
                  />
                </PermissionCheck>
                <span className={cn("text-text-default text-xs", twoPerRow && "flex-1 truncate")}>{toTitleCase(name)}</span>
                {onRename && (
                  <PermissionCheck permissionUtility={canManageSettings}>
                    <Tooltip
                      description="Rename"
                      Trigger={
                        <button type="button" onClick={() => startEditing(name)} className="shrink-0 cursor-pointer">
                          <Edit fill="var(--color-icon-default-muted)" className="size-3" />
                        </button>
                      }
                    />
                  </PermissionCheck>
                )}
              </div>
            ),
          )}
        </div>
      )}

      {isLoadingOptions ? (
        <div className="flex items-center gap-2">
          <Spinner className="text-text-muted size-3" />
          <span className="text-text-muted text-xs">Loading suggestions...</span>
        </div>
      ) : globalOptions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-text-muted text-xs">Suggestions — click to add</span>
          <div className="flex flex-wrap gap-2">
            {globalOptions.map(name => (
              <PermissionCheck key={name} permissionUtility={canManageSettings}>
                <button
                  type="button"
                  onClick={() => onAdd([name])}
                  disabled={isAdding || !!deletingName}
                  className="border-border-default text-text-default hover:bg-bg-state-soft cursor-pointer rounded-md border px-1.5 py-0.5 text-xs transition-colors disabled:opacity-50"
                >
                  {toTitleCase(name)}
                </button>
              </PermissionCheck>
            ))}
          </div>
        </div>
      ) : null}

      <div className="text-text-muted text-xs">
        Press Enter to add, or type several names separated by commas (e.g. &quot;Mathematics, English&quot;).
        {onRename && " Click the pencil on a name to rename it."}
      </div>
    </div>
  );
};
