import { AdmissionStatus, BoardingStatus, Gender, Relationship } from "@/types";
import { DateRange } from "react-day-picker";

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

export type LevelType = "CRECHE" | "KINDERGARTEN" | "NURSERY" | "PRIMARY" | "JUNIOR_SECONDARY" | "SENIOR_SECONDARY";

export interface BranchClassLevel {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  levelName: string;
  levelType: LevelType;
  classNamePrefix: string | null;
  classStart: number | null;
  classEnd: number | null;
  branchId: number;
  schoolId: number;
}

export interface BranchWithClassLevels {
  branch: Branch;
  classLevels: BranchClassLevel[];
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
      assessmentId: number;
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
  numberOfSubmittedSubjects: number;
  status: string;
  numberOfEditRequest: number;
  classArmReportId: number | null;
}

export interface BranchArmReportResponse {
  totalArms: number;
  totalPendingSubmissions: number;
  totalCompletedSubmissions: number;
  branchArmReportResponseDtos: BranchArmReport[];
}

export interface Level {
  branchId: number;
  branchName: string;
  classLevels: ClassLevel[];
}

export interface Role {
  roleId: number;
  roleName: string;
  totalUsers: number;
}

export interface BranchDto {
  branchId: number;
  roleIds: number[];
}

export interface Staff {
  staffId: number;
  fullName: string;
  email: string;
  roleName: string | null;
  status: boolean;
  branchName: string;
  lastLogin: Date;
}

export interface UpdateBranchPayload {
  branchId: number;
  name: string;
  address: string;
}

export interface updateSchoolPayload {
  schoolId: number;
  logo: string;
  adminId: number;
  schoolName: string;
  firstName: string;
  lastName: string;
  motto: string;
  phoneNumber: number;
  country: string;
  currency: string;
  timezone: string;
}

export type NewBranchForm = {
  id: string;
  branchName: string;
  address: string;
  levels: string[];
  isSubmitting: boolean;
};

export type SchoolStructurePayload = {
  name: string;
  currentTerm: string;
  firstTermStartDate?: string;
  firstTermEndDate?: string;
  secondTermStartDate?: string;
  secondTermEndDate?: string;
  thirdTermStartDate?: string;
  thirdTermEndDate?: string;
  branchesAndLevelsDtos: {
    branchId: number;
    levels: string[];
  }[];
};

export interface AssessmentDefaultPayload {
  branchId: number;
  assessments: {
    name: string;
    weight: number;
    assessmentType: string;
  }[];
}

export interface AssessmentPayload {
  branchId?: number;
  levelId?: number;
  assessments: {
    name: string;
    weight: number;
    assessmentType: string;
  }[];
}

export interface GradingDefaultPayload {
  branchId: number;
  gradingDtoList: {
    grade: string;
    upperLimit: number;
    lowerLimit: number;
    remark: string;
  }[];
}

export interface GradingPayload {
  branchId?: number;
  levelId?: number;
  gradingDtoList: {
    grade: string;
    upperLimit: number;
    lowerLimit: number;
    remark: string;
  }[];
}

export interface AdmissionNumberPayload {
  prefix: string;
  numberFormat: string;
  startingNumber: number;
  padding: number;
}

export interface LevelTab {
  label: string;
  levelId: number;
  levelType: string;
}

export interface AssessmentRow {
  name: string;
  weight: string;
}
export interface GradeRow {
  grade: string;
  upperLimit: string;
  lowerLimit: string;
  remark: string;
}

export interface BranchFormPanelProps {
  branchId: number;
  isActive: boolean;
  levelTabs: LevelTab[];
}

export interface LevelTabsContainerProps {
  levels: ClassLevel[];
  activeLevel: ClassLevel | null;
  setActiveLevel: (level: ClassLevel) => void;
  branchId?: number;
}

export interface ClassLevel {
  id: number;
  levelName: string;
  levelType: "CRECHE" | "KINDERGARTEN" | "NURSERY" | "PRIMARY" | "JUNIOR_SECONDARY" | "SENIOR_SECONDARY";
  classNamePrefix: string;
  classStart: number;
  classEnd: number;
}

