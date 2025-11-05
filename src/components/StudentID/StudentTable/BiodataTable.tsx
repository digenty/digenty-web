import Building from "@/components/Icons/Building";
import { Calendar } from "@/components/Icons/Calendar";

import FirstAidKit from "@/components/Icons/FirstAidKit";
import Flag from "@/components/Icons/Flag";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
import PhoneFill from "@/components/Icons/PhoneFill";
import RedPacket from "@/components/Icons/RedPacket";
import User from "@/components/Icons/User";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
  { bio: "Email Address", detail: "damilarejohn@gmail.com", icon: <Mail fill="var(--color-icon-default-muted)" /> },
  { bio: "Primary Phone Number", detail: "07040000000", icon: <Phone size={16} /> },
  { bio: "Secondary Phone Number", detail: "07040000000", icon: <PhoneFill fill="var(--color-icon-default-muted)" /> },
];

export function BiodataTable() {
  const isNumber = (val: string) => /^\d+(\.\d+)?$/.test(val.trim());

  return (
    <div className="bg-bg-muted mb-20 w-full overflow-hidden rounded-md p-[24px]">
      <Table>
        <TableBody>
          {biodata.map(item => {
            const numeric = isNumber(item.detail.replace(/[₦,]/g, ""));
            return (
              <TableRow key={item.bio} className="border-border-default border-b">
                <TableCell className="text-text-muted flex items-center gap-2 py-4 font-medium">
                  <div className="text-muted-foreground">{item.icon}</div>
                  {item.bio}
                </TableCell>

                <TableCell className={`text-right text-sm font-semibold ${numeric ? "font-semibold text-blue-600" : "text-text-default"}`}>
                  {item.detail}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
