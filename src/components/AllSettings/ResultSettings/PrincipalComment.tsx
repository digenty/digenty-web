import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeletePrincipalComment, useGetPrincipalComment } from "@/hooks/queryHooks/useResult";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { useGetClassLevel } from "@/hooks/queryHooks/useClass";
import { DeleteBin2 } from "@/components/Icons/DeleteBin2";
import { Button } from "@/components/ui/button";
import { CommentViewProps } from "./types";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import Edit from "@/components/Icons/Edit";
import { toast } from "@/components/Toast";

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
        {isLoadingLevels && <Skeleton className="bg-bg-input-soft h-8 w-50 rounded-3xl" />}
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
        {!isLoadingLevels && (
          <div className="mt-4 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="text-text-default text-xl font-semibold">Principal&apos;s Comment</div>
              {items.length > 0 && (
                <Button className="border-border-darker bg-bg-state-secondary hover:bg-bg-state-secondary-hover! text-text-default h-8 border">
                  <Edit fill="var(--color-icon-default-muted)" /> Edit
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-md font-semibold">Principal&apos;s Comment Automation</div>
              <div className="text-text-muted text-sm">Auto-generate principal comments based on student average scores.</div>
            </div>

            {items.length > 0 ? (
              <div className="flex-1">{items[activeIndex].content}</div>
            ) : (
              <PageEmptyState title="No comment" description="No comments set for this level" url="" buttonText="Add Comment" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const CommentView = ({ rows }: CommentViewProps) => {
  const { mutate: deleteComment, isPending } = useDeletePrincipalComment();

  if (!rows.length) {
    return <PageEmptyState title="No comment" description="No comments set for this level" url="" buttonText="Add Comment" />;
  }

  return (
    <div className="bg-bg-card border-border-default rounded-md border p-4 md:px-5 md:py-6">
      <div className="flex flex-col gap-4">
        {rows.map(row => (
          <div key={row.id} className="items-bottom mb-2 flex flex-col gap-2 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2">
              <Label className="text-text-muted text-sm font-medium">Percentage</Label>
              <div className="flex items-center gap-2">
                <Input className="bg-bg-input-soft! text-text-default h-9! border-none md:w-24" value={row.minPercentage} readOnly />
                <span className="text-text-muted">-</span>
                <Input className="bg-bg-input-soft! text-text-default h-9! border-none md:w-24" value={row.maxPercentage} readOnly />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label className="text-text-muted text-sm font-medium">Comment</Label>
              <div className="bg-bg-input-soft flex h-9 items-center gap-1 rounded-md p-1">
                <Input className="text-text-default h-7! w-full border-none bg-none! p-0" value={row.comment} readOnly />
                <span className="text-text-muted">%</span>
              </div>
            </div>
            <div className="flex flex-col gap-0 md:gap-2">
              <span className="invisible">-</span>
              <Button
                disabled={isPending}
                onClick={() =>
                  deleteComment(row.id, {
                    onSuccess: () => toast({ title: "Success", description: "Comment deleted successfully.", type: "success" }),
                    onError: (error: unknown) => {
                      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
                      toast({ title: "Error", description: message, type: "error" });
                    },
                  })
                }
                className="text-text-subtle bg-bg-state-soft! hover:bg-bg-state-soft-hover! rounde-md w-fit text-sm"
              >
                <DeleteBin2 fill="var(--color-icon-default-subtle)" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PrincipaleCommentView = () => {
  const { data: classLevel, isFetching: isLoadingLevels } = useGetClassLevel();
  const { data: principalComments, isFetching: isLoadingComments } = useGetPrincipalComment();
  const branches = classLevel?.data ?? [];
  const commentData = principalComments?.data ?? [];

  const levelLookup = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const branch of branches) {
      for (const level of branch.classLevels) {
        map.set(level.id, level.levelName);
      }
    }
    return map;
  }, [branches]);

  const tabs = React.useMemo(() => {
    const map = new Map<string, { id: number; levelId: number; minPercentage: number; maxPercentage: number; comment: string }[]>();

    for (const entry of commentData) {
      for (const row of entry.rows) {
        const levelName = levelLookup.get(row.levelId) ?? `Level ${row.levelId}`;
        const existing = map.get(levelName) ?? [];

        const isDuplicate = existing.some(
          r => r.minPercentage === row.minPercentage && r.maxPercentage === row.maxPercentage && r.comment.trim() === row.comment.trim(),
        );

        if (!isDuplicate) {
          map.set(levelName, [...existing, row]);
        }
      }
    }

    return Array.from(map.entries()).map(([levelName, rows]) => ({
      label: levelName.charAt(0) + levelName.slice(1).toLowerCase(),
      rows,
    }));
  }, [commentData, levelLookup]);
  const isLoading = isLoadingLevels || isLoadingComments;

  return (
    <div>
      <LevelsTabs
        isLoadingLevels={isLoading}
        items={tabs.map(tab => ({
          label: tab.label,
          content: <CommentView rows={tab.rows} />,
        }))}
      />
    </div>
  );
};
