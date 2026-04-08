import { BagFill } from "@/components/Icons/BagFill";
import { BillFill } from "@/components/Icons/BillFill";
import { BookOpenFill } from "@/components/Icons/BookOpenFill";
import { DashboardHorizontalFill } from "@/components/Icons/DashboardHorizontalFill";
import { Settings4Fill } from "@/components/Icons/Settings4Fill";

export const parentNav = [
  {
    title: "",
    menu: [
      {
        title: "Overview",
        url: "parent-dashboard",
        icon: DashboardHorizontalFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Fees",
        url: "parent-fees",
        icon: BillFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Academic Record",
        url: "academic-record",
        icon: BookOpenFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Biodata",
        url: "bio-data",
        icon: BagFill,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Settings",
        url: "parent-settings",
        icon: Settings4Fill,
      },
    ],
  },
];
