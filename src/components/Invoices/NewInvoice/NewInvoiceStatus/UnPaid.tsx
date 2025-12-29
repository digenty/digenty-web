"use client";

import { Switch } from "@/components/ui/switch";
import { NoteEditor } from "./NoteEditor";
import { useState } from "react";

export const UnPaid = () => {
  const [note, setNote] = useState("Your note");
  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="mt-6">
          <NoteEditor value={note} onChange={setNote} />
        </div>
        <div className="flex items-center">
          <div className="w-full max-w-107">
            <div className="text-text-default text-sm font-medium">Show Account Details</div>
            <div className="text-text-subtle text-sm font-normal">
              Show the school account in payment and checkout on the invoice for offline payments
            </div>
          </div>

          <Switch />
        </div>
      </div>
    </>
  );
};
