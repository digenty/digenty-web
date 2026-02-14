import { AttendanceCard } from "@/api/types";
import { SearchInput } from "../SearchInput";
import { Card } from "./Card";

const attendanceUpdates = [
  {
    id: 0,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Today",
    attendancePercentage: "89% Attendance",
  },
  {
    id: 1,
    classname: "JSS 1B",
    totalStudents: "32 Students",
    teacherName: "Mr. John • Main Campus",
    lastUpdate: "Yesterday",
    attendancePercentage: "93% Attendance",
  },
  {
    id: 2,
    classname: "JSS 1A",
    totalStudents: "32 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    // lastUpdate: "None",
    attendancePercentage: "89% Attendance",
  },
  {
    id: 3,
    classname: "JSS 1B",
    totalStudents: "32 Students",
    teacherName: "Mr. John • Main Campus",
    lastUpdate: "Today",
    attendancePercentage: "93% Attendance",
  },
  {
    id: 4,
    classname: "JSS 1C",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Yesterday",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 5,
    classname: "JSS 1D",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    // lastUpdate: "None",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 6,
    classname: "JSS 2A",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Today",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 7,
    classname: "JSS 2B",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Yesterday",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 8,
    classname: "JSS 3A",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    attendancePercentage: "0% Attendance",
  },
];

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
