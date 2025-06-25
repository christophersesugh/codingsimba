import { cn } from "~/utils/misc";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Top gradient */}
      <div
        className={cn(
          "absolute top-0 right-0 left-0 h-[500px]",
          "bg-gradient-to-b from-blue-500/5 via-blue-500/2 to-transparent",
        )}
      />

      {/* Grid pattern */}
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]",
          "bg-[size:24px_24px]",
        )}
      />

      {/* Radial gradient */}
      <div
        className={cn(
          "absolute top-[20%] right-[10%] left-[10%] h-[500px]",
          "bg-radial-gradient from-blue-500/10 via-transparent to-transparent",
        )}
      />

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-float-slow rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute right-1/3 bottom-1/3 h-96 w-96 animate-float rounded-full bg-blue-500/5 blur-3xl" />
    </div>
  );
}
