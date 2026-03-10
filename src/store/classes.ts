import { create } from "zustand";

interface ClassesState {
  openNotifyTeacher: boolean;
  setOpenNotifyTeacher: (bool: boolean) => void;

  // Invoice PAyment modals
  isPaymentDetailsOpen: boolean;
  setIsPaymentDetailsOpen: (bool: boolean) => void;
  deletePayment: boolean;
  setDeletePayment: (bool: boolean) => void;
}

export const useClassesStore = create<ClassesState>()(set => ({
  openNotifyTeacher: false,
  setOpenNotifyTeacher: (bool: boolean) => set({ openNotifyTeacher: bool }),
  // Invoice PAyment modals
  isPaymentDetailsOpen: false,
  setIsPaymentDetailsOpen: (bool: boolean) => set({ isPaymentDetailsOpen: bool }),
  deletePayment: false,
  setDeletePayment: (bool: boolean) => set({ deletePayment: bool }),
}));

export const LEVELS = [
  { label: "Creche", value: "CRECHE" },
  { label: "Kindergarten", value: "KINDERGARTEN" },
  { label: "Nursery", value: "NURSERY" },
  { label: "Primary", value: "PRIMARY" },
  { label: "Secondary", value: "SECONDARY" },
] as const;
