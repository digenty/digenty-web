import { cn, generateRandomColor } from "@/lib/utils";
import { Avatar as AvatarComponent, AvatarImage, AvatarFallback } from "./ui/avatar";

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
      <AvatarFallback className={generateRandomColor(username)}>{username.slice(0, 1).toUpperCase()}</AvatarFallback>
    </AvatarComponent>
  );
};
