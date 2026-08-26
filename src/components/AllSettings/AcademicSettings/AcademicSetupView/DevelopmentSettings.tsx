"use client";

import { AddFill, DeleteBin2, Edit, Information } from "@digenty/icons";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { ClassLevel, DevelopmentCategory, DevelopmentCategorySummary, DevelopmentSkill } from "@/api/types";

import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import {
  useAddDevelopmentCategory,
  useDeleteDevelopmentCategory,
  useGetDevelopmentCategories,
  useGetDevelopmentSettingsByLevel,
  useUpdateDevelopmentCategory,
  useUpdateLevelSkills,
} from "@/hooks/queryHooks/useDevelopmentSettings";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn, extractUniqueLevelsByType } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { WizardStepFooter } from "../AcademicSetup/WizardStepFooter";

const CategoriesSetup = ({ canEdit }: { canEdit: boolean }) => {
  const { data: categoriesData, isFetching: isLoading } = useGetDevelopmentCategories();
  const { mutate: addCategory, isPending: isAdding } = useAddDevelopmentCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateDevelopmentCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteDevelopmentCategory();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const categories: DevelopmentCategorySummary[] = categoriesData?.data ?? [];

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory(
      { name: newName.trim() },
      {
        onSuccess: () => {
          toast({ title: "Category added", type: "success" });
          setNewName("");
        },
        onError: (error: Error) => toast({ title: "Could not add category", description: error?.message, type: "error" }),
      },
    );
  };

  const handleUpdate = (categoryId: number) => {
    if (!editingName.trim()) return;
    updateCategory(
      { categoryId, payload: { name: editingName.trim() } },
      {
        onSuccess: () => {
          toast({ title: "Category updated", type: "success" });
          setEditingId(null);
        },
        onError: (error: Error) => toast({ title: "Could not update category", description: error?.message, type: "error" }),
      },
    );
  };

  const handleDelete = (categoryId: number) => {
    setDeletingId(categoryId);
    deleteCategory(categoryId, {
      onSuccess: () => {
        toast({ title: "Category deleted", type: "success" });
        setDeletingId(null);
      },
      onError: (error: Error) => {
        toast({ title: "Could not delete category", description: error?.message, type: "error" });
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

        {!isLoading && categories.length === 0 && <div className="text-text-muted py-4 text-center text-sm">No categories yet</div>}

        {!isLoading &&
          categories.map(category => (
            <div key={category.id} className="bg-bg-input-soft flex items-center gap-2 rounded-md px-3 py-1">
              {editingId === category.id ? (
                <>
                  <Input
                    className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                  />
                  <Button
                    onClick={() => handleUpdate(category.id)}
                    disabled={isUpdating}
                    className="bg-bg-state-primary! text-text-white-default! h-8! rounded-md"
                  >
                    {isUpdating && <Spinner className="size-3" />} Save
                  </Button>
                  <Button onClick={() => setEditingId(null)} className="bg-bg-state-soft! text-text-subtle h-8! rounded-md">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-text-default flex-1 text-sm">{category.name}</span>
                  {canEdit && (
                    <>
                      <Button
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                      >
                        <Edit fill="var(--color-icon-default-subtle)" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting && deletingId === category.id}
                        className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                      >
                        {isDeleting && deletingId === category.id ? (
                          <Spinner className="size-4" />
                        ) : (
                          <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                        )}
                      </Button>
                    </>
                  )}
                </>
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
            <Button
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              className="text-text-subtle hover:bg-bg-none! rounded-md bg-none! text-xs"
            >
              {isAdding ? <Spinner className="size-3" /> : <AddFill fill="var(--color-icon-default-muted)" className="size-3" />} Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

interface EditableSkill extends DevelopmentSkill {
  key: string;
}

const SkillsForLevel = ({ level, categories, canEdit }: { level: ClassLevel; categories: DevelopmentCategorySummary[]; canEdit: boolean }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(categories[0]?.id);
  const [skills, setSkills] = useState<EditableSkill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<EditableSkill | null>(null);

  useEffect(() => {
    if (!canEdit) setIsEditing(false);
  }, [canEdit]);

  useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const { data: levelSettingsData, isFetching: isLoadingLevelSettings } = useGetDevelopmentSettingsByLevel(level.id);
  const { mutate: saveSkills, isPending } = useUpdateLevelSkills();

  const levelCategories: DevelopmentCategory[] = levelSettingsData?.data?.categories ?? [];
  const activeLevelCategory = levelCategories.find(c => c.categoryId === activeCategoryId);

  useEffect(() => {
    if (isLoadingLevelSettings) return;
    const current = levelCategories.find(c => c.categoryId === activeCategoryId)?.skills ?? [];
    setSkills(current.map((s, index) => ({ ...s, key: s.id ? String(s.id) : `new-${index}-${s.name}` })));
    setIsEditing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSettingsData, activeCategoryId, isLoadingLevelSettings]);

  const addSkill = () => setSkills(prev => [...prev, { id: null, name: "", key: `new-${Date.now()}` }]);

  const updateSkillName = (key: string, name: string) => setSkills(prev => prev.map(s => (s.key === key ? { ...s, name } : s)));

  const move = (index: number, direction: -1 | 1) => {
    setSkills(prev => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const requestRemove = (skill: EditableSkill) => {
    if (skill.hasRatings) {
      setPendingDelete(skill);
    } else {
      setSkills(prev => prev.filter(s => s.key !== skill.key));
    }
  };

  const confirmRemove = () => {
    if (!pendingDelete) return;
    setSkills(prev => prev.filter(s => s.key !== pendingDelete.key));
    setPendingDelete(null);
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
        branchSpecific: false,
        levelType: level.levelType,
        skills: cleaned.map(s => ({ id: s.id, name: s.name.trim() })),
      },
      {
        onSuccess: () => {
          toast({ title: "Success", description: `Skills for ${level.levelName} saved`, type: "success" });
          setIsEditing(false);
        },
        onError: (error: Error) => toast({ title: "Failed to save", description: error?.message, type: "error" }),
      },
    );
  };

  const handleCancel = () => {
    const current = activeLevelCategory?.skills ?? [];
    setSkills(current.map((s, index) => ({ ...s, key: s.id ? String(s.id) : `new-${index}-${s.name}` })));
    setIsEditing(false);
  };

  if (categories.length === 0) {
    return <div className="text-text-muted py-6 text-center text-sm">Add a category above before configuring skills.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Select
          value={activeCategoryId ? String(activeCategoryId) : ""}
          onValueChange={value => setActiveCategoryId(Number(value))}
          disabled={isEditing}
        >
          <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-fit min-w-48 rounded-md border-none px-3 py-2 text-left text-sm font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-bg-default border-border-default">
            {categories.map(category => (
              <SelectItem key={category.id} value={String(category.id)} className="text-text-default text-sm">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isEditing && <span className="text-text-muted text-xs">Save or cancel before switching category</span>}

        {canEdit && !isEditing && (
          <Button onClick={() => setIsEditing(true)} className="text-text-default border-border-darker h-8! rounded-md border">
            <Edit fill="var(--color-icon-default-muted)" /> Edit
          </Button>
        )}
      </div>

      <div className="bg-bg-card border-border-default flex flex-col gap-3 rounded-md border p-4 md:px-5 md:py-6">
        {isLoadingLevelSettings ? (
          <Skeleton className="h-32 w-full" />
        ) : skills.length === 0 ? (
          <div className="text-text-muted py-4 text-center text-sm">No skills configured for this level yet</div>
        ) : (
          skills.map((skill, index) => (
            <div key={skill.key} className="flex items-center gap-2">
              <div className="flex flex-col">
                <button
                  type="button"
                  disabled={!isEditing || index === 0}
                  onClick={() => move(index, -1)}
                  className="text-text-muted disabled:opacity-30"
                >
                  <ChevronUpIcon className="size-4" />
                </button>
                <button
                  type="button"
                  disabled={!isEditing || index === skills.length - 1}
                  onClick={() => move(index, 1)}
                  className="text-text-muted disabled:opacity-30"
                >
                  <ChevronDownIcon className="size-4" />
                </button>
              </div>
              <Input
                readOnly={!isEditing}
                className="bg-bg-input-soft! text-text-default h-9! flex-1 border-none"
                value={skill.name}
                onChange={e => updateSkillName(skill.key, e.target.value)}
              />
              {isEditing && (
                <Button
                  onClick={() => requestRemove(skill)}
                  className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounded-md text-sm"
                >
                  <DeleteBin2 fill="var(--color-icon-default-subtle)" />
                </Button>
              )}
            </div>
          ))
        )}

        {isEditing && (
          <Button onClick={addSkill} className="text-text-subtle hover:bg-bg-none! mt-1 w-fit rounded-md bg-none! text-xs">
            <AddFill fill="var(--color-icon-default-muted)" className="size-3" /> Add Skill
          </Button>
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
            <Button onClick={confirmRemove} className="bg-bg-state-primary! text-text-white-default! h-7! rounded-md">
              Remove skill
            </Button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="flex justify-end gap-2">
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
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const levels = extractUniqueLevelsByType(classLevel?.data || []);
  const { data: categoriesData } = useGetDevelopmentCategories();
  const categories: DevelopmentCategorySummary[] = categoriesData?.data ?? [];

  const [activeLevel, setActiveLevel] = useState<ClassLevel>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (levels.length > 0 && !activeLevel) {
      setActiveLevel(levels[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classLevel]);

  const levelSwitcher = isLoadingLevels ? (
    <Skeleton className="bg-bg-input-soft h-9 w-64 rounded-3xl" />
  ) : isMobile ? (
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
  );

  return (
    <div className="mx-auto flex w-full flex-col gap-8 pb-12 md:max-w-171">
      <div className="flex items-start justify-between">
        <div className="text-text-default text-xl font-semibold">Development Skills</div>
        <Button
          onClick={() => setIsEditing(prev => !prev)}
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
      </div>

      <div className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent flex items-start gap-2 rounded-md border p-3">
        <Information fill="var(--color-icon-default-muted)" className="mt-0.5 size-4 shrink-0" />
        <div className="text-text-default text-sm">
          The categories and skills you configure here decide what shows up under Development on every student&apos;s report card for this level —
          each skill is rated 1–5 by the class teacher, using the same rating legend everywhere it appears.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-text-muted text-sm">Select a level to configure its skill list.</div>
        {levelSwitcher}
      </div>

      <CategoriesSetup canEdit={isEditing} />

      <div className="flex flex-col gap-1">
        <div className="text-text-default text-md font-semibold">Skills per level</div>
        <div className="text-text-muted text-sm">Each class level can have its own skill list per category.</div>
      </div>

      {activeLevel && <SkillsForLevel key={activeLevel.id} level={activeLevel} categories={categories} canEdit={isEditing} />}

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
