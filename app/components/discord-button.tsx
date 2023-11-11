import React from "react";
import { Button } from "./button";
import { BsDiscord } from "react-icons/bs";
import { Link } from "@remix-run/react";

const discordUrl = "https://discord.gg/7uZ6PWf4Xv";

export function DiscordButton({ ...props }) {
  return (
    <Link to={discordUrl} target="_blank">
      <Button
        {...props}
        className="border-2 flex items-center gap-4 self-center p-4 my-6"
      >
        Join Discord <BsDiscord className="inline animate-bounce" />
      </Button>
    </Link>
  );
}
