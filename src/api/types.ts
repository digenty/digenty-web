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

export interface Class {
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
