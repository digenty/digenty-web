// import { Trash2, Send, Settings, Users, BookOpen, Calendar, FileText, DollarSign, Package, BarChart2, Globe, Layout, UserPlus } from "lucide-react";
import BankCard from "@/components/Icons/BankCard";
import CalendarCheck from "@/components/Icons/CalendarCheck";
import ColorFilter from "@/components/Icons/ColorFilter";
import DeleteBin from "@/components/Icons/DeleteBin";
import { DoorOpen } from "@/components/Icons/DoorOpen";
import Edit from "@/components/Icons/Edit";
import Eye from "@/components/Icons/Eye";
import FileList2 from "@/components/Icons/FileList2";
import FileList3 from "@/components/Icons/FileList3";
import { Gift2 } from "@/components/Icons/Gift2";
import Global from "@/components/Icons/Global";
import GraduationCap from "@/components/Icons/GraduationCap";
import Group from "@/components/Icons/Group";
import LineChart from "@/components/Icons/LineChart";
import Macbook from "@/components/Icons/Macbook";
import Megaphone from "@/components/Icons/Megaphone";
import { SendPlane } from "@/components/Icons/SendPlane";
import Settings4 from "@/components/Icons/Settings4";
import Store3 from "@/components/Icons/Store3";
import Wallet from "@/components/Icons/Wallet";
import React from "react";

type RawPermission = {
  id: number;
  uuid: string;
  active: boolean;
  name: string;
  alias: string;
};
type PermissionAction = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  id: number;
};
type PermissionGroup = {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  actions: PermissionAction[];
};
// Map action prefixes to labels and icons
const ACTION_MAP: Record<string, { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  view: { label: "View", icon: Eye },
  manage: { label: "Manage", icon: Edit },
  delete: { label: "Delete", icon: DeleteBin },
  send: { label: "Send", icon: SendPlane },
};
// Map group keys (derived from alias) to display metadata
const GROUP_META: Record<string, { title: string; description: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  student_parent_records: { title: "Students & Parents", description: "Manage student and parent records", icon: Group },
  classes_subjects: { title: "Classes & Subjects", description: "Manage classes and subjects", icon: GraduationCap },
  attendance: { title: "Attendance", description: "Track and manage attendance", icon: CalendarCheck },
  admission_management: { title: "Admission Management", description: "Handle student admissions", icon: DoorOpen },
  invoices: { title: "Invoices", description: "Create and manage invoices", icon: FileList3 },
  fees: { title: "Fees", description: "Manage school fees", icon: FileList2 },
  expenses: { title: "Expenses", description: "Track school expenses", icon: BankCard },
  stock: { title: "Stock", description: "Manage inventory and stock", icon: Store3 },
  fee_collection: { title: "Fee Collection", description: "Collect and track fee payments", icon: Wallet },
  finance_report: { title: "Finance Report", description: "View and manage financial reports", icon: LineChart },
  communication: { title: "Communication", description: "Send school communications and campaigns", icon: Megaphone },
  portal_overview: { title: "Portal Overview", description: "Manage the school portal overview", icon: Macbook },
  portal_customization: { title: "Portal Customization", description: "Customize the school portal appearance", icon: ColorFilter },
  domain: { title: "Domain", description: "Manage school domain settings", icon: Global },
  settings: { title: "Settings", description: "Configure application settings", icon: Settings4 },
  referrals: { title: "Referrals", description: "View and manage referrals", icon: Gift2 },
};
const ACTION_PREFIXES = Object.keys(ACTION_MAP); // ["view", "manage", "delete", "send"]

export const transformPermissions = (permissions: RawPermission[]): PermissionGroup[] => {
  const groups = new Map<string, PermissionGroup>();
  for (const permission of permissions) {
    const alias = permission.alias; // e.g. "manage_fee_collection"
    // Find which action prefix this alias starts with
    const prefix = ACTION_PREFIXES.find(p => alias.startsWith(`${p}_`));
    if (!prefix) continue;
    // Derive the group key by stripping the action prefix
    const groupKey = alias.slice(prefix.length + 1); // e.g. "fee_collection"
    if (!groups.has(groupKey)) {
      const meta = GROUP_META[groupKey] ?? {
        title: groupKey.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        description: "",
        icon: Settings4,
      };
      groups.set(groupKey, { ...meta, actions: [] });
    }
    groups.get(groupKey)!.actions.push({
      label: ACTION_MAP[prefix].label,
      icon: ACTION_MAP[prefix].icon,
      id: permission.id,
    });
  }
  return Array.from(groups.values());
};
