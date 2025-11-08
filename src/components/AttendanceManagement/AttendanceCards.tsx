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
    classname: "JSS 1C",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    // lastUpdate: "None",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 6,
    classname: "JSS 1C",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Today",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 7,
    classname: "JSS 1C",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    lastUpdate: "Yesterday",
    attendancePercentage: "0% Attendance",
  },
  {
    id: 8,
    classname: "JSS 1C",
    totalStudents: "31 Students",
    teacherName: "Mrs. Adebayo • Main Campus",
    // lastUpdate: "None",
    attendancePercentage: "0% Attendance",
  },
];

export default function AttendanceCards() {
  return (
    <div className="space-y-4 md:space-y-5">
      <SearchInput className="bg-bg-input-soft! w-full border-none md:w-80" />

      <ul className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3">
        {attendanceUpdates.map(att => (
          <Card
            key={att.id}
            classname={att.classname}
            totalStudents={att.totalStudents}
            teacherName={att.teacherName}
            lastUpdate={att.lastUpdate as "Today" | "Yesterday" | "None"}
            attendancePercentage={att.attendancePercentage}
          />
        ))}
      </ul>
    </div>
  );
}
