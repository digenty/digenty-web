import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { useState } from "react";

const filterValues = ["24/25 Third Term", "24/25 Second Term", "24/25 First Term"];

export const PaymentFilter = () => {
  const [selected, setSelected] = useState(filterValues[0]);
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-zinc-950">Class Payment Completion</p>

      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="border-default-transparent/15 w-[181px] border focus-visible:ring-0 h-8!">
          <SelectValue className="text-default-transparent flex font-medium">
            <Calendar className="size-4 text-zinc-500" />
            <p className="text-sm">{selected}</p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24/25 Third Term">24/25 Third Term</SelectItem>
          <SelectItem value="24/25 Second Term">24/25 Second Term</SelectItem>
          <SelectItem value="24/25 First Term">24/25 First Term</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
