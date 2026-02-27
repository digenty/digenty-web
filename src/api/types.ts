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
  emergencyContactNumber: string;
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
  branchId: number;
  gender: Gender;
  relationship: Relationship;
  nationality: string;
  stateOfOrigin: string;
  address: string;
  secondaryPhoneNumber: string;
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
