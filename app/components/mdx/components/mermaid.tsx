import React from "react";
import mermaid from "mermaid";
import { createId as cuid } from "@paralleldrive/cuid2";
import { useTheme } from "remix-themes";

export function Mermaid({ chart }: { chart: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [theme] = useTheme();

  const isDark = theme === "dark";

  React.useEffect(() => {
    if (ref.current) {
      const uniqueId = `mermaid-${cuid()}`;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
      });

      mermaid
        .render(uniqueId, chart)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
            setError(null);
          }
        })
        .catch((err) => {
          console.error("Mermaid rendering error:", err);
          setError("Failed to render diagram");
          if (ref.current) {
            ref.current.innerHTML = `<div class="text-red-500 p-4 border border-red-300 rounded">Error rendering diagram: ${err.message}</div>`;
          }
        });
    }
  }, [chart, isDark]);

  if (error) {
    return <div className="mermaid text-red-500">{error}</div>;
  }

  return <div ref={ref} className="mermaid flex justify-center" />;
}
