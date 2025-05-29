import type React from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "~/lib/shadcn";

interface CalloutProps {
  variant?: "info" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutVariants = {
  info: {
    container:
      "border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-blue-100/40 dark:border-blue-500/20 dark:from-blue-950/40 dark:to-blue-900/20 shadow-blue-100/50 dark:shadow-blue-950/20",
    iconBg: "bg-blue-500 dark:bg-blue-400",
    icon: "text-white dark:text-blue-950",
    title: "text-blue-900 dark:text-blue-100",
    content: "text-blue-800/90 dark:text-blue-200/90",
    accent: "bg-blue-500 dark:bg-blue-400",
  },
  warning: {
    container:
      "border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-amber-100/40 dark:border-amber-500/20 dark:from-amber-950/40 dark:to-amber-900/20 shadow-amber-100/50 dark:shadow-amber-950/20",
    iconBg: "bg-amber-500 dark:bg-amber-400",
    icon: "text-white dark:text-amber-950",
    title: "text-amber-900 dark:text-amber-100",
    content: "text-amber-800/90 dark:text-amber-200/90",
    accent: "bg-amber-500 dark:bg-amber-400",
  },
  error: {
    container:
      "border-red-200/60 bg-gradient-to-r from-red-50/80 to-red-100/40 dark:border-red-500/20 dark:from-red-950/40 dark:to-red-900/20 shadow-red-100/50 dark:shadow-red-950/20",
    iconBg: "bg-red-500 dark:bg-red-400",
    icon: "text-white dark:text-red-950",
    title: "text-red-900 dark:text-red-100",
    content: "text-red-800/90 dark:text-red-200/90",
    accent: "bg-red-500 dark:bg-red-400",
  },
};

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const styles = calloutVariants[variant];
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        styles.container,
        className,
      )}
    >
      {/* Accent line */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 transition-all duration-300 group-hover:w-1.5",
          styles.accent,
        )}
      />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_currentColor_1px,_transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative p-6">
        <div className="flex items-start gap-4">
          {/* Icon container */}
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110",
              styles.iconBg,
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-transform duration-300 group-hover:scale-110",
                styles.icon,
              )}
            />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {title && (
              <h5
                className={cn(
                  "mb-3 text-lg font-semibold capitalize leading-tight tracking-tight transition-colors duration-300",
                  styles.title,
                )}
              >
                {variant}
              </h5>
            )}
            <div
              className={cn(
                "text-sm leading-relaxed transition-colors duration-300 [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs dark:[&_code]:bg-white/10 [&_p:last-child]:mb-0 [&_p]:mb-2 [&_strong]:font-semibold",
                styles.content,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl opacity-0 blur transition-opacity duration-300 group-hover:opacity-20",
          styles.accent,
        )}
      />
    </div>
  );
}
