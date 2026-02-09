import { StudentResult } from "@/components/StudentResult";
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";

const termsOptions = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export default function StudentAcademicRecord() {
  const [termSelected, setTermSelected] = useState(termsOptions[0]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Academic Records</h2>
        <Select value={termSelected} onValueChange={setTermSelected}>
          <SelectTrigger className="border-border-darker h-8 w-auto border focus-visible:ring-0">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Calendar className="text-icon-black-muted size-4" />
                <span className="text-text-default text-sm font-semibold">{termSelected}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-bg-card border-border-default">
            {termsOptions.map(term => (
              <SelectItem key={term} value={term} className="text-text-default text-sm font-semibold">
                {term}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Student result table */}
      <div className="md:px-25 lg:px-35 xl:px-40">
        <StudentResult />
      </div>
    </div>
  );
}
