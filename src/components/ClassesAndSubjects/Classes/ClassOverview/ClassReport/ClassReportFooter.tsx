import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StudentRow } from "./students";

export const ClassReportFooter = ({
  students,
  activeFilter,
  setActiveFilter,
  footerRef,
}: {
  students: StudentRow[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  footerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      ref={footerRef}
      className="bg-bg-card border-border-default scrollbar-hide fixed bottom-0 hidden w-full items-center gap-2 overflow-x-auto border-t py-4 pr-50 pl-10 md:flex"
    >
      <Button
        onClick={() => setActiveFilter("spreadsheet")}
        className={cn(
          "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
          activeFilter === "spreadsheet" && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
        )}
      >
        Spreadsheet
      </Button>
      <div className="border-border-default h-7 border-r" />
      <Button
        onClick={() => setActiveFilter("promotion")}
        className={cn(
          "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
          activeFilter === "promotion" && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
        )}
      >
        Promotion
      </Button>
      <div className="border-border-default h-7 border-r" />
      {students.map(student => (
        <Button
          onClick={() => setActiveFilter(student.id)}
          key={student.id}
          className={cn(
            "bg-bg-state-soft hover:bg-bg-state-soft-hover! text-text-subtle no-wrap h-7! w-fit rounded-md px-2 text-sm font-medium",
            activeFilter === student.id && "bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default",
          )}
        >
          {student.name}
        </Button>
      ))}
    </div>
  );
};
