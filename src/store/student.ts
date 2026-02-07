import { create } from "zustand";

interface StudentState {
  openWithdraw: boolean;
  openDelete: boolean;
  setOpenWithdraw: (bool: boolean) => void;
  setOpenDelete: (bool: boolean) => void;
}

export const useStudentStore = create<StudentState>()(set => ({
  openWithdraw: false,
  openDelete: false,
  setOpenWithdraw: bool => set({ openWithdraw: bool }),
  setOpenDelete: bool => set({ openDelete: bool }),
}));
