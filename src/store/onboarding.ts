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
      description: "Define session, branches and school levels",
      isCompleted: false,
      link: "/staff/settings/academic/academic-setup?step=school-structure",
    },
    {
      id: 2,
      title: "Complete Your Classes, Arms and Subjects Setup",
      description: "Define classes, arms and subjects.",
      isCompleted: false,
      link: "/staff/settings/academic/academic-setup?step=class-and-arms",
    },
    {
      id: 3,
      title: "Complete Your Gradings and Assessments Setup",
      description: "Define gradings, assessment types and scores for each level",
      isCompleted: false,
      link: "/staff/settings/academic/academic-setup?step=gradings-and-assessments",
    },
    {
      id: 4,
      title: "Complete Your Result Setup",
      description: "Define how you want your results calculated for each level",
      isCompleted: false,
      link: "/staff/settings/result",
    },
    {
      id: 5,
      title: "Complete Your Admission Number Setup",
      description: "Define admission number format for each level",
      isCompleted: false,
      link: "/staff/settings/academic/academic-setup?step=admission-number",
    },
    {
      id: 6,
      title: "Add Parent Records",
      description: "Import parents first so students can be linked correctly.",
      isCompleted: false,
      link: "/staff/student-and-parent-record/add-parent",
    },
    {
      id: 7,
      title: "Add Student Records",
      description: "Create or import your student database and link each student to the correct parent",
      isCompleted: false,
      link: "/staff/student-and-parent-record/add-student",
    },
    {
      id: 8,
      title: "Invite Staff & Assign Roles",
      description: "Invite teachers, bursars, and admins, then assign their roles, classes, and subjects.",
      isCompleted: false,
      link: "/staff/settings/permissions",
    },
    {
      id: 9,
      title: "Set Up School Fees",
      description: "Define fee items and set prices per level or branch.",
      isCompleted: false,
    },
    {
      id: 10,
      title: "Configure Invoice Settings",
      description: "Customize invoice formats, numbering, due dates, and automated SMS/email reminders.",
      isCompleted: false,
      link: "/staff/settings/invoice",
    },
  ],
  setSteps: steps => set({ steps }),
  updateStepCompleted: (id, isCompleted) =>
    set(state => ({
      steps: state.steps.map(step => (step.id === id ? { ...step, isCompleted } : step)),
    })),
}));
