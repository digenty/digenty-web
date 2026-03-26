import { create } from "zustand";

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  link?: string;
}

interface OnboardingState {
  steps: OnboardingStep[];
  setSteps: (steps: OnboardingStep[]) => void;
  updateStepCompleted: (id: number, isCompleted: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>()(set => ({
  steps: [
    {
      id: 1,
      title: "Complete Your Academic Setup",
      description: "Define sessions, levels, classes, subjects, and admission numbering.",
      isCompleted: true,
      link: "/staff/settings/academic",
    },
    {
      id: 2,
      title: "Add Parent Records",
      description: "Import parents first so students can be linked correctly.",
      isCompleted: false,
      link: "/staff/student-and-parent-record/add-parent",
    },
    {
      id: 3,
      title: "Add Student Records",
      description: "Create or import your student database and link each student to the correct parent",
      isCompleted: false,
      link: "/staff/student-and-parent-record/add-student",
    },
    {
      id: 4,
      title: "Invite Staff & Assign Roles",
      description: "Invite teachers, bursars, and admins, then assign their roles, classes, and subjects.",
      isCompleted: false,
      link: "/staff/settings/permissions",
    },
    // {
    //   id: 5,
    //   title: "Set Up School Fees",
    //   description: "Define fee items and set prices per level or branch.",
    //   isCompleted: false,
    // },
    // {
    //   id: 6,
    //   title: "Configure Invoice Settings",
    //   description:
    //     "Customize invoice formats, numbering, due dates, and automated SMS/email reminders.",
    //   isCompleted: false,
    //   link: "/staff/settings/invoice",
    // },
  ],
  setSteps: steps => set({ steps }),
  updateStepCompleted: (id, isCompleted) =>
    set(state => ({
      steps: state.steps.map(step => (step.id === id ? { ...step, isCompleted } : step)),
    })),
}));
