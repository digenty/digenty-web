import { Award } from "../Icons/Award";
import BankCard from "../Icons/BankCard";
import { Box3 } from "../Icons/Box3";
import FileList3 from "../Icons/FileList3";
import GraduationCap from "../Icons/GraduationCap";
import Group from "../Icons/Group";
import { IdCard } from "../Icons/IdCard";
import School from "../Icons/School";
import { Shield } from "../Icons/Shield";
import User from "../Icons/User";

export const SETTINGS_NAV = [
  { label: "General Settings", url: "/staff/settings/general", icon: School },
  { label: "Academic Setup", url: "/staff/settings/academic", icon: GraduationCap },
  { label: "Result", url: "/staff/settings/result", icon: Award },
  { label: "Subscription", url: "/staff/settings/subscription", icon: BankCard },
  // { label: "Invoice", url: "/staff/settings/invoice", icon: FileList3 },
  { label: "Permissions", url: "/staff/settings/permissions", icon: Group },
  // { label: "Stock", url: "/staff/settings/stock", icon: Box3 },
  // { label: "KYC", url: "/staff/settings/kyc", icon: IdCard },
  { label: "Security", url: "/staff/settings/security", icon: Shield },
];
