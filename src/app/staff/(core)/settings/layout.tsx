import SettingsBigScreenLayout from "@/components/AllSettings/SettingsBigScreen/SettingsBigScreenLayout";
import React from "react";

export const metadata = {
  title: "Settings",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <SettingsBigScreenLayout>{children}</SettingsBigScreenLayout>;
}
