import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React, { useState } from "react";

type TableProps = {
  id: number;
  studentName: string;
  ca1Score: number;
  ca2Score: number;
  examScore: number;
  totalScore: number;
  grade: string;
  remark: string;
};

const tableData: TableProps = {
  id: 1,
  studentName: "Damilare John",
  ca1Score: 0,
  ca2Score: 0,
  examScore: 0,
  totalScore: 0,
  grade: "F",
  remark: "Fail",
};

const StudentsItem: TableProps[] = Array.from({ length: 12 }, (_, index) => ({
  ...tableData,
  id: index + 1,
}));

export default function ScoreTable() {
  const [openId, setOpenId] = useState<number>(1);
  const handleToggle = (id: number) => setOpenId(prev => (prev == id ? null : id));

  return (
    <div className="md:py0 p-4 md:px-8">
      <div className="hidden md:block">
        <Table className="border-border-default rounded-md border-b">
          <TableHeader className="border-border-default border-b">
            <TableRow className="border-border-default text-text-muted bg-bg-subtle rounded-t-sm! border-1">
              <TableHead className="border-border-default w-12 border-r-1 border-l-1 text-center">S/N</TableHead>
              <TableHead className="border-border-default w-85 border-r-1 border-l-1">Student Name</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">CA 1</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">CA 2</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">Exam Score</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">Total</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">Grade</TableHead>
              <TableHead className="border-border-default w-27 border-r-1 border-l-1 text-center">Remark</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {StudentsItem.map(student => (
              <TableRow key={student.id} className="border-border-default text-text-muted text-sm">
                <TableCell className="border-border-default text-text-default border-r-1 border-l-1 text-center">{student.id}</TableCell>
                <TableCell className="text-text-default flex items-center gap-2">
                  <Avatar username="Damilare John" /> {student.studentName}
                </TableCell>
                <TableCell className="border-border-default border-r-1 border-l-1 text-center">{student.ca1Score}</TableCell>
                <TableCell className="border-border-default border-r-1 border-l-1 text-center">{student.ca2Score}</TableCell>
                <TableCell className="border-border-default border-r-1 border-l-1 text-center">{student.examScore}</TableCell>
                <TableCell className="border-border-default border-r-1 border-l-1 text-center">{student.totalScore}</TableCell>
                <TableCell className="border-border-default border-r-1 border-l-1 text-center">{student.grade}</TableCell>
                <TableCell className="border-border-default border-r-1 border-l text-center">{student.remark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
