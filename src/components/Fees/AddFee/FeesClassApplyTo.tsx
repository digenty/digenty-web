"use client";

import { ArrowUpSFill } from "@/components/Icons/ArrowUpSFill";
import BookOpen from "@/components/Icons/BookOpen";
import GraduationCap from "@/components/Icons/GraduationCap";
import School from "@/components/Icons/School";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React, { useState } from "react";

const classesapply = [
  {
    id: 0,
    classname: "JSS 1",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
  {
    id: 1,
    classname: "JSS 2",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
  {
    id: 2,
    classname: "JSS 3",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
  {
    id: 3,
    classname: "SSS 1",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
  {
    id: 4,
    classname: "SSS 2",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
  {
    id: 5,
    classname: "SSS 3",
    armA: "Arm A",
    armB: "Arm B",
    armC: "Arm C",
  },
];

const FeesClassApplyTo = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  type SelectionState = Record<number, { all: boolean; arms: { armA: boolean; armB: boolean; armC: boolean } }>;

  const [selection, setSelection] = useState<SelectionState>(() => {
    const init: SelectionState = {} as SelectionState;
    classesapply.forEach(cl => {
      init[cl.id] = { all: false, arms: { armA: false, armB: false, armC: false } };
    });
    return init;
  });

  const toggleOpen = (id: number) => setOpenId(prev => (prev === id ? null : id));

  const handleParentChange = (id: number, checked: boolean) => {
    setSelection(prev => ({
      ...prev,
      [id]: { all: checked, arms: { armA: checked, armB: checked, armC: checked } },
    }));
  };

  const handleArmChange = (id: number, armKey: keyof SelectionState[number]["arms"], checked: boolean) => {
    setSelection(prev => {
      const prevItem = prev[id] || { all: false, arms: { armA: false, armB: false, armC: false } };
      const arms = { ...prevItem.arms, [armKey]: checked };
      const all = Object.values(arms).every(Boolean);
      return { ...prev, [id]: { all, arms } };
    });
  };

  return (
    <div className="border-border-default border-b pb-6">
      <div className="border-border-default border-t border-r border-l">
        <div className="bg-bg-muted flex w-full items-center gap-3 px-6 py-3">
          <School fill="var(--color-icon-default)" />
          <div className="text-text-default">Classes</div>
        </div>
        <div className="">
          {classesapply.map(cl => (
            <div className="border-border-default border-b p-3" key={cl.id}>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox checked={selection[cl.id]?.all} onCheckedChange={(v: boolean) => handleParentChange(cl.id, !!v)} />
                  <GraduationCap fill="var(--color-icon-default-muted)" />
                  <span className="text-text-default text-sm font-medium">{cl.classname}</span>
                </div>

                <Button
                  onClick={() => toggleOpen(cl.id)}
                  className={`bg-bg-state-soft! hover:bg-bg-state-soft-hover! flex h-6! w-6! items-center justify-center rounded-sm ${
                    openId === cl.id ? "rotate-180" : ""
                  }`}
                >
                  <ArrowUpSFill fill="var(--color-icon-default-subtle)" />
                </Button>
              </div>

              {openId === cl.id && (
                <div className="flex flex-col gap-3 px-8 pt-3">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selection[cl.id]?.arms.armA} onCheckedChange={(v: boolean) => handleArmChange(cl.id, "armA", !!v)} />
                    <BookOpen />
                    <span className="text-text-default text-sm font-medium">{cl.armA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selection[cl.id]?.arms.armB} onCheckedChange={(v: boolean) => handleArmChange(cl.id, "armB", !!v)} />
                    <BookOpen />
                    <span className="text-text-default text-sm font-medium">{cl.armB}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selection[cl.id]?.arms.armC} onCheckedChange={(v: boolean) => handleArmChange(cl.id, "armC", !!v)} />
                    <BookOpen />
                    <span className="text-text-default text-sm font-medium">{cl.armC}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeesClassApplyTo;
