import React from "react";
import { ClassHeader } from "./ClassHeader";
import { ClassTable } from "./ClassTable";

export default function Class() {
  return (
    <div className="flex flex-col gap-4">
      <ClassHeader />
      <ClassTable />
    </div>
  );
}
