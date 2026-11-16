import { getApiErrorCode, getApiErrorReason } from "@/lib/apiError";
import { Query, QueryClient } from "@tanstack/react-query";

// Deleting a branch, level, class, arm or subject is a soft delete that cascades on the server: a level takes its classes and
// arms with it, any hidden arm unassigns its class and subject teachers, a deleted subject leaves its departments, and dashboard
// counts change. So after any of these, every cached list of the school's structure may be stale, not just the one the screen
// edited. These are the query-key roots of those lists.
const STRUCTURE_ROOTS = new Set<string>([
  // branches & levels
  "branches",
  "allbranches",
  "branchDetail",
  "stats",
  "levels",
  "classLevel",
  "getAcademic",
  // classes & arms
  "classes",
  "class",
  "classesByLevel",
  "allTeacherClasses",
  "arms",
  "allArms",
  "armsByLevel",
  // subjects & departments
  "subjects",
  "allSubjects",
  "subjectsByLevel",
  "subjectsByClass",
  "subjectsByClassId",
  " branchClassSubjects",
  "departments",
  "departmentsByLevel",
  "departmentsByClass",
  "departmentSubjectsByLevel",
  "departmentSubjectsByClass",
  "assignedDepartments",
  // what hangs off them
  "staffDetails",
  "students",
  "studentsDistributionByBranch",
  "getDashboard",
  "dashboardLevels",
]);

// Query keys in this app come in two shapes: ["arms", id] and [["classesByLevel"], id]. Take the root name from either.
const keyRoot = (query: Query): string | undefined => {
  const first = query.queryKey[0];
  const root = Array.isArray(first) ? first[0] : first;
  return typeof root === "string" ? root : undefined;
};

// Only queries on screen refetch right away; the rest are marked stale and refetch when next used.
export const invalidateAcademicStructure = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ predicate: query => STRUCTURE_ROOTS.has(keyRoot(query) ?? "") });

// 404 RESOURCE_NOT_FOUND on a branch, level, class, arm or subject means it was already deleted (or belongs to another school):
// the screen is out of date, so treat it as gone and refresh.
export const isNotFoundError = (error: unknown): boolean => getApiErrorCode(error) === "RESOURCE_NOT_FOUND";

// 400 "Cannot delete class 'JSS 1': 3 students are still placed in it. Move or withdraw them first." — also for arms, levels
// and branches. The message is written to be shown as is; this only tells callers to offer a way to the students.
export const isStudentsStillPlacedError = (error: unknown): boolean => /still placed in/i.test(getApiErrorReason(error) ?? "");

// 400 "Subject 'MATHEMATICS' is not taught in this class" from score entry and teacher assignment: the subject list is stale.
export const isSubjectNotTaughtError = (error: unknown): boolean => /is not taught in this class/i.test(getApiErrorReason(error) ?? "");

// Mutation onError for structure edits: refresh when the server says the screen was out of date.
// Typed as Error (TanStack's default) so it doesn't widen the mutation's error type for callers' own onError handlers.
export const refreshIfStale = (queryClient: QueryClient) => (error: Error) => {
  if (isNotFoundError(error) || isSubjectNotTaughtError(error)) invalidateAcademicStructure(queryClient);
};

// Where to send someone who has to move or withdraw students before deleting part of the structure. The student list reads
// these params to pre-select its filters.
export const studentListHref = (filter: { branchId?: number; classId?: number; armId?: number } = {}) => {
  const params = new URLSearchParams({ tab: "Students" });
  if (filter.branchId) params.set("branchId", String(filter.branchId));
  if (filter.classId) params.set("classId", String(filter.classId));
  if (filter.armId) params.set("armId", String(filter.armId));
  return `/staff/student-and-parent-record?${params.toString()}`;
};

// The error toast's action for a delete refused because students are still placed: a way to the students to move or
// withdraw. Undefined for any other error, so it can be spread straight into toast({ button }).
export const viewStudentsAction = (
  error: unknown,
  navigate: (href: string) => void,
  filter?: Parameters<typeof studentListHref>[0],
): { label: string; onClick: () => void } | undefined =>
  isStudentsStillPlacedError(error) ? { label: "View students", onClick: () => navigate(studentListHref(filter)) } : undefined;
