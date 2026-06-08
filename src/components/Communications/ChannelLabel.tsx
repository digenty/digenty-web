import { Mail, Message3, PhoneFill } from "@digenty/icons";
import { CampaignChannel, CHANNEL_LABEL } from "./types";

const channelMeta: Record<CampaignChannel, { icon: React.ReactNode }> = {
  SMS: {
    icon: <Message3 fill="var(--color-icon-default-muted)" className="size-4" />,
  },
  EMAIL: {
    icon: <Mail fill="var(--color-icon-default-muted)" className="size-4" />,
  },
  WHATSAPP: {
    icon: <PhoneFill fill="var(--color-icon-default-muted)" className="size-4" />,
  },
};

export const ChannelLabel = ({ channel }: { channel: CampaignChannel }) => {
  const meta = channelMeta[channel];
  return (
    <div className="flex items-center gap-2">
      {meta?.icon}
      <span className="text-text-default text-sm font-medium">{CHANNEL_LABEL[channel] ?? channel}</span>
    </div>
  );
};
