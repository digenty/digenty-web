export interface AttendanceDay {
  date: string;
  present: boolean;
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

export const students: StudentAttendance[] = [
  {
    id: "1",
    name: "Ada Peters",
    avatar: "/avatars/1.png",
    weeks: [
      {
        week: "Week 1",
        days: [
          { date: "2025-06-30", present: true },
          { date: "2025-07-01", present: true },
          { date: "2025-07-02", present: true },
          { date: "2025-07-03", present: false },
          { date: "2025-07-04", present: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 3",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 4",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 5",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 6",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 7",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 8",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 9",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 10",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 11",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
      {
        week: "Week 12",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
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
          { date: "2025-06-30", present: true },
          { date: "2025-07-01", present: false },
          { date: "2025-07-02", present: true },
          { date: "2025-07-03", present: true },
          { date: "2025-07-04", present: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: true },
          { date: "2025-07-09", present: false },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
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
          { date: "2025-06-30", present: true },
          { date: "2025-07-01", present: true },
          { date: "2025-07-02", present: true },
          { date: "2025-07-03", present: true },
          { date: "2025-07-04", present: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: false },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
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
          { date: "2025-06-30", present: true },
          { date: "2025-07-01", present: true },
          { date: "2025-07-02", present: true },
          { date: "2025-07-03", present: true },
          { date: "2025-07-04", present: true },
        ],
      },
      {
        week: "Week 2",
        days: [
          { date: "2025-07-07", present: true },
          { date: "2025-07-08", present: false },
          { date: "2025-07-09", present: true },
          { date: "2025-07-10", present: true },
          { date: "2025-07-11", present: true },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
];
