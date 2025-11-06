import { cn } from "@/lib/utils";
import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Avatar = ({
  username,
  url = "https://picsum.photos/seed/20/200/300",
  className,
}: {
  username: string;
  url?: string;
  className?: string;
}) => {
  return (
    <AvatarComponent className={cn(className)}>
      <AvatarImage src={url} />
      <AvatarFallback className="bg-bg-basic-gray-accent border-border-default text-text-white-default border text-xs font-medium">
        {username.slice(0, 1).toUpperCase()}
      </AvatarFallback>
    </AvatarComponent>
  );
};
