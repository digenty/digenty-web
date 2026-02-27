import { BranchDto } from "@/api/types";

export interface AddRolePayload {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface AddStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  branchAssignmentDtos: BranchDto[];
}
