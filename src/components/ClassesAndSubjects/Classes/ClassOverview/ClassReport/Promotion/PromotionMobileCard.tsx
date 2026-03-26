import { StudentCumulative } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import ArrowDown from "@/components/Icons/ArrowDown";
import ArrowUp from "@/components/Icons/ArrowUp";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

import { Decision } from "..";
import { PromotionDecisionModal } from "./PromotionDecisionModal";

// const actions = ["Promote", "Repeat", "Double Promotion"];

export const PromotionMobileCard = ({
  student,
  activeStudent,
  setActiveStudent,
  decisions,
  setDecisions,
  promotionType,
}: {
  student: StudentCumulative;
  activeStudent?: number;
  setActiveStudent: React.Dispatch<React.SetStateAction<number | undefined>>;
  decisions: Decision[];
  setDecisions: Dispatch<SetStateAction<Decision[]>>;
  promotionType: string;
}) => {
  // const [actionSelected, setActionSelected] = useState(actions[0]);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  const decision = decisions.find(d => d.studentId === student.studentId);

  const toggleCard = () => {
    setActiveStudent(prev => (prev === student.studentId ? undefined : student.studentId));
  };

  const getButtonText = () => {
    if (!decision) return "Set Decision";
    if (promotionType === "PROMOTE_ALL") return "Next Class";
    if (decision.status === "PROMOTED" && decision.className && decision.armName) {
      return `Promote to ${decision.className} ${decision.armName}`;
    }
    if (decision.status === "REPEAT") return "Repeat";
    return "Set Decision";
  };

  return (
    <li key={student.studentId} className="border-border-default w-full rounded-sm border">
      <div
        onClick={toggleCard}
        aria-expanded={activeStudent === student.studentId}
        className="bg-bg-subtle flex w-full items-center justify-between rounded-sm p-3"
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10" />
          <div className="space-y-1.5 text-left">
            <div className="text-text-default text-sm font-medium">{student.studentName}</div>
          </div>
        </div>
        <div>
          {activeStudent === student.studentId ? (
            <ArrowUp fill="var(--color-icon-default-muted)" />
          ) : (
            <ArrowDown fill="var(--color-icon-default-muted)" />
          )}
        </div>
      </div>

      <div
        className={`text-sm transition-all duration-200 ${activeStudent === student.studentId ? "border-border-default flex flex-col border-t" : "hidden"}`}
      >
        <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            1st Term %
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.firstTermPercentage}</div>
        </div>

        <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            2nd Term %
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.secondTermPercentage}</div>
        </div>

        <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            3rd Term %
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">{student.thirdTermPercentage}</div>
        </div>

        <div className="border-border-default flex h-12 border-b text-center last:border-b-0">
          <div className="bg-bg-subtle text-text-muted border-border-default flex flex-1 items-center justify-center border-r px-4 py-2">
            Cumulative %
          </div>
          <div className="text-text-default flex flex-1 items-center justify-center text-sm">
            {(student.firstTermPercentage + student.secondTermPercentage + student.thirdTermPercentage) / 3}
          </div>
        </div>

        <div className="flex h-[46px] items-center justify-center px-3 py-1 text-center">
          <Button
            className="border-border-darker bg-bg-state-secondary! text-text-default h-8! w-full justify-between border px-4 font-normal"
            onClick={() => setShowDecisionModal(true)}
          >
            {getButtonText()}
            <ChevronDown className="text-text-muted" />
          </Button>
        </div>
      </div>

      {showDecisionModal && (
        <PromotionDecisionModal
          open={showDecisionModal}
          onOpenChange={setShowDecisionModal}
          selectedStudents={[{ studentId: student.studentId, studentName: student.studentName }]}
          setDecisions={newDecisions => {
            setDecisions(prev => {
              const updated = [...prev];
              newDecisions.forEach(nd => {
                const index = updated.findIndex(u => u.studentId === nd.studentId);
                if (index !== -1) {
                  updated[index] = nd;
                } else {
                  updated.push(nd);
                }
              });
              return updated;
            });
          }}
          promotionType={promotionType}
        />
      )}
    </li>
  );
};
