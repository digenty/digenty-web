import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  activeNav: string;
  setIsSidebarOpen: (bool: boolean) => void;
  setActiveNav: (nav: string) => void;
}

export const useSidebarStore = create<SidebarState>()(set => ({
  isSidebarOpen: true,
  activeNav: "dashboard",
  setIsSidebarOpen: bool => set({ isSidebarOpen: bool }),
  setActiveNav: nav => set({ activeNav: nav }),
}));
