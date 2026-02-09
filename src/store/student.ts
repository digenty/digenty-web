import { create } from "zustand";

interface StudentState {
  openWithdraw: boolean;
  openDelete: boolean;
  studentIdsToWithdraw: number[];
  studentIdsToDelete: number[];
  setStudentIdsToWithdraw: (id: number[]) => void;
  setStudentIdsToDelete: (id: number[]) => void;
  setOpenWithdraw: (bool: boolean) => void;
  setOpenDelete: (bool: boolean) => void;
}

export const useStudentStore = create<StudentState>()(set => ({
  openWithdraw: false,
  openDelete: false,
  studentIdsToWithdraw: [],
  studentIdsToDelete: [],
  setStudentIdsToWithdraw: id => set({ studentIdsToWithdraw: id }),
  setStudentIdsToDelete: id => set({ studentIdsToDelete: id }),
  setOpenWithdraw: bool => set({ openWithdraw: bool }),
  setOpenDelete: bool => set({ openDelete: bool }),
}));
