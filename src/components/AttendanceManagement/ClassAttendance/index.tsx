"use client";
import { usePathname } from "next/navigation";
import { AttendanceTable } from "./AttendanceTable";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";

export const ClassAttendance = () => {
  const path = usePathname();
  const classGroup = path.split("/").pop() ?? "";

  return (
    <div className="space-y-6">
      <ClassAttendanceHeader classname={classGroup.replace("-", " ")} />
      <AttendanceTable />
    </div>
  );
};
