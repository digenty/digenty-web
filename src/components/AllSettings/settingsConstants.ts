import { Award } from "../Icons/Award";
import BankCard from "../Icons/BankCard";
import { Box3 } from "../Icons/Box3";
import FileList3 from "../Icons/FileList3";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import { IdCard } from "../Icons/IdCard";
import School from "../Icons/School";
import { Shield } from "../Icons/Shield";

export const SETTINGS_NAV = [
  { label: "General Settings", url: "/settings/general", icon: School },
  { label: "Academic Setup", url: "/settings/academic", icon: GraduationCap },
  { label: "Result", url: "/settings/result", icon: Award },
  { label: "Subscription", url: "/settings/subscription", icon: BankCard },
  { label: "Invoice", url: "/settings/invoice", icon: FileList3 },
  { label: "Permissions", url: "/settings/permissions", icon: Group },
  { label: "Stock", url: "/settings/stock", icon: Box3 },
  { label: "KYC", url: "/settings/kyc", icon: IdCard },
  { label: "Security", url: "/settings/security", icon: Shield },
];
