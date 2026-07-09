import { BillFill, BookOpenFill, DashboardHorizontalFill, Settings4Fill } from "@digenty/icons";

export const parentNav = [
  {
    title: "",
    menu: [
      {
        title: "Overview",
        url: "parents/dashboard",
        icon: DashboardHorizontalFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Fees",
        url: "parents/parent-fees",
        icon: BillFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Academic Record",
        url: "parents/academic-record",
        icon: BookOpenFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Biodata",
        url: "parents/bio-data",
        icon: BookOpenFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Settings",
        url: "parents/parent-setting",
        icon: Settings4Fill,
      },
    ],
  },
];
