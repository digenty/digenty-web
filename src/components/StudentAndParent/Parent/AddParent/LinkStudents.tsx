"use client";
import { Branch, Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useGetStudents } from "@/hooks/queryHooks/useStudent";
import { useIsMobile } from "@/hooks/useIsMobile";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const LinkStudents = ({
  open,
  setOpen,
  selectedStudents,
  setSelectedStudents,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedStudents: { id: number; name: string; avatar: string | null }[];
  setSelectedStudents: Dispatch<SetStateAction<{ id: number; name: string; avatar: string | null }[]>>;
}) => {
  const [branchSelected, setBranchSelected] = useState<Branch>();
  const { data: branches, isPending: loadingBranches } = useGetBranches();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (branches) {
      setBranchSelected(branches.data.content[0]);
    }
  }, [branches]);

  const { data, isPending } = useGetStudents({ pagination: { limit: 20, page: 1 }, branchId: branchSelected?.id });

  const removeStudent = (id: number) => {
    const students = selectedStudents.filter(student => student.id !== id);
    setSelectedStudents(students);
  };

  return (
    <>
      {isMobile ? (
        <MobileDrawer open={open} setIsOpen={setOpen} title={`Link Students`}>
          <div className="border-border-default bg-bg-card-subtle flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-text-default text-base font-semibold">Students List</h3>
            {!branches || loadingBranches ? (
              <Skeleton className="bg-bg-input-soft h-8 w-32" />
            ) : (
              <Select
                onValueChange={value => {
                  const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                  setBranchSelected(branch);
                }}
              >
                <SelectTrigger className="border-border-darker flex h-8! w-auto items-center gap-2 border">
                  <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-semibold">{branchSelected?.name}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {branches.data.content.map((branch: Branch) => (
                    <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-semibold">
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3 px-3 py-4 md:px-6">
            <SearchInput className="bg-bg-input-soft h-8 rounded-lg border-none" />
            <Button className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-default h-6 border px-1.5!">
              <XIcon className="text-icon-default-muted size-4" />
              <span className="text-text-default text-xs">Clear All</span>
            </Button>

            {!data || isPending ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <div className="border-border-default h-[300px] space-y-3 overflow-y-auto rounded-sm border p-3">
                {data?.data?.content.map((student: Student) => {
                  const isChecked = selectedStudents.find(std => std.id === student.id);
                  return (
                    <div key={student.id} className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                      <Checkbox
                        checked={!!isChecked}
                        onCheckedChange={checked => {
                          setSelectedStudents(prev => {
                            if (checked) {
                              return [...prev, { id: student.id, name: `${student.firstName} ${student.lastName}`, avatar: student.image }];
                            }
                            return prev.filter(std => std.id !== student.id);
                          });
                        }}
                        aria-label="Select"
                      />
                      <div className="flex items-center gap-2">
                        <Avatar username={`${student.firstName} ${student.lastName}`} className="size-10 md:size-8" />
                        <div className="">
                          <p className="text-text-default text-sm font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-text-subtle text-xs font-normal">{branchSelected?.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-bg-subtle border-border-default space-y-2 border-t px-4 py-3">
            <h3 className="text-text-default text-sm font-medium">Selected</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map(std => (
                <div
                  key={std.id}
                  className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs"
                >
                  <Avatar username={std.name} className="size-3.5" />
                  <span>{std.name}</span>
                  <XIcon onClick={() => removeStudent(std.id)} className="text-icon-default-muted size-3.5 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-card border-border-default flex items-center justify-between border-t px-3 py-4 md:px-4">
            <Button
              variant="outline"
              className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle hover:text-text-subtle h-7 border-none px-2 py-1 text-sm font-medium"
            >
              Cancel
            </Button>

            <Button
              onClick={() => setOpen(false)}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
            >
              <span className="text-sm font-medium">Link Students</span>
            </Button>
          </div>
        </MobileDrawer>
      ) : (
        <Modal
          className="bg-bg-card max-w-200! overflow-y-auto"
          open={open}
          setOpen={setOpen}
          title={`Link Students`}
          ActionButton={
            <Button
              onClick={() => setOpen(false)}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-7 px-2 py-1"
            >
              <span className="text-sm font-medium">Link Students</span>
            </Button>
          }
        >
          <div className="border-border-default bg-bg-card-subtle flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-text-default text-base font-semibold">Students List</h3>
            {!branches || loadingBranches ? (
              <Skeleton className="bg-bg-input-soft h-8 w-32" />
            ) : (
              <Select
                onValueChange={value => {
                  const branch = branches.data.content?.find((branch: Branch) => branch.uuid === value);
                  setBranchSelected(branch);
                }}
              >
                <SelectTrigger className="border-border-darker flex h-8! w-auto items-center gap-2 border">
                  <Image src="/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-semibold">{branchSelected?.name}</span>
                </SelectTrigger>
                <SelectContent className="bg-bg-card border-border-default">
                  {branches.data.content.map((branch: Branch) => (
                    <SelectItem key={branch.id} value={branch.uuid} className="text-text-default text-sm font-semibold">
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-3 px-3 py-4 md:px-6">
            <SearchInput className="bg-bg-input-soft h-8 rounded-lg border-none" />
            <Button className="bg-bg-state-secondary hover:bg-bg-state-secondary-hover! border-border-default h-6 border px-1.5!">
              <XIcon className="text-icon-default-muted size-4" />
              <span className="text-text-default text-xs">Clear All</span>
            </Button>

            {!data || isPending ? (
              <Skeleton className="bg-bg-input-soft h-20 w-full" />
            ) : (
              <div className="border-border-default h-[300px] space-y-3 overflow-y-auto rounded-sm border p-3">
                {data.data.content.map((student: Student) => {
                  const isChecked = selectedStudents.find(std => std.id === student.id);
                  return (
                    <div key={student.id} className="bg-bg-card border-border-darker flex items-center gap-3 rounded-lg border p-4">
                      <Checkbox
                        checked={!!isChecked}
                        onCheckedChange={checked => {
                          setSelectedStudents(prev => {
                            if (checked) {
                              return [...prev, { id: student.id, name: `${student.firstName} ${student.lastName}`, avatar: student.image }];
                            }
                            return prev.filter(std => std.id !== student.id);
                          });
                        }}
                        aria-label="Select"
                      />
                      <div className="flex items-center gap-2">
                        <Avatar username={`${student.firstName} ${student.lastName}`} className="size-10 md:size-8" url={student.image ?? ""} />
                        <div className="">
                          <p className="text-text-default text-sm font-medium">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-text-subtle text-xs font-normal">{branchSelected?.name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-bg-subtle border-border-default space-y-2 border-t px-4 py-3">
            <h3 className="text-text-default text-sm font-medium">Selected</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map(std => (
                <div
                  key={std.id}
                  className="bg-bg-badge-default border-border-default text-text-subtle flex items-center gap-1 rounded-full border p-1 text-xs"
                >
                  <Avatar username={std.name} className="size-3.5" />
                  <span>{std.name}</span>
                  <XIcon onClick={() => removeStudent(std.id)} className="text-icon-default-muted size-3.5 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
