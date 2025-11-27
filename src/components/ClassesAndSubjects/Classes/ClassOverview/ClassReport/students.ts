export interface SubjectResult {
  title: string;
  score: number;
}

export interface StudentSubjects {
  term: string;
  subjects: SubjectResult[];
}

export interface StudentReport {
  id: string;
  name: string;
  avatar: string;
  subjects: StudentSubjects[];
  totalPresent: number;
  totalDays: number;
}

export const students: StudentReport[] = [
  {
    id: "1",
    name: "Ada Peters",
    avatar: "/avatars/1.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
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
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
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
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
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
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "5",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "6",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "7",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "8",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
  {
    id: "9",
    name: "Taiwo Richards",
    avatar: "/avatars/3.png",
    subjects: [
      {
        term: "First Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Second Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
      {
        term: "Third Term",
        subjects: [
          { title: "Mathematics", score: 80 },
          { title: "English", score: 80 },
          { title: "History", score: 80 },
          { title: "Social Studies", score: 80 },
          { title: "PHE", score: 80 },
          { title: "Physics", score: 80 },
        ],
      },
    ],
    totalPresent: 9,
    totalDays: 10,
  },
];
