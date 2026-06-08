/**
 * Mock data for the recipient picker (branches / levels / classes / arms / students / tags).
 * Campaign list, detail and overview now come from the live campaign-controller API.
 * This picker data stays mocked until the recipient lookup endpoints are wired up.
 */

export type MockBranch = { id: string; name: string; count: number };
export type MockLevel = { id: string; name: string; count: number };
export type MockClass = { id: string; levelId: string; name: string; count: number };
export type MockArm = { id: string; classId: string; name: string; count: number };
export type MockStudent = { id: string; armId: string; name: string };
export type MockTag = { id: string; name: string; count: number; branchName: string };

export const mockBranches: MockBranch[] = [
  { id: "lawanson", name: "Lawanson", count: 24 },
  { id: "ilasamaja", name: "Ilasamaja", count: 24 },
];

export const mockLevels: MockLevel[] = [
  { id: "nursery", name: "Nursery", count: 24 },
  { id: "primary", name: "Primary", count: 24 },
  { id: "secondary", name: "Secondary", count: 24 },
];

export const mockClasses: MockClass[] = [
  { id: "primary-1", levelId: "primary", name: "Primary 1", count: 24 },
  { id: "primary-2", levelId: "primary", name: "Primary 2", count: 24 },
  { id: "primary-3", levelId: "primary", name: "Primary 3", count: 24 },
  { id: "primary-4", levelId: "primary", name: "Primary 4", count: 24 },
  { id: "primary-5", levelId: "primary", name: "Primary 5", count: 24 },
  { id: "nursery-1", levelId: "nursery", name: "Nursery 1", count: 18 },
  { id: "nursery-2", levelId: "nursery", name: "Nursery 2", count: 18 },
  { id: "jss-1", levelId: "secondary", name: "JSS 1", count: 30 },
  { id: "jss-2", levelId: "secondary", name: "JSS 2", count: 30 },
  { id: "jss-3", levelId: "secondary", name: "JSS 3", count: 30 },
  { id: "sss-1", levelId: "secondary", name: "SSS 1", count: 30 },
  { id: "sss-2", levelId: "secondary", name: "SSS 2", count: 30 },
  { id: "sss-3", levelId: "secondary", name: "SSS 3", count: 30 },
];

export const mockArms: MockArm[] = [
  { id: "primary-2-a", classId: "primary-2", name: "A", count: 24 },
  { id: "primary-2-b", classId: "primary-2", name: "B", count: 24 },
  { id: "primary-2-c", classId: "primary-2", name: "C", count: 24 },
  { id: "primary-2-d", classId: "primary-2", name: "D", count: 24 },
  { id: "primary-2-e", classId: "primary-2", name: "E", count: 24 },
  { id: "primary-1-a", classId: "primary-1", name: "A", count: 24 },
  { id: "primary-1-b", classId: "primary-1", name: "B", count: 24 },
  { id: "primary-3-a", classId: "primary-3", name: "A", count: 24 },
  { id: "primary-3-b", classId: "primary-3", name: "B", count: 24 },
  { id: "jss-1-a", classId: "jss-1", name: "A", count: 30 },
  { id: "jss-1-b", classId: "jss-1", name: "B", count: 30 },
  { id: "jss-2-a", classId: "jss-2", name: "A", count: 30 },
];

export const mockStudents: MockStudent[] = [
  { id: "s1", armId: "primary-2-b", name: "Damilare John" },
  { id: "s2", armId: "primary-2-b", name: "Adaeze Okonkwo" },
  { id: "s3", armId: "primary-2-b", name: "Chukwuemeka Eze" },
  { id: "s4", armId: "primary-2-b", name: "Fatima Abdullahi" },
  { id: "s5", armId: "primary-2-b", name: "Seun Bamidele" },
  { id: "s6", armId: "primary-2-b", name: "Ngozi Obi" },
  { id: "s7", armId: "primary-2-b", name: "Emeka Nwachukwu" },
  { id: "s8", armId: "primary-2-b", name: "Aisha Bello" },
  { id: "s9", armId: "primary-2-a", name: "Tobi Adeyemi" },
  { id: "s10", armId: "primary-2-a", name: "Kemi Olatunji" },
  { id: "s11", armId: "jss-1-a", name: "Biodun Adeleke" },
  { id: "s12", armId: "jss-1-a", name: "Chisom Okeke" },
];

export const mockStudentTags: MockTag[] = [
  { id: "troublesome", name: "Troublesome", count: 10, branchName: "Lawanson" },
  { id: "outstanding", name: "Outstanding Students", count: 25, branchName: "Lawanson" },
  { id: "scholarship", name: "Scholarship Students", count: 15, branchName: "Ilasamaja" },
  { id: "remedial", name: "Remedial Class", count: 8, branchName: "Lawanson" },
  { id: "sports", name: "Sports Excellence", count: 20, branchName: "Ilasamaja" },
];

export const mockParentTags: MockTag[] = [
  { id: "pta-members", name: "PTA Members", count: 45, branchName: "Lawanson" },
  { id: "fee-defaulters", name: "Fee Defaulters", count: 20, branchName: "Lawanson" },
  { id: "volunteers", name: "Volunteers", count: 12, branchName: "Ilasamaja" },
  { id: "committee", name: "School Committee", count: 8, branchName: "Lawanson" },
];

export const recipientOptions = [
  { value: "all-students", label: "All Students" },
  { value: "all-parents", label: "All Parents" },
  { value: "all-staff", label: "All Staff" },
  { value: "jss-1", label: "JSS 1 Students" },
  { value: "jss-2", label: "JSS 2 Students" },
  { value: "jss-3", label: "JSS 3 Students" },
  { value: "ss-1", label: "SS 1 Students" },
  { value: "ss-2", label: "SS 2 Students" },
  { value: "ss-3", label: "SS 3 Students" },
  { value: "pta-members", label: "PTA Members" },
];

export const channelOptions: { value: string; label: string }[] = [
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
  { value: "WHATSAPP", label: "WhatsApp" },
];

export const RATE_PER_MESSAGE = 12;
