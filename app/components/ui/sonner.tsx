import { useTheme } from "remix-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, , { definedBy }] = useTheme();
  const mTheme = definedBy === "SYSTEM" ? "system" : theme;

  return (
    // <Sonner
    //   theme={mTheme as ToasterProps["theme"]}
    //   className="toaster group"
    //   style={
    //     {
    //       "--normal-bg": "var(--popover)",
    //       "--normal-text": "var(--popover-foreground)",
    //       "--normal-border": "var(--border)",
    //     } as React.CSSProperties
    //   }
    //   {...props}
    // />
    <Sonner
      theme={mTheme as ToasterProps["theme"]}
      className={`toaster group ${
        theme === "dark"
          ? // Dark mode styles
            "[&_.sonner-toast]:border-gray-700 [&_.sonner-toast]:bg-gray-800 [&_.sonner-toast]:text-gray-50 " +
            "[&_.sonner-toast]:shadow-lg [&_.sonner-toast]:shadow-gray-900/10"
          : // Light mode styles
            "[&_.sonner-toast]:border-gray-200 [&_.sonner-toast]:bg-white [&_.sonner-toast]:text-gray-900 " +
            "[&_.sonner-toast]:shadow-lg [&_.sonner-toast]:shadow-gray-500/10"
      } `}
      {...props}
    />
  );
};

export { Toaster };
