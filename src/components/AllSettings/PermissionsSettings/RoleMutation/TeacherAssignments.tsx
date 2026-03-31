import BookOpen from "@/components/Icons/BookOpen";
import Group from "@/components/Icons/Group";
import { Toggle } from "@/components/Toggle";
import { useGetClasses } from "@/hooks/queryHooks/useClass";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Search, X } from "lucide-react";
import React, { useState } from "react";
import { ClassType } from "@/api/types";

export const TeacherAssignments = () => {
  const [isClassTeacher, setIsClassTeacher] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<ClassType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: classesData, isPending: loadingClasses } = useGetClasses();
  console.log(classesData, "###")

  const handleToggleClassTeacher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsClassTeacher(e.target.checked);
  };

  const toggleClassSelection = (schoolClass: ClassType) => {
    const isSelected = selectedClasses.find(c => c.id === schoolClass.id);
    if (isSelected) {
      setSelectedClasses(selectedClasses.filter(c => c.id !== schoolClass.id));
    } else {
      setSelectedClasses([...selectedClasses, schoolClass]);
    }
  };

  const removeClass = (id: number) => {
    setSelectedClasses(selectedClasses.filter(c => c.id !== id));
  };

  const filteredClasses = classesData?.data?.content?.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

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
                  <div className="border-border-default bg-bg-input-soft flex h-10 w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm">
                    <span className="text-text-muted">{selectedClasses.length > 0 ? "Select class" : "Select class"}</span>
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
                        filteredClasses.map((c: any) => (
                          <div
                            key={c.id}
                            className="hover:bg-bg-state-ghost-hover flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5"
                            onClick={() => toggleClassSelection(c)}
                          >
                            <Checkbox
                              checked={!!selectedClasses.find(sc => sc.id === c.id)}
                              className="border-border-darker data-[state=checked]:bg-bg-state-primary data-[state=checked]:text-text-white-default size-4"
                              onCheckedChange={() => toggleClassSelection(c)}
                            />
                            <span className="text-text-default text-sm">{c.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="mt-1 flex flex-wrap gap-2">
                {selectedClasses.map(c => (
                  <Badge
                    key={c.id}
                    className="bg-bg-state-secondary border-border-default text-text-default hover:bg-bg-state-secondary-hover flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-normal"
                  >
                    {c.name}
                    <X className="text-icon-default-muted size-3 cursor-pointer" onClick={() => removeClass(c.id)} />
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
            <Toggle />
          </div>
        </div>
        {/*  */}
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
