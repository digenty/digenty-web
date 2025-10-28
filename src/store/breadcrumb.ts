import { Crumb } from "@/types";
import { create } from "zustand";

interface BreadcrumbState {
  breadcrumbs: Crumb[];
  setBreadcrumbs: (crumb: Crumb[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>()(set => ({
  breadcrumbs: [],
  setBreadcrumbs: crumb => set({ breadcrumbs: crumb }),
}));
