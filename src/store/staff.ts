import { create } from "zustand";

interface StaffState {
  openDelete: boolean;
  openDeactivation: boolean;
  staffIdToDelete: number | null;
  staffIdToDeactivate: number | null;
  setStaffIdToDelete: (id: number | null) => void;
  setOpenDelete: (bool: boolean) => void;
  setOpenDeactivation: (bool: boolean) => void;
  setStaffIdToDeactivate: (id: number | null) => void;
}

export const useStaffStore = create<StaffState>()(set => ({
  openDelete: false,
  openDeactivation: false,
  staffIdToDelete: null,
  staffIdToDeactivate: null,
  setStaffIdToDelete: id => set({ staffIdToDelete: id }),
  setOpenDelete: bool => set({ openDelete: bool }),
  setOpenDeactivation: bool => set({ openDeactivation: bool }),
  setStaffIdToDeactivate: id => set({ staffIdToDeactivate: id }),
}));
