import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (bool: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(set => ({
  isSidebarOpen: false,
  setIsSidebarOpen: bool => set({ isSidebarOpen: bool }),
}));
