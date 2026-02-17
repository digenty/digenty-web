export interface AttendanceDay {
  date: string;
  isPresent: boolean;
}

export interface AttendanceWeek {
  week: string;
  days: AttendanceDay[];
}

export interface StudentAttendance {
  id: string;
  name: string;
  avatar: string;
  weeks: AttendanceWeek[];
  totalPresent: number;
  totalDays: number;
}

interface StudentAttendance2 {
  studentId: number;
  studentName: string;
  totalSchoolDays: number;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
  studentTermAttendances: AttendanceDay[];
}

export const students: StudentAttendance[] = [
  {
    id: "1",
    name: "Ada Peters",
    avatar: "/avatars/1.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: false },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 3",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 4",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 5",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 6",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 7",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 8",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 9",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 10",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 11",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
      {
        week: "Week 12",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },

  {
    id: "2",
    name: "Tari Lawson",
    avatar: "/avatars/2.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: false },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: true },
          { date: "2025-07-09", isPresent: false },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 8,
    totalDays: 10,
  },

  {
    id: "3",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "4",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "5",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "6",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "7",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "8",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "9",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "10",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "11",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "12",
    name: "Boma Richards",
    avatar: "/avatars/3.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", isPresent: true },
          { date: "2025-07-01", isPresent: true },
          { date: "2025-07-02", isPresent: true },
          { date: "2025-07-03", isPresent: true },
          { date: "2025-07-04", isPresent: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", isPresent: true },
          { date: "2025-07-08", isPresent: false },
          { date: "2025-07-09", isPresent: true },
          { date: "2025-07-10", isPresent: true },
          { date: "2025-07-11", isPresent: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
];

export const students2: StudentAttendance2[] = [
  {
    studentId: 1,
    studentName: "John Doe",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
    studentTermAttendances: [
      { date: "2026-01-05", isPresent: true },
      { date: "2026-01-12", isPresent: true },
      { date: "2026-02-03", isPresent: false },
      { date: "2026-02-14", isPresent: true },
      { date: "2026-03-01", isPresent: true },
      { date: "2026-03-18", isPresent: true },
    ],
  },
  {
    studentId: 2,
    studentName: "Mary Johnson",
    totalSchoolDays: 6,
    totalPresent: 6,
    totalAbsent: 0,
    attendancePercentage: 100,
    studentTermAttendances: [
      { date: "2026-01-07", isPresent: true },
      { date: "2026-01-20", isPresent: true },
      { date: "2026-02-06", isPresent: true },
      { date: "2026-02-19", isPresent: true },
      { date: "2026-03-05", isPresent: true },
      { date: "2026-03-22", isPresent: true },
    ],
  },
  {
    studentId: 3,
    studentName: "David Williams",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
    studentTermAttendances: [
      { date: "2026-01-03", isPresent: false },
      { date: "2026-01-15", isPresent: true },
      { date: "2026-02-02", isPresent: true },
      { date: "2026-02-25", isPresent: false },
      { date: "2026-03-10", isPresent: true },
      { date: "2026-03-28", isPresent: true },
    ],
  },
  {
    studentId: 4,
    studentName: "Sophia Brown",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
    studentTermAttendances: [
      { date: "2026-01-09", isPresent: true },
      { date: "2026-01-21", isPresent: true },
      { date: "2026-02-08", isPresent: true },
      { date: "2026-02-18", isPresent: false },
      { date: "2026-03-07", isPresent: true },
      { date: "2026-03-24", isPresent: true },
    ],
  },
  {
    studentId: 5,
    studentName: "James Jones",
    totalSchoolDays: 6,
    totalPresent: 3,
    totalAbsent: 3,
    attendancePercentage: 50,
    studentTermAttendances: [
      { date: "2026-01-11", isPresent: false },
      { date: "2026-01-25", isPresent: true },
      { date: "2026-02-10", isPresent: false },
      { date: "2026-02-23", isPresent: true },
      { date: "2026-03-12", isPresent: false },
      { date: "2026-03-29", isPresent: true },
    ],
  },
  {
    studentId: 6,
    studentName: "Olivia Garcia",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
    studentTermAttendances: [
      { date: "2026-01-06", isPresent: true },
      { date: "2026-01-19", isPresent: false },
      { date: "2026-02-05", isPresent: true },
      { date: "2026-02-17", isPresent: true },
      { date: "2026-03-03", isPresent: false },
      { date: "2026-03-20", isPresent: true },
    ],
  },
  {
    studentId: 7,
    studentName: "Liam Martinez",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
    studentTermAttendances: [
      { date: "2026-01-08", isPresent: true },
      { date: "2026-01-22", isPresent: true },
      { date: "2026-02-04", isPresent: true },
      { date: "2026-02-16", isPresent: false },
      { date: "2026-03-09", isPresent: true },
      { date: "2026-03-26", isPresent: true },
    ],
  },
  {
    studentId: 8,
    studentName: "Emma Rodriguez",
    totalSchoolDays: 6,
    totalPresent: 2,
    totalAbsent: 4,
    attendancePercentage: 33.3,
    studentTermAttendances: [
      { date: "2026-01-04", isPresent: false },
      { date: "2026-01-18", isPresent: false },
      { date: "2026-02-09", isPresent: true },
      { date: "2026-02-27", isPresent: false },
      { date: "2026-03-14", isPresent: true },
      { date: "2026-03-30", isPresent: false },
    ],
  },
  {
    studentId: 9,
    studentName: "Noah Hernandez",
    totalSchoolDays: 6,
    totalPresent: 6,
    totalAbsent: 0,
    attendancePercentage: 100,
    studentTermAttendances: [
      { date: "2026-01-02", isPresent: true },
      { date: "2026-01-16", isPresent: true },
      { date: "2026-02-07", isPresent: true },
      { date: "2026-02-20", isPresent: true },
      { date: "2026-03-11", isPresent: true },
      { date: "2026-03-27", isPresent: true },
    ],
  },
  {
    studentId: 10,
    studentName: "Ava Wilson",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
    studentTermAttendances: [
      { date: "2026-01-10", isPresent: true },
      { date: "2026-01-24", isPresent: false },
      { date: "2026-02-11", isPresent: true },
      { date: "2026-02-26", isPresent: true },
      { date: "2026-03-15", isPresent: false },
      { date: "2026-03-31", isPresent: true },
    ],
  },
];
