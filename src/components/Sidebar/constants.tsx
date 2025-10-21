import BankCard from "../Icons/BankCard";
import Bill from "../Icons/Bill";
import CalendarCheck from "../Icons/CalendarCheck";
import ColorFilter from "../Icons/ColorFilter";
import FileList3 from "../Icons/FileList3";
import Global from "../Icons/Global";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import Home2 from "../Icons/Home2";
import LineChart from "../Icons/LineChart";
import Macbook from "../Icons/Macbook";
import Megaphone from "../Icons/Megaphone";
import Settings4 from "../Icons/Settings4";
import Store3 from "../Icons/Store3";
import Wallet from "../Icons/Wallet";

export const navigation = [
  {
    title: "",
    menu: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home2,
      },
      {
        title: "Student & Parent Record",
        url: "/student-and-parent-record",
        icon: Group,
      },
      {
        title: "Classes & Subjects",
        url: "/classes-and-subjects",
        icon: GraduationCap,
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: CalendarCheck,
      },
    ],
  },
  {
    title: "Finance",
    menu: [
      {
        title: "Invoices",
        url: "/invoices",
        icon: FileList3,
      },
      {
        title: "Fees",
        url: "/fees",
        icon: Bill,
      },
      {
        title: "Expenses",
        url: "/expense",
        icon: BankCard,
      },
      {
        title: "Stock",
        url: "/stock",
        icon: Store3,
      },
      {
        title: "Fee Collection",
        url: "/fee-collection",
        icon: Wallet,
      },
      {
        title: "Finance Report",
        url: "/finance-report",
        icon: LineChart,
      },
    ],
  },
  {
    title: "Communication & Portal",
    menu: [
      {
        title: "Communications",
        url: "/communications",
        icon: Megaphone,
      },
      {
        title: "Portal Overview",
        url: "/portal-overview",
        icon: Macbook,
      },
      {
        title: "Portal Customization",
        url: "/portal-customization",
        icon: ColorFilter,
      },
      {
        title: "Domain",
        url: "/domain",
        icon: Global,
      },
    ],
  },
  {
    title: "",
    menu: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings4,
      },
    ],
  },
];
