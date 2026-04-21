import { Arm, ClassTeacherArm, ClassType, Levelsubject, StaffBranch, SubjectTeaching } from "@/api/types";
import BookOpen from "@/components/Icons/BookOpen";
import Group from "@/components/Icons/Group";
import { toast } from "@/components/Toast";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useAssignClassTeacher, useGetClasses, useUpdateTeacherAssignment } from "@/hooks/queryHooks/useClass";
import { useGetStaffDetails } from "@/hooks/queryHooks/useStaff";
import { useUpdateAssignSubjectTeacher } from "@/hooks/queryHooks/useStudent";
import { useAssignSubjectTeacher, useGetSubjectsByClassId } from "@/hooks/queryHooks/useSubject";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { transformSubjectArmMap } from "../utils";
import { Spinner } from "@/components/ui/spinner";

interface SelectedArm {
  id: number;
  name: string;
  className: string;
}

export const TeacherAssignments = ({
  teacherName,
  staffId,
  setIsEditing,
}: {
  teacherName: string;
  staffId: number;
  setIsEditing?: (show: boolean) => void;
}) => {
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [selectedArms, setSelectedArms] = useState<SelectedArm[]>([]);
  const [isSubjectTeacher, setIsSubjectTeacher] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<Levelsubject[]>([]);
  const [subjectArmsMap, setSubjectArmsMap] = useState<Record<number, SelectedArm[]>>({});
  const [expandedClasses, setExpandedClasses] = useState<number[]>([]);
  const [expandedSubjectClasses, setExpandedSubjectClasses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectClassSearchQuery, setSubjectClassSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubjectPopoverOpen, setIsSubjectPopoverOpen] = useState(false);

  const [classSubjectMap, setClassSubjectMap] = useState<{ classData: ClassType; arms: SelectedArm[]; subjects: Levelsubject[] }[]>([]);

  const { data: staffData } = useGetStaffDetails(staffId);
  const { data: classesData, isPending: loadingClasses } = useGetClasses();

  const { mutate: assignClassTeacher, isPending: isAssigningClass } = useAssignClassTeacher();
  const { mutate: assignSubjectTeacher, isPending: isAssigningSubject } = useAssignSubjectTeacher();
  const { mutate: updateClassTeacher, isPending: isUpdatingClass } = useUpdateTeacherAssignment();
  const { mutate: updateSubjectTeacher, isPending: isUpdatingSubject } = useUpdateAssignSubjectTeacher();

  const transformedSubjectArmmap = useMemo(() => transformSubjectArmMap(subjectArmsMap), [subjectArmsMap]);
  const branchData = useMemo(() => {
    const branches: StaffBranch[] = staffData?.data?.branches || [];
    return branches.reduce(
      (acc, branch) => {
        acc.roleNames.push(...(branch.roleNames || []));
        acc.subjectTeachings.push(...(branch.subjectTeachings || []));
        acc.classTeacherArms.push(...(branch.classTeacherArms || []));

        acc.permissions.push(...(branch.permissions || []));

        return acc;
      },
      {
        roleNames: [] as string[],
        subjectTeachings: [] as SubjectTeaching[],
        classTeacherArms: [] as ClassTeacherArm[],
        permissions: [] as {
          moduleName: string;
          permissions: string[];
        }[],
      },
    );
  }, [staffData?.data?.branches]);
  const existingClassArms: SelectedArm[] = useMemo(() => {
    return (
      branchData?.classTeacherArms?.map((a: { armId: number; armName: string }) => ({
        id: a.armId,
        name: a.armName,
        className: "",
      })) ?? []
    );
  }, [branchData]);

  const existingSubjectTeachings = useMemo(() => branchData?.subjectTeachings ?? [], [branchData]);

  const hasExistingClassAssignments = existingClassArms.length > 0;
  const hasExistingSubjectAssignments = existingSubjectTeachings.length > 0;

  const allClasses: ClassType[] = classesData?.data?.content || [];

  useEffect(() => {
    if (existingClassArms.length > 0) {
      setIsClassTeacher(true);
      setSelectedArms(existingClassArms);
    }
  }, [existingClassArms]);

  useEffect(() => {
    if (existingSubjectTeachings.length === 0 || allClasses.length === 0) return;

    setIsSubjectTeacher(true);

    const subjects = existingSubjectTeachings.map((s: { subjectId: number; subjectName: string }) => ({
      id: s.subjectId,
      name: s.subjectName,
    })) as Levelsubject[];
    setSelectedSubjects(subjects);

    const armsMap: Record<number, SelectedArm[]> = {};
    existingSubjectTeachings.forEach((s: { subjectId: number; arms: { armId: number; armName: string }[] }) => {
      armsMap[s.subjectId] = s.arms.map(a => ({
        id: a.armId,
        name: a.armName,
        className: "",
      }));
    });
    setSubjectArmsMap(armsMap);

    // Build classSubjectMap from existing data so ClassSubjectCards render correctly
    // Group by classId: for each subject's arms, determine which class they belong to
    const classMap = new Map<number, { classData: ClassType; arms: SelectedArm[]; subjects: Levelsubject[] }>();

    existingSubjectTeachings.forEach((s: { subjectId: number; subjectName: string; arms: { armId: number; armName: string; classId: number }[] }) => {
      const subjectEntry: Levelsubject = { id: s.subjectId, name: s.subjectName } as Levelsubject;

      s.arms.forEach(arm => {
        const classData = allClasses.find((c: ClassType) => c.id === arm.classId);
        if (!classData) return;

        if (!classMap.has(arm.classId)) {
          classMap.set(arm.classId, {
            classData,
            arms: [],
            subjects: [],
          });
        }

        const entry = classMap.get(arm.classId)!;

        // Add arm if not already present
        if (!entry.arms.find(a => a.id === arm.armId)) {
          entry.arms.push({ id: arm.armId, name: arm.armName, className: classData.name });
        }

        // Add subject if not already present
        if (!entry.subjects.find(sub => sub.id === subjectEntry.id)) {
          entry.subjects.push(subjectEntry);
        }
      });
    });

    setClassSubjectMap(Array.from(classMap.values()));
  }, [existingSubjectTeachings, allClasses]);

  const handleToggleClassTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClassTeacher(e.target.checked);
  };

  const handleToggleSubjectTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubjectTeacher(e.target.checked);
  };

  const toggleArmSelection = (arm: Arm, className: string) => {
    const isSelected = selectedArms.find(a => a.id === arm.id);
    if (isSelected) {
      setSelectedArms(selectedArms.filter(a => a.id !== arm.id));
    } else {
      setSelectedArms([...selectedArms, { id: arm.id, name: arm.name, className }]);
    }
  };

  const removeArm = (id: number) => {
    setSelectedArms(selectedArms.filter(arm => arm.id !== id));
  };

  const updateSubjectArms = (subjectId: number, arm: Arm, className: string) => {
    const currentArms = subjectArmsMap[subjectId] || [];
    const isSelected = currentArms.find(a => a.id === arm.id);
    if (isSelected) {
      setSubjectArmsMap({ ...subjectArmsMap, [subjectId]: currentArms.filter(a => a.id !== arm.id) });
    } else {
      setSubjectArmsMap({ ...subjectArmsMap, [subjectId]: [...currentArms, { id: arm.id, name: arm.name, className }] });
    }
  };

  const toggleSubjectClassArm = (schoolClass: ClassType, arm: Arm) => {
    setClassSubjectMap(prev => {
      const existing = prev.find(c => c.classData.id === schoolClass.id);

      if (existing) {
        const armExists = existing.arms.find(a => a.id === arm.id);
        const updatedArms = armExists
          ? existing.arms.filter(a => a.id !== arm.id)
          : [...existing.arms, { id: arm.id, name: arm.name, className: schoolClass.name }];

        if (updatedArms.length === 0) {
          return prev.filter(c => c.classData.id !== schoolClass.id);
        }

        return prev.map(c => (c.classData.id === schoolClass.id ? { ...c, arms: updatedArms } : c));
      } else {
        return [
          ...prev,
          {
            classData: schoolClass,
            arms: [{ id: arm.id, name: arm.name, className: schoolClass.name }],
            subjects: [],
          },
        ];
      }
    });
  };

  const toggleAllSubjectClassArms = (schoolClass: ClassType, arms: Arm[]) => {
    setClassSubjectMap(prev => {
      const existing = prev.find(c => c.classData.id === schoolClass.id);
      const currentArms = existing?.arms || [];
      const allSelected = arms.every(arm => currentArms.find(a => a.id === arm.id));

      if (allSelected) {
        return prev.filter(c => c.classData.id !== schoolClass.id);
      } else {
        const allArms = arms.map(arm => ({ id: arm.id, name: arm.name, className: schoolClass.name }));
        if (existing) {
          return prev.map(c => (c.classData.id === schoolClass.id ? { ...c, arms: allArms } : c));
        } else {
          return [...prev, { classData: schoolClass, arms: allArms, subjects: [] }];
        }
      }
    });
  };
  const toggleSubjectForClass = (classId: number, subject: Levelsubject) => {
    setClassSubjectMap(prev =>
      prev.map(c => {
        if (c.classData.id !== classId) return c;
        const exists = c.subjects.find(s => s.id === subject.id);
        return {
          ...c,
          subjects: exists ? c.subjects.filter(s => s.id !== subject.id) : [...c.subjects, subject],
        };
      }),
    );
  };

  const removeSubjectClassArm = (classId: number, armId: number) => {
    setClassSubjectMap(prev => {
      const existing = prev.find(c => c.classData.id === classId);
      if (existing) {
        const updatedArms = existing.arms.filter(a => a.id !== armId);
        if (updatedArms.length === 0) {
          return prev.filter(c => c.classData.id !== classId);
        }
        return prev.map(c => (c.classData.id === classId ? { ...c, arms: updatedArms } : c));
      }
      return prev;
    });
  };

  const removeSubject = (id: number) => {
    setSelectedSubjects(selectedSubjects.filter(s => s.id !== id));
    const newMap = { ...subjectArmsMap };
    delete newMap[id];
    setSubjectArmsMap(newMap);
  };

  const toggleClassExpand = (classId: number) => {
    setExpandedClasses(prev => (prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]));
  };

  const toggleSubjectClassExpand = (classId: number) => {
    setExpandedSubjectClasses(prev => (prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]));
  };

  const filteredClasses = allClasses.filter((c: ClassType) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSubjectClasses = allClasses.filter((c: ClassType) => c.name.toLowerCase().includes(subjectClassSearchQuery.toLowerCase()));

  // const handleAssignClassTeacher = () => {
  //   const payload = {
  //     armDtos: selectedArms.map(arm => ({ armId: arm.id })),
  //     teacherId: staffId,
  //   };
  //   assignClassTeacher(payload, {
  //     onSuccess: () => {
  //       toast({
  //         title: "Operation successful",
  //         description: `Classes assigned to ${teacherName} successfully`,
  //         type: "success",
  //       });
  //     },
  //     onError: error => {
  //       toast({
  //         title: "Failed to assign class(es)",
  //         description: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // };

  const handleAssignClassTeacher = () => {
    const payload = { armDtos: selectedArms.map(arm => ({ armId: arm.id })), teacherId: staffId };

    const onSuccess = () => {
      toast({
        title: "Operation successful",
        description: `Classes ${hasExistingClassAssignments ? "updated" : "assigned"} for ${teacherName} successfully`,
        type: "success",
      });
      setIsEditing?.(false);
    };
    const onError = (error: Error) => {
      toast({ title: "Failed to assign class(es)", description: error.message, type: "error" });
    };

    if (hasExistingClassAssignments) {
      updateClassTeacher(payload, { onSuccess, onError });
    } else {
      assignClassTeacher(payload, { onSuccess, onError });
    }
  };

  const buildSubjectAssignPayload = () => {
    const subjectArmAndClassDtos: { subjectId: number; armId: number }[] = [];
    classSubjectMap.forEach(({ arms, subjects }) => {
      subjects.forEach(subject => {
        arms.forEach(arm => {
          subjectArmAndClassDtos.push({ subjectId: subject.id, armId: arm.id });
        });
      });
    });
    return subjectArmAndClassDtos;
  };

  // const handleAssignSubjectTeacher = () => {
  //   const payload = {
  //     subjectArmAndClassDtos: buildSubjectAssignPayload(),
  //     teacherId: staffId,
  //   };
  //   assignSubjectTeacher(payload, {
  //     onSuccess: () => {
  //       toast({
  //         title: "Operation successful",
  //         description: `Subjects assigned to ${teacherName} successfully`,
  //         type: "success",
  //       });
  //     },
  //     onError: error => {
  //       toast({
  //         title: "Failed to assign subject(s)",
  //         description: error.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // };

  const handleAssignSubjectTeacher = () => {
    const payload = { subjectArmAndClassDtos: buildSubjectAssignPayload(), teacherId: staffId };

    const onSuccess = () => {
      toast({
        title: "Operation successful",
        description: `Subjects ${hasExistingSubjectAssignments ? "updated" : "assigned"} for ${teacherName} successfully`,
        type: "success",
      });
      setIsEditing?.(false);
    };
    const onError = (error: Error) => {
      toast({ title: "Failed to assign subject(s)", description: error.message, type: "error" });
    };

    if (hasExistingSubjectAssignments) {
      updateSubjectTeacher(payload, { onSuccess, onError });
    } else {
      assignSubjectTeacher(payload, { onSuccess, onError });
    }
  };

  const classSubjectMapWithArms = classSubjectMap.filter(c => c.arms.length > 0);

  const isSubjectAssignDisabled =
    isAssigningSubject || classSubjectMapWithArms.length === 0 || classSubjectMapWithArms.every(c => c.subjects.length === 0);

  const isClassBusy = isAssigningClass || isUpdatingClass;
  const isSubjectBusy = isAssigningSubject || isUpdatingSubject;

  return (
    <div>
      <div className="mb-16 flex flex-col gap-6 pb-6">
        <div className="border-border-default flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
          <div className="flex flex-col gap-1">
            <div className="text-text-default text-lg font-semibold">Teacher Assignments</div>
            <div className="text-text-subtle text-sm font-normal">Set up {teacherName || "this teacher"} as a class or subject teacher.</div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border-border-default flex items-center justify-between gap-4 rounded-md border p-2 md:p-4">
              <div className="flex items-center gap-4">
                <div className="bg-bg-state-soft-hover rounded-sm p-1">
                  <Group fill="var(--color-icon-default-subtle)" className="size-6" />
                </div>
                <div className="flex flex-col">
                  <div className="text-text-default text-sm font-medium">Class Teacher</div>
                  <div className="text-text-muted text-xs">Assign specific classes {teacherName || "this teacher"} will manage</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Toggle withBorder={false} checked={isClassTeacher} onChange={handleToggleClassTeacher} />
              </div>
            </div>

            {/* {isClassTeacher && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default text-sm font-semibold">Class</Label>
                  <span className="text-text-muted text-xs">You can select more than one</span>
                </div>

                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="border-border-default bg-bg-input-soft flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                      <span className="text-text-muted">{selectedArms.length > 0 ? `${selectedArms.length} arms selected` : "Select class"}</span>
                      <ChevronDown className="text-icon-default-muted size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="border-border-default bg-bg-default w-full! min-w-(--radix-popover-trigger-width) p-0" align="start">
                    <div className="flex flex-col">
                      <div className="border-border-default relative flex items-center border-b px-3 py-2">
                        <Search className="text-icon-default-muted absolute left-3 size-4" />
                        <Input
                          placeholder="Search"
                          className="placeholder:text-text-muted h-8 border-none bg-transparent pl-7 text-sm focus-visible:ring-0"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto p-1">
                        {loadingClasses ? (
                          <div className="text-text-muted p-2 text-center text-xs">Loading classes...</div>
                        ) : filteredClasses.length === 0 ? (
                          <div className="text-text-muted p-2 text-center text-xs">No classes found</div>
                        ) : (
                          filteredClasses.map((c: ClassType) => (
                            <ClassArmList
                              key={c.id}
                              schoolClass={c}
                              selectedArms={selectedArms}
                              onToggleArm={toggleArmSelection}
                              isExpanded={expandedClasses.includes(c.id)}
                              onToggleExpand={() => toggleClassExpand(c.id)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedArms.map(a => (
                    <Badge
                      key={a.id}
                      className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal [&>svg]:pointer-events-auto"
                    >
                      {a.className} {a.name}
                      <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeArm(a.id)} />
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-fit rounded-md px-4"
                    onClick={handleAssignClassTeacher}
                    disabled={isAssigningClass || selectedArms.length === 0}
                  >
                    {isAssigningClass && <Loader2 className="mr-2 size-3 animate-spin" />}
                    Assign
                  </Button>
                </div>
                <div className="border-border-default my-2 w-full border-b"></div>
              </div>
            )} */}

            {isClassTeacher && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default text-sm font-semibold">Class</Label>
                  <span className="text-text-muted text-xs">You can select more than one</span>
                </div>

                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="border-border-default bg-bg-input-soft flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                      <span className="text-text-muted">{selectedArms.length > 0 ? `${selectedArms.length} arms selected` : "Select class"}</span>
                      <ChevronDown className="text-icon-default-muted size-4" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="border-border-default bg-bg-default w-full! min-w-(--radix-popover-trigger-width) p-0" align="start">
                    <div className="flex flex-col">
                      <div className="border-border-default relative flex items-center border-b px-3 py-2">
                        <Search className="text-icon-default-muted absolute left-3 size-4" />
                        <Input
                          placeholder="Search"
                          className="placeholder:text-text-muted h-8 border-none bg-transparent pl-7 text-sm focus-visible:ring-0"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto p-1">
                        {loadingClasses ? (
                          <div className="text-text-muted p-2 text-center text-xs">Loading classes...</div>
                        ) : filteredClasses.length === 0 ? (
                          <div className="text-text-muted p-2 text-center text-xs">No classes found</div>
                        ) : (
                          filteredClasses.map((c: ClassType) => (
                            <ClassArmList
                              key={c.id}
                              schoolClass={c}
                              selectedArms={selectedArms}
                              onToggleArm={toggleArmSelection}
                              isExpanded={expandedClasses.includes(c.id)}
                              onToggleExpand={() => toggleClassExpand(c.id)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedArms.map(a => (
                    <Badge
                      key={a.id}
                      className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal [&>svg]:pointer-events-auto"
                    >
                      {a.className} {a.name}
                      <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeArm(a.id)} />
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-fit rounded-md px-4"
                    onClick={handleAssignClassTeacher}
                    disabled={isClassBusy || (selectedArms.length === 0 && !hasExistingClassAssignments)}
                  >
                    {isClassBusy && <Spinner className="text-text-white-default" />}
                    {hasExistingClassAssignments ? "Update" : "Assign"}
                  </Button>
                </div>
                <div className="border-border-default my-2 w-full border-b" />
              </div>
            )}
          </div>

          <div className="border-border-default flex items-center justify-between gap-4 rounded-md border p-2 md:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-bg-state-soft-hover rounded-sm p-1">
                <BookOpen fill="var(--color-icon-default-subtle)" className="size-6" />
              </div>
              <div className="flex flex-col">
                <div className="text-text-default text-sm font-medium">Subject Teacher</div>
                <div className="text-text-muted text-xs">Assign subjects and select which classes they apply to</div>
              </div>
            </div>
            <div className="flex items-center">
              <Toggle withBorder={false} checked={isSubjectTeacher} onChange={handleToggleSubjectTeacher} />
            </div>
          </div>

          {isSubjectTeacher && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-text-default text-sm font-semibold">Class</Label>
                  <span className="text-text-muted text-xs">Select class and arms</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Popover open={isSubjectPopoverOpen} onOpenChange={setIsSubjectPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="border-border-default bg-bg-input-soft flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                        <span className="text-text-muted">
                          {classSubjectMapWithArms.length > 0 ? `${classSubjectMapWithArms.length} classes selected` : "Select class"}
                        </span>
                        <ChevronDown className="text-icon-default-muted size-4" />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent className="border-border-default bg-bg-default w-full! min-w-(--radix-popover-trigger-width) p-0" align="start">
                      <div className="border-border-default relative flex items-center border-b px-3 py-2">
                        <Search className="text-icon-default-muted absolute left-3 size-4" />
                        <Input
                          placeholder="Search"
                          className="placeholder:text-text-muted h-8 border-none bg-transparent pl-7 text-sm focus-visible:ring-0"
                          value={subjectClassSearchQuery}
                          onChange={e => setSubjectClassSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto p-1">
                        {filteredSubjectClasses.map((c: ClassType) => (
                          <SubjectClassArmList
                            key={c.id}
                            schoolClass={c}
                            selectedArms={classSubjectMap.find(cs => cs.classData.id === c.id)?.arms || []}
                            onToggleArm={arm => toggleSubjectClassArm(c, arm)}
                            onToggleAllArms={arms => toggleAllSubjectClassArms(c, arms)}
                            isExpanded={expandedSubjectClasses.includes(c.id)}
                            onToggleExpand={() => toggleSubjectClassExpand(c.id)}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {classSubjectMapWithArms.map(c => (
                  <ClassSubjectCard
                    key={c.classData.id}
                    classData={c.classData}
                    arms={c.arms}
                    subjects={c.subjects}
                    onToggleSubject={subject => toggleSubjectForClass(c.classData.id, subject)}
                    removeArm={armId => removeSubjectClassArm(c.classData.id, armId)}
                  />
                ))}
              </div>

              {/* <div className="flex justify-end">
                <Button
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-fit rounded-md px-4"
                  onClick={handleAssignSubjectTeacher}
                  disabled={isSubjectAssignDisabled}
                >
                  {isAssigningSubject && <Loader2 className="mr-2 size-3 animate-spin" />}
                  Assign
                </Button>
              </div> */}

              <div className="flex justify-end">
                <Button
                  className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7! w-fit rounded-md px-4"
                  onClick={handleAssignSubjectTeacher}
                  disabled={isSubjectBusy || classSubjectMapWithArms.length === 0 || classSubjectMapWithArms.every(c => c.subjects.length === 0)}
                >
                  {isSubjectBusy && <Spinner className="text-text-white-default" />}
                  {hasExistingSubjectAssignments ? "Update" : "Assign"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {!(hasExistingSubjectAssignments && hasExistingClassAssignments) && (
          <div className="border-border-default bg-bg-basic-blue-subtle flex flex-col gap-2 rounded-md border px-5 py-3">
            <div className="text-text-subtle text-sm font-semibold">Automatic Academic Permissions</div>
            <div className="text-text-subtle text-xs">Once assignments are made, the following permissions are automatically granted:</div>
            <ul className="flex list-disc flex-col gap-2 pl-4">
              <li className="text-text-subtle">
                <span className="text-text-subtle text-xs font-semibold"> Class Teachers:</span>{" "}
                <span className="text-text-subtle text-xs font-normal">View results, input scores, and comment on results for assigned classes</span>
              </li>

              <li className="text-text-subtle">
                <span className="text-text-subtle text-xs font-semibold"> Subject Teachers:</span>{" "}
                <span className="text-text-subtle text-xs font-normal">
                  View results, input scores, and comment on results for assigned subjects and classes
                </span>
              </li>

              <li className="text-text-subtle">
                <span className="text-text-subtle text-xs font-semibold"> Principals/Admins:</span>{" "}
                <span className="text-text-subtle text-xs font-normal">All academic permissions including approval rights</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const ClassArmList = ({
  schoolClass,
  selectedArms,
  onToggleArm,
  isExpanded,
  onToggleExpand,
}: {
  schoolClass: ClassType;
  selectedArms: SelectedArm[];
  onToggleArm: (arm: Arm, className: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const { data: armsData, isPending: loadingArms } = useGetArmsByClass(schoolClass.id);
  const arms = armsData?.data || [];

  const isClassChecked = arms.length > 0 && arms.every((arm: Arm) => selectedArms.find(a => a.id === arm.id));
  const isClassPartial = arms.some((arm: Arm) => selectedArms.find(a => a.id === arm.id)) && !isClassChecked;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5",
          isExpanded && "bg-bg-state-ghost-hover",
        )}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2" onClick={onToggleExpand}>
          <Checkbox
            checked={isClassChecked || (isClassPartial ? "indeterminate" : false)}
            className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
            onCheckedChange={() => {
              if (isClassChecked) {
                arms.forEach((arm: Arm) => {
                  if (selectedArms.find(a => a.id === arm.id)) onToggleArm(arm, schoolClass.name);
                });
              } else {
                arms.forEach((arm: Arm) => {
                  if (!selectedArms.find(a => a.id === arm.id)) onToggleArm(arm, schoolClass.name);
                });
              }
            }}
          />
          <span className="text-text-default text-sm font-medium">{schoolClass.name}</span>
        </div>
        <ChevronDown className={cn("text-icon-default-muted size-4 transition-transform", isExpanded && "rotate-180")} />
      </div>

      {isExpanded && (
        <div className="ml-6 flex flex-col gap-1 py-1">
          {loadingArms ? (
            <div className="text-text-muted p-1 text-xs">Loading arms...</div>
          ) : arms.length === 0 ? (
            <div className="text-text-muted p-1 text-xs">No arms found</div>
          ) : (
            arms.map((arm: Arm) => (
              <div
                key={arm.id}
                className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1"
                onClick={() => onToggleArm(arm, schoolClass.name)}
              >
                <Checkbox
                  checked={!!selectedArms.find(a => a.id === arm.id)}
                  className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
                  onCheckedChange={() => onToggleArm(arm, schoolClass.name)}
                />
                <span className="text-text-default text-xs">{arm.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const SubjectClassArmList = ({
  schoolClass,
  selectedArms,
  onToggleArm,
  onToggleAllArms,
  isExpanded,
  onToggleExpand,
}: {
  schoolClass: ClassType;
  selectedArms: SelectedArm[];
  onToggleArm: (arm: Arm) => void;
  onToggleAllArms: (arms: Arm[]) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  const { data: armsData, isPending: loadingArms } = useGetArmsByClass(schoolClass.id);
  const arms: Arm[] = armsData?.data || [];

  const isClassChecked = arms.length > 0 && arms.every(arm => selectedArms.find(a => a.id === arm.id));
  const isClassPartial = arms.some(arm => selectedArms.find(a => a.id === arm.id)) && !isClassChecked;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "hover:bg-bg-state-ghost-hover flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5",
          isExpanded && "bg-bg-state-ghost-hover",
        )}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={isClassChecked || (isClassPartial ? "indeterminate" : false)}
            className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
            onCheckedChange={() => onToggleAllArms(arms)}
          />
          <span className="text-text-default text-sm font-medium">{schoolClass.name}</span>
        </div>
        <ChevronDown className={cn("text-icon-default-muted size-4 transition-transform", isExpanded && "rotate-180")} />
      </div>

      {isExpanded && (
        <div className="ml-6 flex flex-col gap-1 py-1">
          {loadingArms ? (
            <div className="text-text-muted p-1 text-xs">Loading arms...</div>
          ) : arms.length === 0 ? (
            <div className="text-text-muted p-1 text-xs">No arms found</div>
          ) : (
            arms.map(arm => (
              <div
                key={arm.id}
                className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1"
                onClick={() => onToggleArm(arm)}
              >
                <Checkbox
                  checked={!!selectedArms.find(a => a.id === arm.id)}
                  className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
                  onCheckedChange={() => onToggleArm(arm)}
                />
                <span className="text-text-default text-xs capitalize">{arm.name.toLowerCase()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ClassSubjectCard = ({
  classData,
  arms,
  subjects,
  onToggleSubject,
  removeArm,
}: {
  classData: ClassType;
  arms: SelectedArm[];
  subjects: Levelsubject[];
  onToggleSubject: (s: Levelsubject) => void;
  removeArm: (id: number) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: subjectsData, isPending: loadingSubjects } = useGetSubjectsByClassId(classData.id, {
    enabled: open,
  });

  const allSubjects = subjectsData?.data || [];
  const filtered = allSubjects.filter((s: Levelsubject) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="border-border-default bg-bg-default rounded-md border">
      <div className="text-text-default bg-bg-state-soft mb-4 px-4 py-2 text-sm font-medium">{classData.name}</div>
      <div className="ml-4 flex flex-wrap gap-2">
        {arms.map(arm => (
          <Badge
            key={arm.id}
            className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal [&>svg]:pointer-events-auto"
          >
            {arm.className} {arm.name}
            <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeArm(arm.id)} />
          </Badge>
        ))}
      </div>
      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <Label className="text-text-default text-sm font-semibold">Subject</Label>
          <span className="text-text-muted text-xs">You can select more than one</span>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="border-border-default bg-bg-input-soft flex h-9 w-full cursor-pointer items-center justify-between rounded-md px-3 py-1 text-xs">
              <span className="text-text-muted text-sm">
                {subjects.length > 0 ? `${subjects.length} subject${subjects.length > 1 ? "s" : ""} selected` : "Select subjects"}
              </span>
              <ChevronDown className="text-icon-default-muted size-3.5" />
            </div>
          </PopoverTrigger>

          <PopoverContent className="border-border-default bg-bg-default w-full! min-w-(--radix-popover-trigger-width) p-0" align="start">
            <Input
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="placeholder:text-text-muted text-text-default h-7 border-none bg-transparent pl-7 text-xs focus-visible:ring-0"
            />

            <div className="border-border-default overflow-y-auto border-t p-1">
              {loadingSubjects ? (
                <div className="text-text-muted flex items-center justify-center p-2 text-xs">
                  <Loader2 className="mr-2 size-3 animate-spin" />
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-text-muted flex items-center justify-center p-2 text-xs">No subjects found</div>
              ) : (
                filtered.map((s: Levelsubject) => (
                  <div
                    key={s.id}
                    className="text-text-default hover:bg-bg-input-soft flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                    onClick={() => onToggleSubject(s)}
                  >
                    <Checkbox checked={!!subjects.find(ss => ss.id === s.id)} />
                    <span className="capitalize">{s.name.toLowerCase()}</span>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {subjects.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {subjects.map(s => (
              <div
                key={s.id}
                className="bg-bg-state-secondary border-border-default text-text-default flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal"
              >
                <span className="capitalize">{s.name.toLowerCase()}</span>
                <button
                  type="button"
                  className="text-icon-default-muted hover:text-text-default ml-1 flex items-center focus:outline-none"
                  onClick={() => onToggleSubject(s)}
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

{
  /**
  
  const SubjectCard = ({
  subject,
  selectedArms,
  onToggleArm,
  classes,
  loadingClasses,
  expandedClasses,
  onToggleExpand,
}: {
  subject: Levelsubject;
  selectedArms: SelectedArm[];
  onToggleArm: (arm: Arm, className: string) => void;
  classes: ClassType[];
  loadingClasses: boolean;
  expandedClasses: number[];
  onToggleExpand: (id: number) => void;
}) => {
  const [isClassPopoverOpen, setIsClassPopoverOpen] = useState(false);
  const [classSearch, setClassSearch] = useState("");

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(classSearch.toLowerCase()));

  return (
    <div className="border-border-default bg-bg-default rounded-md border">
      <div className="text-text-default bg-bg-state-soft mb-4 px-4 py-2 text-sm font-medium capitalize">{subject.name.toLowerCase()}</div>

      <div className="flex flex-col gap-2 px-4 py-2">
        <div className="flex items-center justify-between">
          <Label className="text-text-default text-sm font-medium">Class</Label>
          <span className="text-text-muted text-sm">You can select more than one</span>
        </div>

        <Popover open={isClassPopoverOpen} onOpenChange={setIsClassPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="border-border-default bg-bg-input-soft flex h-9 w-full cursor-pointer items-center justify-between rounded-md px-3 py-1 text-xs">
              <span className="text-text-muted text-sm font-normal">
                {selectedArms.length > 0 ? `${selectedArms.length} arms selected` : "Select class"}
              </span>
              <ChevronDown className="text-icon-default-muted size-3.5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="border-border-default bg-bg-default w-full! min-w-(--radix-popover-trigger-width) p-0" align="start">
            <div className="flex flex-col">
              <div className="border-border-default relative flex items-center border-b px-3 py-1.5">
                <Search className="text-icon-default-muted absolute left-3 size-3.5" />
                <Input
                  placeholder="Search"
                  className="placeholder:text-text-muted h-7 border-none bg-transparent pl-7 text-xs focus-visible:ring-0"
                  value={classSearch}
                  onChange={e => setClassSearch(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1">
                {loadingClasses ? (
                  <div className="text-text-muted p-2 text-center text-xs">Loading classes...</div>
                ) : filteredClasses.length === 0 ? (
                  <div className="text-text-muted p-2 text-center text-xs">No classes found</div>
                ) : (
                  filteredClasses.map(c => (
                    <ClassArmList
                      key={c.id}
                      schoolClass={c}
                      selectedArms={selectedArms}
                      onToggleArm={onToggleArm}
                      isExpanded={expandedClasses.includes(c.id)}
                      onToggleExpand={() => onToggleExpand(c.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="mt-1 flex flex-wrap gap-2">
          {selectedArms.map(a => (
            <Badge
              key={a.id}
              className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-normal"
            >
              {a.className} {a.name}
              <X
                className="text-icon-default-muted size-2.5 cursor-pointer"
                onClick={() => onToggleArm({ id: a.id, name: a.name } as Arm, a.className)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
  */
}
