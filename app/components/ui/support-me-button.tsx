import { Button } from "./button";
import { Link } from "react-router";
import { Coffee } from "lucide-react";

export function SupportMeButton() {
  const BUY_ME_A_COFFEE_URL =
    "https://buymeacoffee.com/christophersesugh" as const;
  return (
    <Button
      className="!bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90"
      aria-label="Support me on Buy Me a Coffee"
      asChild
    >
      <Link
        to={BUY_ME_A_COFFEE_URL}
        prefetch="intent"
        rel="noopener noreferrer nofollow"
        target="_blank"
      >
        <Coffee className="mr-2 size-4" />
        Buy me a coffee
      </Link>
    </Button>
  );
}
