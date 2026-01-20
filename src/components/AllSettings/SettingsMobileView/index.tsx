import Link from "next/link";
import { SETTINGS_NAV } from "../settingsConstants";
import { usePathname } from "next/navigation";
import { ArrowRightS } from "@/components/Icons/ArrowRightS";
import { Avatar } from "@/components/Avatar";

export const SettingsMobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="">
      <div className="text-text-default text-lg font-semibold">Settings</div>
      <div className="bg-bg-muted mt-3 mb-6 flex items-center gap-3 rounded-md p-3">
        <Avatar username="Damilare John" className="size-10" />
        <div className="flex flex-col gap-1">
          <div className="text-text-default text-sm font-semibold">Digenty Technology School</div>
          <div className="text-text-muted text-xs">damilarejohn@gmail.com</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-md p-0">
        {SETTINGS_NAV.map(item => {
          const active = pathname === item.url;

          return (
            <Link
              key={item.url}
              href={item.url}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center justify-between py-4 text-sm font-medium transition-colors ${
                active ? "bg-bg-state-soft-hover text-text" : "text-text-muted hover:bg-bg-state-soft-hover"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <item.icon className="h-5 w-5" fill="var(--color-icon-default-muted)" />}
                <span>{item.label}</span>
              </div>

              <ArrowRightS fill="var(--color-icon-default-disabled)" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
