import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { StudentRow } from "./students";

export const ClassReportFooter = ({
  students,
  activeFilter,
  setActiveFilter,
  footerRef,
  type = "teacher",
}: {
  students: StudentRow[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  footerRef: React.RefObject<HTMLDivElement | null>;
  type?: "admin" | "teacher";
}) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeFilter]);

  return (
    <div
      ref={footerRef}
      className="bg-bg-card border-border-default hide-scrollbar fixed bottom-0 hidden w-full items-center overflow-x-auto border-t py-4 md:flex"
    >
      <div className="bg-bg-card sticky left-0 z-10 flex items-center gap-2 pl-8 md:pl-10">
        <Button
          onClick={() => setActiveFilter("spreadsheet")}
          className={cn(
            "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
            activeFilter === "spreadsheet" && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
          )}
        >
          Spreadsheet
        </Button>
        {type === "teacher" && <div className="border-border-default h-7 border-r" />}
        {type === "teacher" && (
          <Button
            onClick={() => setActiveFilter("promotion")}
            className={cn(
              "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
              activeFilter === "promotion" && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
            )}
          >
            Promotion
          </Button>
        )}
        <div className="border-border-default h-7 border-r" />
      </div>
      <div className="flex items-center gap-2 pr-50 pl-2">
        {students.map(student => (
          <Button
            ref={activeFilter === String(student.id) ? activeRef : null}
            onClick={() => setActiveFilter(String(student.id))}
            key={student.id}
            className={cn(
              "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
              activeFilter === String(student.id) && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
            )}
          >
            {student.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
