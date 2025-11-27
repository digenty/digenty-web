"use client";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { ClassReportHeader } from "./ClassReportHeader";
import { students } from "./students";
import { RefObject, useRef, useState } from "react";
import { ClassReportFooter } from "./ClassReportFooter";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ClassReport = () => {
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    footerRef.current?.scrollBy?.({ left: 200, behavior: "smooth" });
  };

  const scrollLeft = () => {
    console.log("scrolled");
    footerRef.current?.scrollBy?.({ left: -200, behavior: "smooth" });
  };

  useBreadcrumb([
    { label: "Classes and Subjects", url: "/classes-and-subjects" },
    { label: "Classes", url: `/classes-and-subjects` },
    { label: "My Class", url: "/classes-and-subjects/classes/3" },
    { label: "Class Report", url: "" },
  ]);
  const [activeFilter, setActiveFilter] = useState("spreadsheet");

  return (
    <div className="relative">
      <ClassReportHeader students={students} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      {!isMobile && <ClassReportFooter students={students} activeFilter={activeFilter} setActiveFilter={setActiveFilter} footerRef={footerRef} />}

      {/* Footer scroll buttons. Had to be kept outside cos of its fixed position also */}
      {!isMobile && (
        <div className="bg-bg-card fixed right-0 bottom-0 flex h-15 w-28 py-4">
          <div className="border-border-default mr-2 border-l" />
          <Button
            onClick={scrollLeft}
            className="bg-bg-state-ghost hover:bg-bg-state-ghost-hover! flex size-8 items-center justify-center rounded-md"
          >
            <ChevronLeft className="text-icon-default-subtle size-5" />
          </Button>
          <Button
            onClick={scrollRight}
            className="bg-bg-state-ghost hover:bg-bg-state-ghost-hover! flex size-8 items-center justify-center rounded-md"
          >
            <ChevronRight className="text-icon-default-subtle size-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
