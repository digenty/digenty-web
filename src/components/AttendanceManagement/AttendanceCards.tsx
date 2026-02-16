import { AttendanceCard } from "@/api/types";
import { SearchInput } from "../SearchInput";
import { Card } from "./Card";
import { useCreateAttendanceSheet } from "@/hooks/queryHooks/useAttendance";

export const AttendanceCards = ({ attendance }: { attendance: AttendanceCard[] }) => {
  
  return (
    <div className="space-y-4 md:space-y-5">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {attendance.map(att => (
          <Card
            key={att.classArm}
            classname={att.classArm}
            totalStudents={att.numberOfStudentInArm.toString()}
            teacherName={att.classTeacher}
            lastUpdate={att.lastUpdated}
            attendancePercentage={`${att.attendancePercentage}%`}
            armId={att.armId}
          />
        ))}
      </ul>
    </div>
  );
};
