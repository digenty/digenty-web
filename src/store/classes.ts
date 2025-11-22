import { create } from "zustand";

interface ClassesState {
  openNotifyTeacher: boolean;
  setOpenNotifyTeacher: (bool: boolean) => void;
}

export const useClassesStore = create<ClassesState>()(set => ({
  openNotifyTeacher: false,
  setOpenNotifyTeacher: (bool: boolean) => set({ openNotifyTeacher: bool }),
}));
