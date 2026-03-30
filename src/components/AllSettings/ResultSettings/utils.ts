type Branch = {
  branchId: number;
  branchName: string;
  subjects: Subject[];
};

export type Subject = {
  id: number;
  name: string;
  uuid: string;
  branchId: number;
  schoolId: number;
};

export function extractUniqueSubjectsByName(data: Branch[]): Subject[] {
  const map = new Map<string, Subject>();

  for (const branch of data) {
    for (const subject of branch.subjects) {
      const key = subject.name.toLowerCase();

      if (!map.has(key)) {
        map.set(key, subject);
      }
    }
  }

  return Array.from(map.values());
}
