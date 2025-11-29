"use client";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { ClassReportFooter } from "./ClassReportFooter";
import { ClassReportHeader } from "./ClassReportHeader";
import { createColumns } from "./SpreadsheetColumns";
import { StudentRow, students } from "./students";
import { createPromotionColumns } from "./PromotionColumn";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const ClassReport = () => {
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<StudentRow[]>([]);
  const [activeStudent, setActiveStudent] = useState<string>();
  const [termSelected, setTermSelected] = useState(termsOptions[0]);

  const pageSize = 10;

  const scrollRight = () => {
    footerRef.current?.scrollBy?.({ left: 200, behavior: "smooth" });
  };

  const scrollLeft = () => {
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
      <ClassReportHeader
        students={students}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        termSelected={termSelected}
        setTermSelected={setTermSelected}
      />

      <div className="hidden overflow-x-auto px-4 pt-4 pb-25 md:block md:px-8">
        {activeFilter === "spreadsheet" ? (
          <DataTable
            columns={createColumns(students, termSelected)}
            data={students}
            totalCount={students.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              console.log(row);
            }}
            showPagination={false}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            fullBorder
            classNames={{
              tableHead: "text-center pr-2 w-34",
              tableBodyCell: "text-center pr-2 w-34",
              tableRow: "h-14",
              table: "table-fixed",
            }}
          />
        ) : activeFilter === "promotion" ? (
          <DataTable
            columns={createPromotionColumns(students, termSelected)}
            data={students}
            totalCount={students.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            clickHandler={row => {
              console.log(row);
            }}
            showPagination={false}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            fullBorder
            classNames={{
              tableHead: "text-center pr-2 w-34",
              tableBodyCell: "text-center pr-2 w-34",
              tableRow: "h-14",
              table: "table-fixed",
            }}
          />
        ) : (
          <div>Student report</div>
        )}
      </div>

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
