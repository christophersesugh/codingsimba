import { DiscIcon as Discord } from "lucide-react";
import { Link } from "react-router";

export function DiscordBadge() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        to="https://discord.gg/7uZ6PWf4Xv"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full bg-[#5865F2] px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#4752C4]"
        aria-label="Join the Discord community"
      >
        <Discord className="size-5" />
        <span>Join Discord</span>
      </Link>
    </div>
  );
}
