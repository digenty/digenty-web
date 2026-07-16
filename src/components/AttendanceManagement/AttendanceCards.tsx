import { NumStudentIcon } from "@digenty/icons";
import { useEffect, useState } from "react";
import { AttendanceLevel } from "@/api/types";
import { useLoggedInUser } from "@/hooks/useLoggedInUser";
import { LEVEL_ORDER } from "@/lib/utils";
import { AttendanceLevelTabs } from "./AttendanceLevelTabs";
import { Card } from "./Card";

export const AttendanceCards = ({ levels }: { levels: AttendanceLevel[] }) => {
  const user = useLoggedInUser();

  const hasFullAccess = user.isAdmin || user.isMain || (user?.adminBranchIds?.length ?? 0) > 0;

  const visibleLevels = levels
    .map(level => ({
      ...level,
      classArms: level.classArms.filter(arm => hasFullAccess || user.armIds?.includes(arm.armId)),
    }))
    .filter(level => level.classArms.length > 0)
    .sort((a, b) => (LEVEL_ORDER[a.levelName] ?? 99) - (LEVEL_ORDER[b.levelName] ?? 99));

  const [activeLevelId, setActiveLevelId] = useState<number | null>(visibleLevels[0]?.levelId ?? null);
  const visibleLevelIds = visibleLevels.map(level => level.levelId).join(",");

  useEffect(() => {
    if (!visibleLevels.some(level => level.levelId === activeLevelId)) {
      setActiveLevelId(visibleLevels[0]?.levelId ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLevelIds]);

  if (visibleLevels.length === 0) return null;

  const activeLevel = visibleLevels.find(level => level.levelId === activeLevelId) ?? visibleLevels[0];
  const totalStudents = activeLevel.classArms.reduce((total, arm) => total + arm.numberOfStudentInArm, 0);

  return (
    <div className="space-y-5 md:space-y-6">
      <AttendanceLevelTabs levels={visibleLevels} activeLevelId={activeLevel.levelId} setActiveLevelId={setActiveLevelId} />

      <div className="space-y-4 md:space-y-5">
        <div className="text-text-muted flex items-center gap-3 text-xs font-medium">
          <span>
            {activeLevel.classArms.length} class{activeLevel.classArms.length !== 1 && "es"}
          </span>
          <span className="flex items-center gap-1">
            <NumStudentIcon fill="var(--color-icon-default-muted)" /> {totalStudents} student{totalStudents !== 1 && "s"}
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
          {activeLevel.classArms.map(arm => (
            <Card
              key={arm.armId}
              classname={arm.classArm}
              totalStudents={arm.numberOfStudentInArm.toString()}
              teacherName={arm.classTeacher}
              lastUpdate={arm.lastUpdated}
              attendancePercentage={arm.attendancePercentage}
              armId={arm.armId}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
