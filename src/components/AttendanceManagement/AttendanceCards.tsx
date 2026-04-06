import { AttendanceCard } from "@/api/types";
import { Card } from "./Card";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";

export const AttendanceCards = ({ attendance }: { attendance: AttendanceCard[] }) => {
  const user = useLoggedInUser();

  return (
    <div className="space-y-4 md:space-y-5">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {attendance.map((att, index) => {
          if (user.isAdmin || user.isMain || (user?.adminBranchIds?.length ?? 0) > 0 || user.armIds?.includes(att.armId)) {
            return (
              <Card
                key={`${att.armId}-${index}`}
                classname={att.classArm}
                totalStudents={att.numberOfStudentInArm.toString()}
                teacherName={att.classTeacher}
                lastUpdate={att.lastUpdated}
                attendancePercentage={att.attendancePercentage}
                armId={att.armId}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};
