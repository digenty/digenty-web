import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";

const filterValues = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const PaymentFilter = () => {
  const [selected, setSelected] = useState(filterValues[0]);
  return (
    <div className="space-y-3">
      <p className="text-text-default text-xs font-medium">Class Payment Completion</p>

      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="border-border-darker h-8! w-auto border">
          <SelectValue className="text-text-default flex font-medium">
            <Calendar className="text-icon-black-muted size-4" />
            <p className="text-text-default text-sm">{selected}</p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          <SelectItem className="text-text-default" value="24/25 Third Term">
            24/25 Third Term
          </SelectItem>
          <SelectItem className="text-text-default" value="24/25 Second Term">
            24/25 Second Term
          </SelectItem>
          <SelectItem className="text-text-default" value="24/25 First Term">
            24/25 First Term
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
