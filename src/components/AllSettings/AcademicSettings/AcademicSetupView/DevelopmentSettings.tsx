"use client";

import { AddFill, DeleteBin2, Edit, Information } from "@digenty/icons";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Branch, ClassLevel, DevelopmentCategory, DevelopmentSkill } from "@/api/types";

import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetLevels } from "@/hooks/queryHooks/useLevel";
import {
  useAddDevelopmentCategory,
  useDeleteDevelopmentCategory,
  useGetDevelopmentSettingsByLevel,
  useUpdateDevelopmentCategory,
  useUpdateLevelSkills,
} from "@/hooks/queryHooks/useDevelopmentSettings";
import { useIsMobile } from "@/hooks/useIsMobile";
import { canManageSettings } from "@/lib/permissions/settings";
import { cn, extractUniqueLevelsByType, toTitleCase } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BranchTabs } from "../BranchTabs";
import { WizardStepFooter } from "../AcademicSetup/WizardStepFooter";
import { getApiErrorReason } from "@/lib/apiError";

// The flat /development-settings/categories list can't be trusted to carry a reliable levelId, so both the
// category CRUD list and the skills-per-level dropdown read from the per-level endpoint's nested categories instead.
const CategoriesSetup = ({ canEdit, levelId }: { canEdit: boolean; levelId?: number }) => {
  const { data: levelSettingsData, isFetching: isLoading } = useGetDevelopmentSettingsByLevel(levelId);
  const { mutate: addCategory, isPending: isAdding } = useAddDevelopmentCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateDevelopmentCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteDevelopmentCategory();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DevelopmentCategory | null>(null);

  const categories: DevelopmentCategory[] = levelSettingsData?.data?.categories ?? [];

  const handleAdd = () => {
    if (!newName.trim() || !levelId) return;
    addCategory(
      { name: newName.trim(), levelId },
      {
        onSuccess: () => {
          toast({ title: "Category added", type: "success" });
          setNewName("");
        },
        onError: (error: Error) => toast({ title: "Could not add category", description: getApiErrorReason(error), type: "error" }),
      },
    );
  };

  const handleUpdate = (categoryId: number) => {
    if (!editingName.trim() || !levelId) return;
    updateCategory(
      { categoryId, payload: { name: editingName.trim(), levelId } },
      {
        onSuccess: () => {
          toast({ title: "Category updated", type: "success" });
          setEditingId(null);
        },
        onError: (error: Error) => toast({ title: "Could not update category", description: getApiErrorReason(error), type: "error" }),
      },
    );
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const categoryId = pendingDelete.categoryId;
    setDeletingId(categoryId);
    deleteCategory(categoryId, {
      onSuccess: () => {
        toast({ title: "Category deleted", type: "success" });
        setDeletingId(null);
        setPendingDelete(null);
      },
      onError: (error: Error) => {
        toast({ title: "Could not delete category", description: getApiErrorReason(error), type: "error" });
        setDeletingId(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-md font-semibold">Categories</div>
        <div className="text-text-muted text-sm">Groups of skills, e.g. Affective Development, Psychomotor Development.</div>
      </div>

      <div className="bg-bg-card border-border-default flex flex-col gap-3 rounded-md border p-4 md:px-5 md:py-6">
        {isLoading && <Skeleton className="h-20 w-full" />}

        {!isLoading && categories.length === 0 && (
          <div className="text-text-muted py-4 text-center text-sm">No categories yet — add one below to get started.</div>
        )}

        {!isLoading &&
          categories.map(category => (
            <div key={category.categoryId} className="flex flex-col gap-2">
              <div className="bg-bg-input-soft flex items-center gap-2 rounded-md px-3 py-1">
                {editingId === category.categoryId ? (
                  <>
                    <Input
                      className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      autoFocus
                    />
                    <PermissionCheck permissionUtility={canManageSettings}>
                      <Button
                        onClick={() => handleUpdate(category.categoryId)}
                        disabled={isUpdating}
                        className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-8! rounded-md"
                      >
                        {isUpdating && <Spinner className="text-text-white-default size-3" />} Save
                      </Button>
                    </PermissionCheck>
                    <Button onClick={() => setEditingId(null)} className="bg-bg-state-soft! text-text-subtle h-8! rounded-md">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-text-default flex-1 text-sm">{category.categoryName}</span>
                    {canEdit && (
                      <>
                        <PermissionCheck permissionUtility={canManageSettings}>
                          <Tooltip
                            description="Edit category"
                            Trigger={
                              <Button
                                onClick={() => {
                                  setEditingId(category.categoryId);
                                  setEditingName(category.categoryName);
                                }}
                                className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                              >
                                <Edit fill="var(--color-icon-default-subtle)" />
                              </Button>
                            }
                          />
                        </PermissionCheck>
                        <PermissionCheck permissionUtility={canManageSettings}>
                          <Tooltip
                            description="Delete category"
                            Trigger={
                              <Button
                                onClick={() => setPendingDelete(category)}
                                disabled={isDeleting && deletingId === category.categoryId}
                                className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                              >
                                {isDeleting && deletingId === category.categoryId ? (
                                  <Spinner className="size-4" />
                                ) : (
                                  <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                                )}
                              </Button>
                            }
                          />
                        </PermissionCheck>
                      </>
                    )}
                  </>
                )}
              </div>

              {pendingDelete?.categoryId === category.categoryId && (
                <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex flex-col gap-3 rounded-md border p-3">
                  <p className="text-text-default text-sm">
                    Deleting &quot;{category.categoryName}&quot; removes all its skills and any ratings recorded under them from this level going
                    forward. Existing report cards are not affected. This cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setPendingDelete(null)} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      disabled={isDeleting}
                      className="bg-bg-state-destructive! hover:bg-bg-state-destructive-hover! text-text-white-default! h-7! rounded-md"
                    >
                      {isDeleting && <Spinner className="size-3" />} Delete category
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

        {canEdit && (
          <div className="flex items-center gap-2 pt-2">
            <Input
              className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
              placeholder="New category name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <PermissionCheck permissionUtility={canManageSettings}>
              <Tooltip
                description="Add category"
                Trigger={
                  <Button
                    onClick={handleAdd}
                    disabled={isAdding || !newName.trim() || !levelId}
                    className="text-text-subtle hover:bg-bg-none! rounded-md bg-none! text-xs"
                  >
                    {isAdding ? <Spinner className="size-3" /> : <AddFill fill="var(--color-icon-default-muted)" className="size-3" />} Add
                  </Button>
                }
              />
            </PermissionCheck>
          </div>
        )}
      </div>
    </div>
  );
};

interface EditableSkill extends DevelopmentSkill {
  key: string;
}

const SkillsForLevel = ({
  level,
  canEdit,
  branchSpecific,
  isDirty,
  setIsDirty,
}: {
  level: ClassLevel;
  canEdit: boolean;
  branchSpecific: boolean;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  const [skills, setSkills] = useState<EditableSkill[]>([]);
  const [pendingDelete, setPendingDelete] = useState<EditableSkill | null>(null);

  const { data: levelSettingsData, isFetching: isLoadingLevelSettings } = useGetDevelopmentSettingsByLevel(level.id);
  const { mutate: saveSkills, isPending } = useUpdateLevelSkills();

  const levelCategories: DevelopmentCategory[] = levelSettingsData?.data?.categories ?? [];
  const activeLevelCategory = levelCategories.find(c => c.categoryId === activeCategoryId);

  useEffect(() => {
    if (levelCategories.length > 0 && !levelCategories.some(c => c.categoryId === activeCategoryId)) {
      setActiveCategoryId(levelCategories[0].categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelCategories]);

  useEffect(() => {
    if (isLoadingLevelSettings) return;
    const current = levelCategories.find(c => c.categoryId === activeCategoryId)?.skills ?? [];
    setSkills(current.map((s, index) => ({ ...s, key: s.id ? String(s.id) : `new-${index}-${s.name}` })));
    setPendingDelete(null);
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSettingsData, activeCategoryId, isLoadingLevelSettings]);

  const addSkill = () => {
    setSkills(prev => [...prev, { id: null, name: "", key: `new-${Date.now()}` }]);
    setIsDirty(true);
  };

  const updateSkillName = (key: string, name: string) => {
    setSkills(prev => prev.map(s => (s.key === key ? { ...s, name } : s)));
    setIsDirty(true);
  };

  const move = (index: number, direction: -1 | 1) => {
    setSkills(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setIsDirty(true);
  };

  const requestRemove = (skill: EditableSkill) => {
    if (skill.hasRatings) {
      setPendingDelete(skill);
    } else {
      setSkills(prev => prev.filter(s => s.key !== skill.key));
      setIsDirty(true);
    }
  };

  const confirmRemove = () => {
    if (!pendingDelete) return;
    setSkills(prev => prev.filter(s => s.key !== pendingDelete.key));
    setPendingDelete(null);
    setIsDirty(true);
  };

  const handleSave = () => {
    if (!activeCategoryId) return;
    const cleaned = skills.filter(s => s.name.trim().length > 0);
    if (cleaned.length === 0) {
      toast({ title: "Add at least one skill", type: "error" });
      return;
    }

    saveSkills(
      {
        categoryId: activeCategoryId,
        branchSpecific,
        levelId: level.id,
        levelType: level.levelType,
        skills: cleaned.map(s => ({ id: s.id, name: s.name.trim() })),
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: `Skills for ${toTitleCase(level.levelName)} saved`, type: "success" });
          setIsDirty(false);
        },
        onError: (error: Error) => toast({ title: "Failed to save", description: getApiErrorReason(error), type: "error" }),
      },
    );
  };

  const handleCancel = () => {
    const current = activeLevelCategory?.skills ?? [];
    setSkills(current.map((s, index) => ({ ...s, key: s.id ? String(s.id) : `new-${index}-${s.name}` })));
    setPendingDelete(null);
    setIsDirty(false);
  };

  if (isLoadingLevelSettings) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (levelCategories.length === 0) {
    return <div className="text-text-muted py-6 text-center text-sm">Add a category above before configuring skills.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select
          value={activeCategoryId ? String(activeCategoryId) : ""}
          onValueChange={value => setActiveCategoryId(Number(value))}
          disabled={isDirty}
        >
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-fit min-w-48 rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {levelCategories.map(category => (
              <SelectItem key={category.categoryId} value={String(category.categoryId)} className="text-text-default text-sm">
                {category.categoryName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-bg-card border-border-default flex flex-col gap-3 rounded-md border p-4 md:px-5 md:py-6">
        {skills.length === 0 ? (
          <div className="text-text-muted py-4 text-center text-sm">No skills configured for this level yet</div>
        ) : (
          skills.map((skill, index) => (
            <div key={skill.key} className="flex items-center gap-2">
              <div className="flex flex-col">
                <Tooltip
                  description="Move up"
                  Trigger={
                    <button
                      type="button"
                      disabled={!canEdit || index === 0}
                      onClick={() => move(index, -1)}
                      className="text-text-muted disabled:opacity-30"
                    >
                      <ChevronUpIcon className="size-4" />
                    </button>
                  }
                />
                <Tooltip
                  description="Move down"
                  Trigger={
                    <button
                      type="button"
                      disabled={!canEdit || index === skills.length - 1}
                      onClick={() => move(index, 1)}
                      className="text-text-muted disabled:opacity-30"
                    >
                      <ChevronDownIcon className="size-4" />
                    </button>
                  }
                />
              </div>
              <Input
                readOnly={!canEdit}
                className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                value={skill.name}
                onChange={e => updateSkillName(skill.key, e.target.value)}
              />
              {canEdit && (
                <PermissionCheck permissionUtility={canManageSettings}>
                  <Tooltip
                    description="Remove skill"
                    Trigger={
                      <Button
                        onClick={() => requestRemove(skill)}
                        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                      >
                        <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                      </Button>
                    }
                  />
                </PermissionCheck>
              )}
            </div>
          ))
        )}

        {canEdit && (
          <PermissionCheck permissionUtility={canManageSettings}>
            <Tooltip
              description="Add skill"
              Trigger={
                <Button onClick={addSkill} className="text-text-subtle hover:bg-bg-none! mt-1 w-fit rounded-md bg-none! text-xs">
                  <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Skill
                </Button>
              }
            />
          </PermissionCheck>
        )}
      </div>

      {pendingDelete && (
        <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex flex-col gap-3 rounded-md border p-4">
          <div className="text-text-default text-sm">
            Students have already been rated on <span className="font-medium">{pendingDelete.name}</span>. Removing it keeps it on past report cards,
            but it will no longer be rated going forward. Re-adding a skill with the same name later brings its ratings back.
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setPendingDelete(null)} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
              Cancel
            </Button>
            <Button
              onClick={confirmRemove}
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
            >
              Remove skill
            </Button>
          </div>
        </div>
      )}

      {canEdit && (
        <div className="flex justify-end gap-2">
          <Button onClick={handleCancel} disabled={isPending} className="bg-bg-state-soft! text-text-subtle h-7! rounded-md">
            Cancel
          </Button>
          <PermissionCheck permissionUtility={canManageSettings}>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7! rounded-md"
            >
              {isPending && <Spinner className="text-text-white-default size-4" />}
              Save changes
            </Button>
          </PermissionCheck>
        </div>
      )}
    </div>
  );
};

export const DevelopmentSettings = ({
  completedSteps,
  setCompletedSteps,
}: {
  completedSteps?: string[];
  setCompletedSteps?: (steps: string[]) => void;
} = {}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [branchSpecific, setBranchSpecific] = useState(false);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  const { data: branchesData, isPending: isLoadingBranches } = useGetBranches();
  const defaultBranchId = branchesData?.data?.[0]?.branch?.id;
  const { data: branchLevels, isPending: isLoadingBranchLevels } = useGetLevels(branchSpecific ? activeBranch?.id : defaultBranchId);
  const levels = useMemo(() => extractUniqueLevelsByType(branchLevels?.data || []), [branchLevels?.data]);
  const isLoadingLevels = isLoadingBranches || isLoadingBranchLevels;

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (levels.length === 0) {
      setActiveLevel(undefined);
      return;
    }
    setActiveLevel(prev => {
      if (prev) {
        const updated = levels.find(l => l.id === prev.id);
        if (updated) return updated;
      }
      return levels[0];
    });
  }, [levels]);

  const levelSwitcher = isLoadingLevels ? (
    <Skeleton className="bg-bg-input-soft h-9 w-64 rounded-3xl" />
  ) : isMobile ? (
    <Select value={String(activeLevel?.id)} onValueChange={value => setActiveLevel(levels.find(l => l.id === Number(value)))} disabled={isDirty}>
      <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
        <SelectValue>
          <span className="text-text-default text-sm">{activeLevel ? toTitleCase(activeLevel.levelName) : ""}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-bg-default border-border-default">
        {levels.map(level => (
          <SelectItem key={level.levelName} value={String(level.id)} className="text-text-default text-sm">
            {toTitleCase(level.levelName)}
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
            type="button"
            disabled={isDirty}
            onClick={() => setActiveLevel(level)}
            className={cn(
              "flex justify-center px-4 py-2 text-sm font-medium whitespace-nowrap transition-all disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-bg-state-secondary border-border-darker text-text-default flex h-8 items-center gap-1 rounded-full border shadow-sm"
                : "text-text-muted flex h-8 items-center gap-1",
            )}
          >
            {toTitleCase(level.levelName)}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto flex w-full flex-col gap-8 pb-12 md:max-w-171">
      <div className="flex items-start justify-between">
        <div className="text-text-default text-xl font-semibold">Development Skills</div>
        <PermissionCheck permissionUtility={canManageSettings}>
          <Tooltip
            description={isEditing && isDirty ? "Save or cancel your changes below first" : isEditing ? "Done editing" : "Edit"}
            Trigger={
              <Button
                onClick={() => setIsEditing(prev => !prev)}
                disabled={isEditing && isDirty}
                className={cn(
                  "flex h-7! items-center justify-center rounded-md border p-2",
                  isEditing
                    ? "bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! border-transparent"
                    : "bg-bg-state-secondary! border-border-darker hover:bg-bg-none! text-text-default",
                )}
              >
                {isEditing ? (
                  "Done"
                ) : (
                  <>
                    <Edit fill="var(--color-icon-default-muted)" /> Edit
                  </>
                )}
              </Button>
            }
          />
        </PermissionCheck>
      </div>

      <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex items-start gap-2 rounded-md border p-3">
        <Information fill="var(--color-icon-default-muted)" className="mt-0.5 size-4 shrink-0" />
        <div className="text-text-default text-sm">
          The categories and skills you configure here decide what shows up under Development on every student&apos;s report card for this level —
          each skill is rated 1–5 by the class teacher, using the same rating legend everywhere it appears.
        </div>
      </div>

      {isDirty && (
        <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent rounded-md border p-3">
          <p className="text-text-default text-sm">
            You have unsaved changes to the skills below. Save or cancel them before switching category, level, or clicking Done above.
          </p>
        </div>
      )}

      <div className="bg-bg-subtle border-border-default flex w-full items-start justify-between rounded-md border p-4">
        <div className="">
          <div className="text-text-default text-md font-semibold">Do academic structures differ by school branch?</div>
          <div className="text-text-subtle text-sm font-normal">Turn ON for branch-specific structures. Keep OFF to share one setup.</div>
        </div>
        <Toggle
          withBorder={false}
          checked={branchSpecific}
          onChange={evt => {
            setBranchSpecific(!branchSpecific);
            if (!evt.target.checked) setActiveBranch(null);
          }}
        />
      </div>
      {branchSpecific && (
        <div className="border-border-default flex w-full items-center gap-3">
          <BranchTabs activeBranch={activeBranch} setActiveBranch={setActiveBranch} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="text-text-muted text-sm">Select a level to configure its skill list.</div>
        {levelSwitcher}
      </div>

      <CategoriesSetup key={`categories-${activeLevel?.id}`} canEdit={isEditing} levelId={activeLevel?.id} />

      <div className="flex flex-col gap-1">
        <div className="text-text-default text-md font-semibold">Skills per level</div>
        <div className="text-text-muted text-sm">Choose a category above, then add, rename, reorder or remove its skills below.</div>
      </div>

      {activeLevel && (
        <SkillsForLevel
          key={`skills-${activeLevel.id}`}
          level={activeLevel}
          canEdit={isEditing}
          branchSpecific={branchSpecific}
          isDirty={isDirty}
          setIsDirty={setIsDirty}
        />
      )}

      {completedSteps && setCompletedSteps && (
        <WizardStepFooter
          onBack={() => router.push(`${pathname}?step=grading-and-assessment`)}
          onContinue={() => {
            setCompletedSteps([...completedSteps, "development-skills"]);
            router.push(`${pathname}?step=admission-number`);
          }}
        />
      )}
    </div>
  );
};