export interface ClassLevelWithBranch {
  branchId: number;
  id: number;
  levelName: string;
  levelType: "CRECHE" | "KINDERGARTEN" | "NURSERY" | "PRIMARY" | "JUNIOR_SECONDARY" | "SENIOR_SECONDARY";
  classNamePrefix: string;
  classStart: number;
  classEnd: number;
}

export interface BranchLevels {
  branchId: number;
  branchName: string;
  classLevels: ClassLevel[];
}

export interface ClassInLevel {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  levelId: number;
  branchId: number;
  schoolId: number;
}

export interface EditRequestResponseTypes {
  editRequestId: number;
  teacherName: string;
  classArmName: string;
  subjectName: string;
  reason: string;
  additionalDetails: string;
  sessionName: string;
  termName: string;
  dateCreated?: string;
  isApproved: boolean;
  teacherEmail: string;
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

export interface ResultCalculationPayload {
  levelId: number;
  academicSessionId: number;
  calculationMethod: "THIRD_TERM_ONLY" | "CUMULATIVE";
  promotionType: "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE";
  minimumOverallPercentage: number;
  minimumPassGrade: string;
  requiredSubjectIds: number[];
}

export interface ResultSubmissionPayload {
  termsDeadline: [
    {
      termId: number;
      openDate: string;
      closeDate: string;
      autoLockAfterDeadline: boolean;
    },
  ];
}
export interface UpdateSubmissionDeadlinePayload {
  termsDeadline: [
    {
      termId: number;
      openDate: string;
      closeDate: string;
      autoLockAfterDeadline: boolean;
    },
  ];
}

export interface TermDeadlineState {
  openDate: DateRange | undefined;
  closeDate: DateRange | undefined;
  autoLockAfterDeadline: boolean;
}

export interface PrincaleCommentPayload {
  levelId?: number;
  rows: {
    minPercentage: number;
    maxPercentage: number;
    comment: string;
  }[];
}

export interface SchoolGrading {
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
  levelId: number;
  branchId: number;
  schoolId: number;
  isDefault: boolean;
}

export interface Levelsubject {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  branchId: number;
  schoolId: number;
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

export interface ResultCalculationPayload {
  levelId: number;
  academicSessionId: number;
  calculationMethod: "THIRD_TERM_ONLY" | "CUMULATIVE";
  promotionType: "PROMOTE_ALL" | "MANUAL" | "BY_PERFORMANCE";
  minimumOverallPercentage: number;
  minimumPassGrade: string;
  requiredSubjectIds: number[];
}

export interface ResultSubmissionPayload {
  termsDeadline: [
    {
      termId: number;
      openDate: string;
      closeDate: string;
      autoLockAfterDeadline: boolean;
    },
  ];
}

export interface TermDeadlineState {
  openDate: DateRange | undefined;
  closeDate: DateRange | undefined;
  autoLockAfterDeadline: boolean;
}

export interface PrincaleCommentPayload {
  levelId?: number;
  rows: {
    minPercentage: number;
    maxPercentage: number;
    comment: string;
  }[];
}

export interface SchoolGrading {
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
  levelId: number;
  branchId: number;
  schoolId: number;
  isDefault: boolean;
}

export interface Levelsubject {
  id: number;
  uuid: string;
  active: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  branchId: number;
  schoolId: number;
}

export interface StudentCumulative {
  studentId: number;
  studentName: string;
  firstTermPercentage: number;
  secondTermPercentage: number;
  thirdTermPercentage: number;
  cumulativePercentage: number;
}

export interface CumulativeReport {
  studentCumulative: StudentCumulative[];
}

export interface PromotionBySubjectStudent {
  subjectId: number;
  subjectName: string;
  score: number;
}

export interface PromotionBySubjectReport {
  studentId: number;
  studentName: string;
  subjects: PromotionBySubjectStudent[];
  total: number;
  percentage: number;
}

export interface PromotionBySubjectReportResponse {
  levelId: number;
  students: PromotionBySubjectReport[];
  stats: {
    promoted: number;
    repeated: number;
    pending: number;
  };
}

export interface ResultSettings {
  academicSessionId: number;
  calculationMethod: string;
  classId: number;
  id: number;
  minimumOverallPercentage: number;
  minimumPassGrade: string;
  promotionType: "BY_PERFORMANCE" | "PROMOTE_ALL" | "MANUAL";
  requiredSubjectIds: number[];
}
