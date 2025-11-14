"use client";
import { usePathname } from "next/navigation";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";

export const ClassAttendance = () => {
  const path = usePathname();
  const classGroup = path.split("/").pop() ?? "";
  return (
    <div>
      <ClassAttendanceHeader classname={classGroup.replace("-", " ")} />
    </div>
  );
};
