export interface AttendanceDay {
  date: string;
  isPresent: boolean;
}

export interface AttendanceWeek {
  week: string;
  days: AttendanceDay[];
}

export interface StudentAttendance {
  studentId: number;
  studentName: string;
  totalSchoolDays: number;
  totalPresent: number;
  totalAbsent: number;
  attendancePercentage: number;
  weeks: AttendanceWeek[];
}

export const students2: StudentAttendance[] = [
  {
    studentId: 1,
    studentName: "John Doe",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
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
  },
  {
    studentId: 2,
    studentName: "Mary Johnson",
    totalSchoolDays: 6,
    totalPresent: 6,
    totalAbsent: 0,
    attendancePercentage: 100,
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
  },
  {
    studentId: 3,
    studentName: "David Williams",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
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
  },
  {
    studentId: 4,
    studentName: "Sophia Brown",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
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
  },
  {
    studentId: 5,
    studentName: "James Jones",
    totalSchoolDays: 6,
    totalPresent: 3,
    totalAbsent: 3,
    attendancePercentage: 50,
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
  },
  {
    studentId: 6,
    studentName: "Olivia Garcia",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
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
  },
  {
    studentId: 7,
    studentName: "Liam Martinez",
    totalSchoolDays: 6,
    totalPresent: 5,
    totalAbsent: 1,
    attendancePercentage: 83.3,
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
  },
  {
    studentId: 8,
    studentName: "Emma Rodriguez",
    totalSchoolDays: 6,
    totalPresent: 2,
    totalAbsent: 4,
    attendancePercentage: 33.3,
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
  },
  {
    studentId: 9,
    studentName: "Noah Hernandez",
    totalSchoolDays: 6,
    totalPresent: 6,
    totalAbsent: 0,
    attendancePercentage: 100,
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
  },
  {
    studentId: 10,
    studentName: "Ava Wilson",
    totalSchoolDays: 6,
    totalPresent: 4,
    totalAbsent: 2,
    attendancePercentage: 66.7,
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
  },
];
