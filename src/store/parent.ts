import { create } from "zustand";

type StudentFilterState = {
  selectedStudentId?: number;
  selectedStudentName?: string;
  setStudent: (id: number, name: string) => void;
};

export const useStudentFilterStore = create<StudentFilterState>(set => ({
  selectedStudentId: undefined,
  selectedStudentName: "",
  setStudent: (id, name) =>
    set({
      selectedStudentId: id,
      selectedStudentName: name,
    }),
}));
