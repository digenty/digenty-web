"use client";
import { usePathname } from "next/navigation";
import { AttendanceTable } from "./AttendanceTable";
import { ClassAttendanceHeader } from "./ClassAttendanceHeader";
import { useGetArmAttendance } from "@/hooks/queryHooks/useAttendance";

export const ClassAttendance = () => {
  const path = usePathname();
  const classGroup = path.split("/").pop() ?? "";
  const { data, isPending } = useGetArmAttendance({ armId: Number(classGroup), limit: 200, page: 1 });

  return (
    <div className="space-y-6">
      <ClassAttendanceHeader classname={classGroup.replace("-", " ")} />
      <AttendanceTable />
    </div>
  );
};
