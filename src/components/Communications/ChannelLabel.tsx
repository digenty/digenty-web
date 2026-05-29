import { Mail, Message3, PhoneFill } from "@digenty/icons";
import { CampaignChannel } from "./types";

const channelMeta: Record<CampaignChannel, { icon: React.ReactNode; label: string }> = {
  SMS: {
    icon: <Message3 fill="var(--color-icon-default-muted)" className="size-4" />,
    label: "SMS",
  },
  Email: {
    icon: <Mail fill="var(--color-icon-default-muted)" className="size-4" />,
    label: "Email",
  },
  Whatsapp: {
    icon: <PhoneFill fill="var(--color-icon-default-muted)" className="size-4" />,
    label: "Whatsapp",
  },
};

export const ChannelLabel = ({ channel }: { channel: CampaignChannel }) => {
  const meta = channelMeta[channel];
  return (
    <div className="flex items-center gap-2">
      {meta.icon}
      <span className="text-text-default text-sm font-medium">{meta.label}</span>
    </div>
  );
};
