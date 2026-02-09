import { create } from "zustand";

interface ParentState {
  openWithdraw: boolean;
  openDelete: boolean;
  parentIds: number[];
  setParentIds: (id: number[]) => void;
  setOpenWithdraw: (bool: boolean) => void;
  setOpenDelete: (bool: boolean) => void;
}

export const useParentStore = create<ParentState>()(set => ({
  openWithdraw: false,
  openDelete: false,
  parentIds: [],
  setParentIds: id => set({ parentIds: id }),
  setOpenWithdraw: bool => set({ openWithdraw: bool }),
  setOpenDelete: bool => set({ openDelete: bool }),
}));
