"use client";

import { AttendanceLevel } from "@/api/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

export const AttendanceLevelTabs = ({
  levels,
  activeLevelId,
  setActiveLevelId,
}: {
  levels: AttendanceLevel[];
  activeLevelId: number | null;
  setActiveLevelId: (levelId: number) => void;
}) => {
  const isMobile = useIsMobile();
  const activeLevel = levels.find(level => level.levelId === activeLevelId);

  if (isMobile) {
    return (
      <Select value={activeLevelId ? String(activeLevelId) : ""} onValueChange={value => setActiveLevelId(Number(value))}>
        <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
          <span className="text-text-default text-sm capitalize">{activeLevel?.levelName.replaceAll("_", " ").toLowerCase()}</span>
        </SelectTrigger>
        <SelectContent className="bg-bg-default border-border-default">
          {levels.map(level => (
            <SelectItem key={level.levelId} value={String(level.levelId)} className="text-text-default text-sm capitalize">
              {level.levelName.replaceAll("_", " ").toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div
        className="bg-bg-state-soft hide-scrollbar flex w-fit max-w-full items-center gap-2.5 overflow-x-auto rounded-full p-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {levels.map(level => {
          const isActive = level.levelId === activeLevelId;

          return (
            <button
              key={level.levelId}
              type="button"
              onClick={() => setActiveLevelId(level.levelId)}
              className={cn(
                "flex shrink-0 justify-center px-4 py-2 text-sm font-medium whitespace-nowrap capitalize transition-colors",
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
    </div>
  );
};
