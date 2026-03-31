import { AllSubjects, Arm, ClassType, Levelsubject } from "@/api/types";
import BookOpen from "@/components/Icons/BookOpen";
import Group from "@/components/Icons/Group";
import { Toggle } from "@/components/Toggle";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetArmsByClass } from "@/hooks/queryHooks/useArm";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { useGetAllSubjects } from "@/hooks/queryHooks/useSubject";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import React, { useState } from "react";

interface SelectedArm {
  id: number;
  name: string;
  className: string;
}

export const TeacherAssignments = () => {
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [selectedArms, setSelectedArms] = useState<SelectedArm[]>([]);
  const [isSubjectTeacher, setIsSubjectTeacher] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<Levelsubject[]>([]);
  const [subjectArmsMap, setSubjectArmsMap] = useState<Record<number, SelectedArm[]>>({});
  const [expandedClasses, setExpandedClasses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubjectPopoverOpen, setIsSubjectPopoverOpen] = useState(false);

  const { data: classesData, isPending: loadingClasses } = useGetClasses();
  const { data: subjectsData, isPending: loadingSubjects } = useGetAllSubjects();

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
    setSelectedArms(selectedArms.filter(a => a.id !== id));
  };

  const toggleSubjectSelection = (subject: Levelsubject) => {
    const isSelected = selectedSubjects.find(s => s.id === subject.id);
    if (isSelected) {
      setSelectedSubjects(selectedSubjects.filter(s => s.id !== subject.id));
      const newMap = { ...subjectArmsMap };
      delete newMap[subject.id];
      setSubjectArmsMap(newMap);
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const updateSubjectArms = (subjectId: number, arm: Arm, className: string) => {
    const currentArms = subjectArmsMap[subjectId] || [];
    const isSelected = currentArms.find(a => a.id === arm.id);
    if (isSelected) {
      setSubjectArmsMap({
        ...subjectArmsMap,
        [subjectId]: currentArms.filter(a => a.id !== arm.id),
      });
    } else {
      setSubjectArmsMap({
        ...subjectArmsMap,
        [subjectId]: [...currentArms, { id: arm.id, name: arm.name, className }],
      });
    }
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

  const filteredClasses = classesData?.data?.content?.filter((c: ClassType) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];
  const filteredSubjects =
    subjectsData?.data?.data?.filter((s: AllSubjects) => s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase())) || [];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="border-border-default my-6 flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <div className="text-text-default text-lg font-semibold">Teacher Assignments</div>
          <div className="text-text-subtle text-sm font-normal">
            Set up class and subject teacher assignments. Academic permissions are automatically granted based on these assignments.
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border-border-default flex items-center justify-between gap-4 rounded-md border p-2 md:p-4">
            <div className="flex items-center gap-4">
              <div className="bg-bg-state-soft-hover rounded-sm p-1">
                <Group fill="var(--color-icon-default-subtle)" className="size-6" />
              </div>
              <div className="flex flex-col">
                <div className="text-text-default text-sm font-medium">Class Teacher</div>
                <div className="text-text-muted text-xs">Assign specific classes this teacher will manage</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Toggle withBorder={false} checked={isClassTeacher} onChange={handleToggleClassTeacher} />
            </div>
          </div>

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
                    className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal"
                  >
                    {a.className} {a.name}
                    <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeArm(a.id)} />
                  </Badge>
                ))}
              </div>
              <div className="border-border-default my-2 w-full border-b"></div>
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
                <Label className="text-text-default text-sm font-semibold">Subject</Label>
                <span className="text-text-muted text-xs">You can select more than one</span>
              </div>

              <Popover open={isSubjectPopoverOpen} onOpenChange={setIsSubjectPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="border-border-default bg-bg-input-soft flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                    <span className="text-text-muted">
                      {selectedSubjects.length > 0 ? `${selectedSubjects.length} subjects selected` : "Select subject"}
                    </span>
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
                        value={subjectSearchQuery}
                        onChange={e => setSubjectSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                      {loadingSubjects ? (
                        <div className="text-text-muted p-2 text-center text-xs">Loading subjects...</div>
                      ) : filteredSubjects.length === 0 ? (
                        <div className="text-text-muted p-2 text-center text-xs">No subjects found</div>
                      ) : (
                        filteredSubjects.map((s: Levelsubject) => (
                          <div
                            key={s.id}
                            className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
                            onClick={() => toggleSubjectSelection(s)}
                          >
                            <Checkbox
                              checked={!!selectedSubjects.find(ss => ss.id === s.id)}
                              className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
                              onCheckedChange={() => toggleSubjectSelection(s)}
                            />
                            <span className="text-text-default text-sm capitalize">{s.name.toLowerCase()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="mt-1 flex flex-wrap gap-2">
                {selectedSubjects.map(s => (
                  <Badge
                    key={s.id}
                    className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal capitalize"
                  >
                    {s.name.toLowerCase()}
                    <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeSubject(s.id)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {selectedSubjects.map(s => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  selectedArms={subjectArmsMap[s.id] || []}
                  onToggleArm={(arm, className) => updateSubjectArms(s.id, arm, className)}
                  classes={filteredClasses}
                  loadingClasses={loadingClasses}
                  expandedClasses={expandedClasses}
                  onToggleExpand={toggleClassExpand}
                />
              ))}
            </div>
          </div>
        )}
      </div>

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
            <span className="text-text-subtle text-xs font-semibold">  Principals/Admins:</span>{" "}
            <span className="text-text-subtle text-xs font-normal">All academic permissions including approval rights</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

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
                  <div className="text-text-muted p-2 text-center text-[10px]">Loading classes...</div>
                ) : filteredClasses.length === 0 ? (
                  <div className="text-text-muted p-2 text-center text-[10px]">No classes found</div>
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
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
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
