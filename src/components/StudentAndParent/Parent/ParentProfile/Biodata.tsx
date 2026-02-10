import { Parent } from "@/api/types";
import Building from "@/components/Icons/Building";
import Flag from "@/components/Icons/Flag";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
import PhoneFill from "@/components/Icons/PhoneFill";
import User from "@/components/Icons/User";
import { Phone } from "lucide-react";

export const Biodata = ({ parent }: { parent: Parent }) => {
  const biodata = [
    { bio: "Branch", detail: parent.branchId, icon: <Building fill="var(--color-icon-default-muted)" /> },
    { bio: "Gender", detail: parent.gender.toLowerCase(), icon: <User fill="var(--color-icon-default-muted)" /> },
    { bio: "Address", detail: parent.address, icon: <Map fill="var(--color-icon-default-muted)" /> },
    { bio: "Nationality", detail: parent.nationality, icon: <Flag fill="var(--color-icon-default-muted)" /> },
    { bio: "State of Origin", detail: parent.stateOfOrigin, icon: <Flag fill="var(--color-icon-default-muted)" /> },
    { bio: "Email Address", detail: parent.email, icon: <Mail fill="var(--color-icon-default-muted)" /> },
    { bio: "Primary Phone Number", detail: parent.phoneNumber, icon: <Phone size={16} /> },
    { bio: "Secondary Phone Number", detail: parent.secondaryPhoneNumber, icon: <PhoneFill fill="var(--color-icon-default-muted)" /> },
  ];

  return (
    <div className="bg-bg-muted border-border-default w-full overflow-hidden rounded-md border p-6">
      {biodata.map(item => {
        return (
          <div key={item.bio} className="border-border-default flex items-center justify-between gap-2 border-b py-2.5 last:border-none">
            <div className="flex max-w-2/4 flex-1 items-center gap-2">
              {item.icon}
              <span className="text-text-muted truncate text-sm font-medium">{item.bio}</span>
            </div>
            <span className="text-text-default max-w-2/4 truncate text-right text-sm font-medium capitalize">{item.detail || "--"}</span>
          </div>
        );
      })}
    </div>
  );
};
