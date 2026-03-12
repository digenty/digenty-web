import { AdmissionStatus, BoardingStatus, Gender, Relationship } from "@/types";

export interface Branch {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  schoolId: number;
  name: string | null;
  address: string | null;
  phoneNumber: string;
  email: string;
  branchHeadId: number;
  country: string | null;
}

export interface ClassType {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  branchId: number;
  schoolId: number;
}

export interface Department {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  headOfDepartmentId: number | null;
  name: string;
  classroomId: number;
  branchId: number;
  schoolId: number;
}

export interface Arm {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  classId: number;
  classTeacherId: number | null;
  name: string;
  branchId: number;
  schoolId: number;
  departmentId: number;
}

export interface Student {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  gender: Gender;
  boardingStatus: BoardingStatus;
  dateOfBirth: string;
  address: string;
  emergencyContactName: string;
  emergencyContact: string;
  phoneNumber: string;
  secondaryPhoneNumber: string;
  studentStatus: AdmissionStatus;
  admissionNumber: string;
  medicalInformation: string;
  nationality: string;
  stateOfOrigin: string;
  joinedSchoolTerm: string;
  joinedSchoolSession: string;
  branch: string;
  class: string;
  departmentId: number | null;
  armId: number | null;
  arm: string;
  image: string | null;
  tags: string[];
  linkedParents: number[];
}

export interface Parent {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  image: string | null;
  middleName: string;
  email: string;
  phoneNumber: string;
  branch: string;
  gender: Gender;
  relationship: Relationship;
  nationality: string;
  stateOfOrigin: string;
  address: string;
  secondaryPhoneNumber: string;
  tags: string[];
  linkedStudents: { id: number; fullName: string; avatar: string | null }[];
}

export interface AttendanceCard {
  armId: number;
  classArm: string;
  classTeacher: string;
  numberOfStudentInArm: number;
  attendancePercentage: number;
  lastUpdated: Date;
}
export interface Attendance {
  classArmAttendanceCardList: AttendanceCard[];
  numberOfClassAttendanceTaken: number;
  overallAttendancePercentage: number;
  totalClasses: number;
  totalStudents: number;
}

export interface Term {
  termId: number;
  term: string;
  isActiveTerm: boolean;
  startDate: string;
  endDate: string;
}

export interface Terms {
  academicSessionName: string;
  isActiveSession: boolean;
  terms: Term[];
}

export interface StudentAttendance {
  studentId: number;
  studentName: string;
  avatar?: string;
  isPresent: boolean;
}

export interface Grading {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  grade: string;
  upperLimit: number;
  lowerLimit: number;
  remark: string;
  classId: number;
  branchId: number;
  schoolId: number;
  isDefault: boolean;
}

export interface Assessment {
  assessmentId: number;
  assessmentName: string;
  score: number;
  weight: number;
}

export interface StudentUpdate {
  studentId: number;
  studentName: string;
  assessmentScores: {
    CA1: {
      assessmentId: number;
      assessmentName: string;
      score: number;
      weight: number;
    };
    CA2: {
      assessmentId: number;
      assessmentName: string;
      score: number;
      weight: number;
    };
    Exam: {
      assessmentId: number;
      assessmentName: string;
      score: number;
      weight: number;
    };
  };
  total: number;
  grade: string;
  remark: string;
}

export interface SubjectReport {
  subjectName: string;
  assessments: [
    {
      assessmentName: string;
      score: number;
      weight: number;
    },
  ];
  total: number;
  grade: string;
  remark: string;
}

export interface StudentReport {
  schoolName: string;
  sessionName: string;
  studentId: number;
  studentName: string;
  className: string;
  totalSchoolDays: number;
  totalPresent: number;
  totalAbsent: number;
  neatness: string | null;
  punctuality: string | null;
  diligence: string | null;
  subjectReports: SubjectReport[];
  overallPercentage: number;
  classTeacherComment: string | null;
  principalComment: string | null;
  nextTermBegins: string;
}

export interface BranchReport {
  branchId: number;
  branchName: string;
  BranchHeadName: string;
  numberOfClassArm: number;
  numberOfClassTeacherSubmitted: number | null;
  numberOfPendingApprovals: number | null;
}

export interface AllBranchesReport {
  totalBranchesInSchool: number;
  totalArmsInSchool: number;
  totalPendingArmSubmission: number;
  totalArmSubmitted: number;
  totalPublishedReport: number;
  branchReports: BranchReport[];
}

export interface BranchArmReport {
  classId: number;
  armId: number;
  classArmName: string;
  classTeacherName: string;
  numberOfSubjects: number;
  status: string;
  numberOfEditRequest: number;
}

export interface BranchArmReportResponse {
  totalArms: number;
  totalPendingSubmissions: number;
  totalCompletedSubmissions: number;
  branchArmReportResponseDtos: BranchArmReport[];
}

export interface UpdateAcademicPayload {
  name: string;
  currentTerm: string;
  firstTermStartDate: string;
  firstTermEndDate: string;
  secondTermStartDate: string;
  secondTermEndDate: string;
  thirdTermStartDate: string;
  thirdTermEndDate: string;
}

export interface AcademicSession {
  id: number;
  name: string;
  isActive: boolean;
  schoolId: number;
  currentTerm: string;
  firstTermStartDate?: string;
  firstTermEndDate?: string;
  secondTermStartDate?: string;
  secondTermEndDate?: string;
  thirdTermStartDate?: string;
  thirdTermEndDate?: string;
}

export interface UpdateAdmissionNumber {
  prefix: string;
  numberFormat: string;
  startingNumber: number;
  padding: number;
}
export interface Level {
  branchId: number;
  branchName: string;
  classLevels: [
    {
      ids: number;
      levelName: string;
      levelType: string;
      classNamePrefix: string | undefined;
      classStart: string | undefined;
      classEnd: string | undefined;
    },
  ];
}

export interface UpdateGradingDefaultPayload {
  branchId: number;
  levelIds: [];
  gradingDtoList: {
    grade: string;
    upperLimit: number;
    lowerLimit: number;
    remark: string;
  }[];
}
