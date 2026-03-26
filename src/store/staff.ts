import { create } from "zustand";

import { Staff } from "@/api/types";

interface StaffState {
  openDelete: boolean;
  openDeactivation: boolean;
  openMakeBranchAdmin: boolean;
  staffIdToDelete: number | null;
  staffIdToDeactivate: number | null;
  staffToMakeAdmin: Staff | null;
  setStaffIdToDelete: (id: number | null) => void;
  setOpenDelete: (bool: boolean) => void;
  setOpenDeactivation: (bool: boolean) => void;
  setOpenMakeBranchAdmin: (bool: boolean) => void;
  setStaffIdToDeactivate: (id: number | null) => void;
  setStaffToMakeAdmin: (staff: Staff | null) => void;
}

export const useStaffStore = create<StaffState>()(set => ({
  openDelete: false,
  openDeactivation: false,
  openMakeBranchAdmin: false,
  staffIdToDelete: null,
  staffIdToDeactivate: null,
  staffToMakeAdmin: null,
  setStaffIdToDelete: id => set({ staffIdToDelete: id }),
  setOpenDelete: bool => set({ openDelete: bool }),
  setOpenDeactivation: bool => set({ openDeactivation: bool }),
  setOpenMakeBranchAdmin: bool => set({ openMakeBranchAdmin: bool }),
  setStaffIdToDeactivate: id => set({ staffIdToDeactivate: id }),
  setStaffToMakeAdmin: staff => set({ staffToMakeAdmin: staff }),
}));
