import Building from "@/components/Icons/Building";
import Calendar from "@/components/Icons/Calendar";
import FirstAidKit from "@/components/Icons/FirstAidKit";
import Flag from "@/components/Icons/Flag";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
import PhoneFill from "@/components/Icons/PhoneFill";
import RedPacket from "@/components/Icons/RedPacket";
import User from "@/components/Icons/User";
import { Phone } from "lucide-react";

const biodata = [
  { bio: "Branch", detail: "Lawanson", icon: <Building fill="var(--color-icon-default-muted)" /> },
  { bio: "Joined School", detail: "Lawanson", icon: <Calendar fill="var(--color-icon-default-muted)" /> },
  { bio: "Gender", detail: "Male", icon: <User fill="var(--color-icon-default-muted)" /> },
  { bio: "Boarding Status", detail: "Day", icon: <RedPacket fill="var(--color-icon-default-muted)" /> },
  { bio: "Date of Birth", detail: "20/09/2007 • 12 Years", icon: <Calendar fill="var(--color-icon-default-muted)" /> },
  { bio: "Medical Information", detail: "N/A", icon: <Calendar fill="var(--color-icon-default-muted)" /> },
  { bio: "Emergency Contact", detail: "0704 000 0000", icon: <FirstAidKit fill="var(--color-icon-default-muted)" /> },
  { bio: "Nationality", detail: "Nigerian", icon: <Flag fill="var(--color-icon-default-muted)" /> },
  { bio: "State of Origin", detail: "Ogun State", icon: <Flag fill="var(--color-icon-default-muted)" /> },
  { bio: "Address", detail: "56, Olumiyiwa Street, Isolo, Lagos", icon: <Map fill="var(--color-icon-default-muted)" /> },
  { bio: "Email Address", detail: "damilarejohn@gmail.comncvjdssmndfbsdbf,mb,fmbm,bfmfaf", icon: <Mail fill="var(--color-icon-default-muted)" /> },
  { bio: "Primary Phone Number", detail: "07040000000", icon: <Phone size={16} /> },
  { bio: "Secondary Phone Number", detail: "07040000000", icon: <PhoneFill fill="var(--color-icon-default-muted)" /> },
];

export const Biodata = () => {
  return (
    <div className="bg-bg-muted border-border-default w-full overflow-hidden rounded-md border p-6">
      {biodata.map(item => {
        return (
          <div key={item.bio} className="border-border-default flex items-center justify-between gap-2 border-b py-2.5 last:border-none">
            <div className="flex flex-1 items-center gap-2">
              {item.icon}
              <span className="text-text-muted text-sm font-medium">{item.bio}</span>
            </div>
            <span className="text-text-default max-w-1/3 truncate text-right text-sm font-medium">{item.detail}</span>
          </div>
        );
      })}
    </div>
  );
};
