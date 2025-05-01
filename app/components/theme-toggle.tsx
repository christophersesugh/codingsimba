import { Theme, useTheme } from "remix-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "~/lib/shadcn";

export function ThemeToggle() {
  const [theme, setTheme, { definedBy }] = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          {/* System Theme Icon */}
          <Monitor
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              definedBy === "SYSTEM"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0",
            )}
            aria-hidden="true"
          />
          {/* Light Theme Icon */}
          <Sun
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              theme === "light" ? "rotate-0 scale-100" : "-rotate-90 scale-0",
            )}
            aria-hidden="true"
          />
          {/* Dark Theme Icon */}
          <Moon
            className={cn(
              "absolute h-[1.2rem] w-[1.2rem] transition-all",
              theme === "dark" && definedBy !== "SYSTEM"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0",
            )}
            aria-hidden="true"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(null)}>
          System
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
