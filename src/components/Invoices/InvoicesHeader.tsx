"use client";

import { BookOpen, Calendar, GraduationCap, School } from "@digenty/icons";
import { Branch, BranchWithClassLevels, ClassType, Term, Terms } from "@/api/types";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import Image from "next/image";
import { useState } from "react";

import { MobileDrawer } from "../MobileDrawer";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

type InvoicesHeaderProps = {
  filter: {
    branchSelected?: Branch;
    classSelected?: ClassType;
    termSelected?: Term;
  };
  onFilterChange: (key: "branchSelected" | "classSelected" | "termSelected", value: Branch | ClassType | Term | undefined) => void;
  branches?: { data: BranchWithClassLevels[] };
  loadingBranches: boolean;
  classes?: { data: { content: ClassType[] } };
  loadingClasses: boolean;
  terms?: { data: Terms };
  loadingTerms: boolean;
};

export const InvoicesHeader = ({
  filter,
  onFilterChange,
  branches,
  loadingBranches,
  classes,
  loadingClasses,
  terms,
  loadingTerms,
}: InvoicesHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const activeSession = terms?.data?.academicSessionName;

  useBreadcrumb([{ label: "Invoices", url: "/staff/invoices" }]);

  return (
    <div>
      <div className="flex w-full justify-between align-middle">
        <h2 className="text-text-default text-xl font-semibold">Overview</h2>
        <div className="hidden gap-2 align-middle md:flex">
          {loadingBranches || !branches ? (
            <Skeleton className="bg-bg-input-soft h-8 w-32" />
          ) : (
            <Select
              value={filter.branchSelected ? String(filter.branchSelected.id) : ""}
              onValueChange={value => {
                const branch = branches.data?.find((b: BranchWithClassLevels) => String(b.branch.id) === value);
                onFilterChange("branchSelected", branch?.branch);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <Image src="/staff/icons/school.svg" alt="branch" width={14} height={14} />
                  <span className="text-text-default text-sm font-medium">{filter.branchSelected?.name ?? "Select Branch"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                {branches.data.map((b: BranchWithClassLevels) => (
                  <SelectItem key={b.branch.id} value={String(b.branch.id)} className="text-text-default text-sm font-medium">
                    {b.branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {loadingClasses ? (
            <Skeleton className="bg-bg-input-soft h-8 w-32" />
          ) : (
            <Select
              value={filter.classSelected ? String(filter.classSelected.id) : "none"}
              onValueChange={value => {
                if (value === "none") return onFilterChange("classSelected", undefined);
                const cls = classes?.data?.content?.find((c: ClassType) => String(c.id) === value);
                onFilterChange("classSelected", cls);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <GraduationCap fill="var(--color-icon-black-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium">{filter.classSelected?.name ?? "All Classes"}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="none" className="text-text-default text-sm font-medium">
                  All Classes
                </SelectItem>
                {classes?.data?.content?.map((c: ClassType) => (
                  <SelectItem key={c.id} value={String(c.id)} className="text-text-default text-sm font-medium">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {loadingTerms || !terms ? (
            <Skeleton className="bg-bg-input-soft h-8 w-32" />
          ) : (
            <Select
              value={filter.termSelected ? String(filter.termSelected.termId) : "none"}
              onValueChange={value => {
                if (value === "none") return onFilterChange("termSelected", undefined);
                const term = terms.data?.terms?.find((t: Term) => String(t.termId) === value);
                onFilterChange("termSelected", term);
              }}
            >
              <SelectTrigger className="border-border-darker h-8! w-auto border">
                <SelectValue>
                  <Calendar fill="var(--color-icon-black-muted)" className="size-4" />
                  <span className="text-text-default text-sm font-medium capitalize">
                    {filter.termSelected ? `${activeSession ?? ""} ${filter.termSelected.term.toLowerCase()}` : "All Terms"}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-bg-card border-border-default">
                <SelectItem value="none" className="text-text-default text-sm font-medium">
                  All Terms
                </SelectItem>
                {terms.data?.terms?.map((t: Term) => (
                  <SelectItem key={t.termId} value={String(t.termId)} className="text-text-default text-sm font-medium capitalize">
                    {activeSession} {t.term.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Button className="bg-bg-state-soft block size-7 rounded-md p-1.5 md:hidden" onClick={() => setIsFilterOpen(true)}>
          <Image src="/staff/icons/open-filter-modal.svg" alt="filter icon" width={20} height={20} />
        </Button>

        <MobileDrawer open={isFilterOpen} setIsOpen={setIsFilterOpen} title="Filter">
          <div className="flex w-full flex-col gap-4 px-3 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Branch</Label>
              </div>
              {loadingBranches || !branches ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  value={filter.branchSelected ? String(filter.branchSelected.id) : ""}
                  onValueChange={value => {
                    const branch = branches.data?.find((b: BranchWithClassLevels) => String(b.branch.id) === value);
                    onFilterChange("branchSelected", branch?.branch);
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal">
                    <SelectValue>
                      <span className="text-text-default text-sm">{filter.branchSelected?.name ?? "Select Branch"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    {branches.data.map((b: BranchWithClassLevels) => (
                      <SelectItem key={b.branch.id} value={String(b.branch.id)} className="text-text-default text-sm">
                        {b.branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <GraduationCap fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Class</Label>
              </div>
              {loadingClasses ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  value={filter.classSelected ? String(filter.classSelected.id) : "none"}
                  onValueChange={value => {
                    if (value === "none") return onFilterChange("classSelected", undefined);
                    const cls = classes?.data?.content?.find((c: ClassType) => String(c.id) === value);
                    onFilterChange("classSelected", cls);
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue>
                      <span className="text-text-default text-sm">{filter.classSelected?.name ?? "All Classes"}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm">
                      All Classes
                    </SelectItem>
                    {classes?.data?.content?.map((c: ClassType) => (
                      <SelectItem key={c.id} value={String(c.id)} className="text-text-default text-sm">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen fill="var(--color-icon-black-muted)" className="size-4" />
                <Label className="text-text-default text-sm font-medium">Term</Label>
              </div>
              {loadingTerms || !terms ? (
                <Skeleton className="bg-bg-input-soft h-9 w-full" />
              ) : (
                <Select
                  value={filter.termSelected ? String(filter.termSelected.termId) : "none"}
                  onValueChange={value => {
                    if (value === "none") return onFilterChange("termSelected", undefined);
                    const term = terms.data?.terms?.find((t: Term) => String(t.termId) === value);
                    onFilterChange("termSelected", term);
                  }}
                >
                  <SelectTrigger className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none px-3 py-2 text-left text-sm font-normal!">
                    <SelectValue>
                      <span className="text-text-default text-sm capitalize">
                        {filter.termSelected ? `${activeSession ?? ""} ${filter.termSelected.term.toLowerCase()}` : "All Terms"}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-bg-default border-border-default">
                    <SelectItem value="none" className="text-text-default text-sm">
                      All Terms
                    </SelectItem>
                    {terms.data?.terms?.map((t: Term) => (
                      <SelectItem key={t.termId} value={String(t.termId)} className="text-text-default text-sm capitalize">
                        {activeSession} {t.term.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <DrawerFooter className="border-border-default border-t">
            <div className="flex justify-between">
              <DrawerClose asChild>
                <Button className="bg-bg-state-soft text-text-subtle rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
              </DrawerClose>

              <Button
                onClick={() => setIsFilterOpen(false)}
                className="bg-bg-state-primary text-text-white-default rounded-md! px-4 py-2 text-sm tracking-[0.1rem]"
              >
                <span>Apply Filter</span>
              </Button>
            </div>
          </DrawerFooter>
        </MobileDrawer>
      </div>
    </div>
  );
};
