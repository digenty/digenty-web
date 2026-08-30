import { canViewAdmissionManagement } from "./admission-management";
import { canViewAttendance } from "./attendance";
import { canViewClassesAndSubjects } from "./classes-and-subjects";
import { canViewCommunication } from "./communication";
import { canViewDomain } from "./domain";
import { canViewFeeCollection } from "./fee-collection";
import { canViewFees } from "./fees";
import { canViewInvoices } from "./invoices";
import { canViewPortalCustomization } from "./portal-customization";
import { canViewStock } from "./stock";
import { canViewStudentParentRecords } from "./students-and-parents";

// Mirrors the module order rendered in the Sidebar, so the first match here is the first module a user actually sees.
const STAFF_ROUTES_BY_PRIORITY: { canView: (permissions: string[] | undefined) => boolean; url: string }[] = [
  { canView: canViewStudentParentRecords, url: "student-and-parent-record" },
  { canView: canViewClassesAndSubjects, url: "classes-and-subjects" },
  { canView: canViewAttendance, url: "attendance" },
  { canView: canViewAdmissionManagement, url: "admission-management" },
  { canView: canViewInvoices, url: "invoices" },
  { canView: canViewFees, url: "fees" },
  { canView: canViewStock, url: "stock" },
  { canView: canViewFeeCollection, url: "fee-collection" },
  { canView: canViewCommunication, url: "communications" },
  { canView: canViewDomain, url: "domain" },
  { canView: canViewPortalCustomization, url: "website-customization" },
];

// Profile has no permission gate, so it's a safe landing spot when a user can't view any module.
export const getFirstAccessibleStaffRoute = (permissions: string[] | undefined) => {
  const match = STAFF_ROUTES_BY_PRIORITY.find(route => route.canView(permissions));
  return match ? `/staff/${match.url}` : "/staff/profile";
};
