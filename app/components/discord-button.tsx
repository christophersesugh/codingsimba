import { BsDiscord } from "react-icons/bs";
import { Link } from "@remix-run/react";
import { Button } from "./ui/button";

const discordUrl = "https://discord.gg/7uZ6PWf4Xv";

export function DiscordButton({ ...props }) {
  return (
    <Button
      {...props}
      className="border-2 flex items-center gap-4 self-center p-4 my-6"
      asChild
    >
      <Link to={discordUrl} target="_blank" rel="noreferrer">
        Join Discord <BsDiscord className="inline animate-bounce" />
      </Link>
    </Button>
  );
}
