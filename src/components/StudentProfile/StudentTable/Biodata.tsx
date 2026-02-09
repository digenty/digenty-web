import { Student } from "@/api/types";
import Building from "@/components/Icons/Building";
import Calendar from "@/components/Icons/Calendar";
import FirstAidKit from "@/components/Icons/FirstAidKit";
import Flag from "@/components/Icons/Flag";
import Mail from "@/components/Icons/Mail";
import Map from "@/components/Icons/Map";
import PhoneFill from "@/components/Icons/PhoneFill";
import RedPacket from "@/components/Icons/RedPacket";
import User from "@/components/Icons/User";
import { getYearDifference } from "@/lib/utils";
import { Phone } from "lucide-react";

export const Biodata = ({ student }: { student: Student }) => {
  const biodata = [
    { bio: "Branch", detail: student.branch, icon: <Building fill="var(--color-icon-default-muted)" /> },
    { bio: "Joined School", detail: student.joinedSchoolSession, icon: <Calendar fill="var(--color-icon-default-muted)" /> },
    { bio: "Gender", detail: student.gender.toLowerCase(), icon: <User fill="var(--color-icon-default-muted)" /> },
    { bio: "Boarding Status", detail: student.boardingStatus.toLowerCase(), icon: <RedPacket fill="var(--color-icon-default-muted)" /> },
    {
      bio: "Date of Birth",
      detail: `${student.dateOfBirth} • ${getYearDifference(student.dateOfBirth)} Years`,
      icon: <Calendar fill="var(--color-icon-default-muted)" />,
    },
    { bio: "Medical Information", detail: student.medicalInformation, icon: <Calendar fill="var(--color-icon-default-muted)" /> },
    { bio: "Emergency Contact", detail: student.emergencyContactNumber, icon: <FirstAidKit fill="var(--color-icon-default-muted)" /> },
    { bio: "Nationality", detail: student.nationality, icon: <Flag fill="var(--color-icon-default-muted)" /> },
    { bio: "State of Origin", detail: student.stateOfOrigin, icon: <Flag fill="var(--color-icon-default-muted)" /> },
    { bio: "Address", detail: student.address, icon: <Map fill="var(--color-icon-default-muted)" /> },
    { bio: "Email Address", detail: student.email, icon: <Mail fill="var(--color-icon-default-muted)" /> },
    { bio: "Primary Phone Number", detail: student.phoneNumber, icon: <Phone size={16} /> },
    { bio: "Secondary Phone Number", detail: student.secondaryPhoneNumber, icon: <PhoneFill fill="var(--color-icon-default-muted)" /> },
  ];

  return (
    <div className="bg-bg-muted border-border-default w-full overflow-hidden rounded-md border p-6">
      {biodata.map(item => {
        return (
          <div key={item.bio} className="border-border-default flex items-center justify-between gap-2 border-b py-2.5 last:border-none">
            <div className="flex flex-1 items-center gap-2">
              {item.icon}
              <span className="text-text-muted text-sm font-medium">{item.bio}</span>
            </div>
            <span className="text-text-default max-w-1/3 truncate text-right text-sm font-medium capitalize">{item.detail || "--"}</span>
          </div>
        );
      })}
    </div>
  );
};
