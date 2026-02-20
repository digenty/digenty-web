export interface ClassReportResponse {
  classArmStudentReports: {
    studentName: string;
    subjectScores: {
      subjectName: string;
      score: number;
    }[];
    total: number;
    percentage: number;
    position: number;
  }[];
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  score: number;
}

export interface TermResult {
  term: string;
  subjects: SubjectScore[];
  totalPercentage: number;
  position: number;
}

export interface StudentRow {
  id: string;
  serial: number;
  name: string;
  avatar: string;
  terms: TermResult[];
}

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
