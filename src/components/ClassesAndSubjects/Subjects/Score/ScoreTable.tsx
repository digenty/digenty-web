"use client";

import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { ScoreProps } from "./types";

import { scoreColumns } from "./ScoreColumns";
import { DataTable } from "@/components/DataTable";

const tableData: ScoreProps = {
  id: 1,
  studentName: "Damilare John",
  ca1Score: 0,
  ca2Score: 0,
  examScore: 0,
  totalScore: 0,
  grade: "F",
  remark: "Fail",
};

const StudentsItem: ScoreProps[] = Array.from({ length: 12 }, (_, index) => ({
  ...tableData,
  id: index + 1,
}));

export default function ScoreTable() {
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);
  const handleToggle = (id: number) => setOpenId(prev => (prev == id ? null : id));

  return (
    <div className="md:py0 p-4 md:px-8">
      <div className="hidden md:block">
        <DataTable
          pageSize={10}
          clickHandler={() => {}}
          rowSelection={{}}
          setRowSelection={() => {}}
          onSelectRows={() => {}}
          columns={scoreColumns}
          data={StudentsItem}
          totalCount={StudentsItem.length}
          page={page}
          setCurrentPage={setPage}
          fullBorder
        />
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {StudentsItem.map(std => {
          const isOpen = openId === std.id;
          return (
            <li key={std.id} className="border-border-default w-full rounded-md border">
              <button
                type="button"
                onClick={() => handleToggle(std.id)}
                aria-expanded={isOpen}
                className="bg-bg-basic-gray-subtle flex w-full items-center justify-between p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar username={std.studentName} className="h-10 w-10" />
                  <div className="text-left">
                    <div className="text-text-default text-text-default text-sm font-medium">{std.studentName}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-text-default text-sm font-normal">{std.totalScore}</div>
                      <Badge className="text-text-subtle border-border-default bg-bg-badge-default h-4 w-4 rounded-md py-2 text-sm font-medium">
                        {std.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div>{isOpen ? <ArrowUp fill="var(--color-icon-default-muted)" /> : <ArrowDown fill="var(--color-icon-default-muted)" />}</div>
              </button>
              <div
                className={`transition-all duration-200 ${isOpen ? "border-border-default flex max-h-96 flex-col border opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    CA 1
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.ca1Score}</span>
                </div>
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    CA 2
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.ca2Score}</span>
                </div>
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    Exam Score
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.examScore}</span>
                </div>
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    Total
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.totalScore}</span>
                </div>
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    Grade
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.grade}</span>
                </div>
                <div className="border-border-default grid grid-cols-2 items-center border-b">
                  <span className="bg-bg-basic-gray-subtle text-text-muted border-border-default flex items-center justify-center border-r p-4">
                    Remark
                  </span>
                  <span className="text-text-default flex items-center justify-center p-4">{std.remark}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
