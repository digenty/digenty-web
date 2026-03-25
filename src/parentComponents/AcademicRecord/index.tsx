"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Result } from "./types";
import { columns, mockReport, mockResults } from "./Colunm";
import { StudentFilter } from "../FilterStudents";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Calendar from "@/components/Icons/Calendar";

const filterValues = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];
export const AcademicRecord = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Result[]>([]);
  const [selected, setSelected] = useState(filterValues[0]);

  return (
    <div className="flex w-full flex-col gap-10 p-4 md:p-8">
      <div className="flex w-full items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-text-default text-2xl font-semibold">Academic Record</div>
          <div className="text-text-muted text-xs">Review student&apos;s result</div>
        </div>
        <StudentFilter />
      </div>

      <div className="flex items-center justify-between">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="border-border-darker h-8! w-auto border">
            <SelectValue className="text-text-default flex font-medium">
              <Calendar className="text-icon-black-muted size-4" />
              <p className="text-text-default text-sm">{selected}</p>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default border">
            <SelectItem className="text-text-default" value="24/25 Third Term">
              24/25 Third Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 Second Term">
              24/25 Second Term
            </SelectItem>
            <SelectItem className="text-text-default" value="24/25 First Term">
              24/25 First Term
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:p-10">
        <div
          id="student-report"
          className="border-t-bg-basic-cyan-contrast border-x-border-default border-b-border-default mb-10 border-x border-t-2 border-b"
        >
          <div className="flex flex-col items-center justify-center py-3">
            <h1 className="text-bg-basic-cyan-contrast text-xl font-semibold">{mockReport.schoolName}</h1>
            <p className="text-text-muted text-sm font-normal capitalize">
              {mockReport.term} {mockReport.sessionName} Session
            </p>
          </div>

          <div className="border-border-default text-text-default flex justify-between border-y px-4 py-2.5 text-sm font-normal">
            <span>
              Name: <span className="font-medium">{mockReport.studentName}</span>
            </span>
            <span>
              Class: <span className="font-medium">{mockReport.className}</span>
            </span>
          </div>

          <div className="flex gap-6 px-4 py-5">
            <div className="w-1/2 space-y-2">
              <h3 className="text-bg-basic-red-accent text-sm font-semibold">ATTENDANCE</h3>
              <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
                <div className="border-border-default flex justify-between border-b px-2">
                  <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                    <span className="hidden lg:inline">No. of Times </span>
                    <span>School Opened:</span>
                  </div>
                  <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{mockReport.totalSchoolDays}</div>
                </div>
                <div className="border-border-default flex justify-between border-b px-2">
                  <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                    <span className="hidden lg:inline">No. of </span>
                    <span>Times Present:</span>
                  </div>
                  <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{mockReport.totalPresent}</div>
                </div>
                <div className="flex justify-between px-2">
                  <div className="line-clamp-1 w-3/4 flex-1 truncate py-2">
                    <span className="hidden lg:inline">No. of </span>
                    <span>Times Absent:</span>
                  </div>
                  <div className="border-border-default w-1/4 border-l py-2 pl-2 text-center">{mockReport.totalAbsent}</div>
                </div>
              </div>
            </div>

            <div className="w-1/2 space-y-2">
              <h3 className="text-bg-basic-red-accent text-sm font-semibold">CONDUCT</h3>
              <div className="text-text-subtle border-border-default border text-xs font-medium md:text-sm">
                <div className="border-border-default flex justify-between border-b px-2">
                  <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Neatness</div>
                  <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">{mockReport.neatness}</div>
                </div>
                <div className="border-border-default flex justify-between border-b px-2">
                  <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Punctuality</div>
                  <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">{mockReport.punctuality}</div>
                </div>
                <div className="flex justify-between px-2">
                  <div className="line-clamp-1 w-3/5 flex-1 truncate py-2">Diligence</div>
                  <div className="border-border-default line-clamp-1 w-2/5 truncate border-l py-2 pl-2 text-center">{mockReport.diligence}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle border-border-default flex flex-col border-t p-4">
            <h3 className="text-bg-basic-cyan-contrast text-center text-xs font-semibold md:text-sm">ACADEMIC REPORT</h3>

            <div className="mt-3 w-full">
              <DataTable
                columns={columns}
                data={mockResults}
                totalCount={mockResults.length}
                page={page}
                setCurrentPage={setPage}
                pageSize={10}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                onSelectRows={setSelectedRows}
                fullBorder
                showPagination={false}
                classNames={{
                  tableWrapper: "rounded-none ",
                  tableHeadCell: "px-2",
                  tableBodyCell: "px-0",
                }}
              />
            </div>

            <div className="text-text-default mt-4 flex flex-col gap-4 text-sm font-normal">
              <div>
                <span>OVERALL PERCENTAGE:</span> <span className="font-medium">{mockReport.overallPercentage}%</span>
              </div>
              <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
                <span className="text-text-subtle">Class Teacher&apos;s Comment:</span>
                <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{mockReport.classTeacherComment}</span>
              </div>
              <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
                <span className="text-text-subtle">Principal&apos;s Comment:</span>
                <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{mockReport.principalComment}</span>
              </div>
              <div className="flex flex-col gap-2.5 md:flex-row md:gap-1">
                <span className="text-text-subtle">Next Term Begins:</span>
                <span className="border-border-default inline-block min-w-[150px] flex-1 border-b">{mockReport.nextTermBegins}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
