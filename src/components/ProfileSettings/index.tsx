"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import User from "../Icons/User";
import { Shield } from "../Icons/Shield";
import { UserProfile } from "./UserProfile";

const tabs = [
  { id: "profile", label: "Profile Settings", icon: User },
  { id: "security", label: "Security", icon: Shield },
];
export const ProfileTab = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="">
      <div className="border-border-default flex gap-1 border-b px-8 py-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 border-none px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === id ? "text-text-default bg-bg-state-soft" : "text-text-subtle hover:bg-bg-state-soft!",
            )}
          >
            <Icon className="size-4" fill="var(--color-icon-default-muted)" />
            {label}
          </Button>
        ))}
      </div>

      {activeTab === "profile" && <UserProfile />}
    </div>
  );
};
