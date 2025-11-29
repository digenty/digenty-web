export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  score: number; // 0–100
}

export interface TermResult {
  term: "24/25 First Term" | "24/25 Second Term" | "24/25 Third Term";
  subjects: SubjectScore[];
  totalPercentage: number; // 0–100
}

export interface StudentRow {
  id: string;
  serial: number;
  name: string;
  avatar: string;
  terms: TermResult[];
}

const SUBJECTS: Omit<SubjectScore, "score">[] = [
  { subjectId: "sub1", subjectName: "Mathematics" },
  { subjectId: "sub2", subjectName: "English" },
  { subjectId: "sub3", subjectName: "Biology" },
  { subjectId: "sub4", subjectName: "Chemistry" },
  { subjectId: "sub5", subjectName: "Physics" },
  { subjectId: "sub6", subjectName: "Economics" },
  { subjectId: "sub7", subjectName: "Social Sciences" },
  { subjectId: "sub8", subjectName: "Social Sciences" },
  { subjectId: "sub9", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciences" },
  { subjectId: "sub10", subjectName: "Social Sciencesasfafafsfffwefew" },
];

const randomScore = () => Math.floor(Math.random() * 60) + 40;

// Calculate term percentage
const calculatePercentage = (subjects: SubjectScore[]) => {
  const total = subjects.reduce((sum, s) => sum + s.score, 0);
  const maxTotal = subjects.length * 100;
  return Math.round((total / maxTotal) * 100);
};

export const students: StudentRow[] = Array.from({ length: 25 }).map((_, i) => {
  const generateTerm = (term: TermResult["term"]) => {
    const scoredSubjects: SubjectScore[] = SUBJECTS.map(sub => ({
      ...sub,
      score: term === "24/25 First Term" ? 40 : term === "24/25 Second Term" ? 50 : 70,
    }));

    return {
      term,
      subjects: scoredSubjects,
      totalPercentage: calculatePercentage(scoredSubjects),
    };
  };

  return {
    id: `${i + 1}`,
    serial: i + 1,
    name: "Damilare John",
    avatar: "/avatar.png",
    terms: [generateTerm("24/25 First Term"), generateTerm("24/25 Second Term"), generateTerm("24/25 Third Term")],
  };
});

// What the data should look like
// {
//   "id": "1",
//   "serial": 1,
//   "name": "Damilare John",
//   "avatar": "/avatar.png",
//   "terms": [
//     {
//       "term": "1st Term",
//       "subjects": [
//         { "subjectId": "sub1", "subjectName": "Mathematics", "score": 75 },
//         { "subjectId": "sub2", "subjectName": "English", "score": 82 },
//         { "subjectId": "sub3", "subjectName": "Biology", "score": 90 },
//         { "subjectId": "sub4", "subjectName": "Chemistry", "score": 88 },
//         { "subjectId": "sub5", "subjectName": "Physics", "score": 67 },
//         { "subjectId": "sub6", "subjectName": "Economics", "score": 92 }
//       ],
//       "totalPercentage": 82
//     },
//     {
//       "term": "2nd Term",
//       "subjects": [...],
//       "totalPercentage": 79
//     },
//     {
//       "term": "3rd Term",
//       "subjects": [...],
//       "totalPercentage": 84
//     }
//   ]
// }
