"use client";

import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

type ScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  initialDate: string | null;
  initialTime: string | null;
  onConfirm: (date: string, time: string) => void;
};

export const ScheduleDialog = ({ open, onClose, initialDate, initialTime, onConfirm }: ScheduleDialogProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    if (initialDate) setDate(new Date(initialDate));
    if (initialTime) setTime(initialTime);
  }, [initialDate, initialTime, open]);

  const handleConfirm = () => {
    if (!date || !time) return;
    onConfirm(date.toISOString(), time);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="bg-bg-card border-border-default sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-default text-lg font-semibold">Schedule Campaign</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-bg-input-soft! text-text-default flex h-9 w-full items-center justify-start gap-2 rounded-md border-none px-3 text-left text-sm font-normal"
                >
                  <CalendarIcon className="text-icon-default-muted size-4" />
                  {date ? date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-bg-card border-border-default w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-text-default text-sm font-medium">Time</Label>
            <div className="relative">
              <Clock className="text-icon-default-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="bg-bg-input-soft! text-text-default h-9 w-full rounded-md border-none pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={onClose} className="bg-bg-state-soft text-text-subtle h-8 rounded-md px-3 py-1.5 text-sm font-medium">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!date || !time}
            className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-8 rounded-md px-3 py-1.5 text-sm font-medium"
          >
            Confirm Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
