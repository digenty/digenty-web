export interface SubscriptionPlanProps {
  feature: string;
  freemium: boolean | string;
  standard: boolean | string;
  advanced: boolean | string;
  premium: boolean | string;
}

export interface SubscriptionHistoryProps {
  period: string;
  plan: string;
  status: string;
  amount: number;
}

export const subscriptionHistoryTableData: SubscriptionHistoryProps[] = [
  {
    period: "Jan 1, 2025 – Jan 31, 2025",
    plan: "Premium",

    status: "Paid",
    amount: 50000,
  },
  {
    period: "Jan 1, 2025 – Jan 31, 2025",
    plan: "Premium",

    status: "Paid",
    amount: 50000,
  },
  {
    period: "Jan 1, 2025 – Jan 31, 2025",
    plan: "Premium",

    status: "Paid",
    amount: 50000,
  },
  {
    period: "Jan 1, 2025 – Jan 31, 2025",
    plan: "Premium",

    status: "Failed",
    amount: 50000,
  },
];

export const subscriptionTableData: SubscriptionPlanProps[] = [
  {
    feature: "Number of users",
    freemium: "Unlimited",
    standard: "Unlimited",
    advanced: "Unlimited",
    premium: "Unlimited",
  },

  {
    feature: "Administrator Tools",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "User Information Systems",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Students Attendance Management",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Academics / Exams Management",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Result Processing, Publishing & Remote Access",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Students Class Promotion / Transfer Management",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Communications (Bulk SMS)",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },

  {
    feature: "Online Assignments / Home Works & Lesson/Lecture Notes",
    freemium: true,
    standard: false,
    advanced: true,
    premium: true,
  },
  {
    feature: "Parents E-Portal",
    freemium: true,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Online Admission",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Financial summary and Analytics",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Online Fees Payment",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Fees & Bursary Management",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Financial summary and Analytics",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },

  {
    feature: "Online Fees Payment",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Stock keeping and Management (School uniform, textbooks, notebooks etc.)",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Expense Management",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "School Website",
    freemium: false,
    standard: true,
    advanced: true,
    premium: true,
  },
  {
    feature: "Computer-based Testing / Examination (CBT/CBE)",
    freemium: false,
    standard: false,
    advanced: true,
    premium: true,
  },

  {
    feature: "Financial Bookkeeping & Reports",
    freemium: false,
    standard: false,
    advanced: true,
    premium: true,
  },
  {
    feature: "HR / Payroll Management",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
  {
    feature: "Hostel Management",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
  {
    feature: "Transport Management",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
  {
    feature: "LMS (Live class sessions online,online courses etc.)",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },

  {
    feature: "Students E-Portal",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
  {
    feature: "Library Management",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
  {
    feature: "Students Graduation, Transcripts & Alumni",
    freemium: false,
    standard: false,
    advanced: false,
    premium: true,
  },
];
