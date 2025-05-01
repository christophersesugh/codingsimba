import React from "react";
import {
  SandpackProvider,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import { atomDark, ecoLight } from "@codesandbox/sandpack-themes";
import { Code, Maximize, Minimize } from "lucide-react";

import { cn } from "~/lib/shadcn";
import { Theme, useTheme } from "remix-themes";
import {
  CopyCode,
  RefreshButton,
  RunButton,
  SandpackTabs,
  ShowConsole,
  StatusIndicator,
  type ViewProps,
} from "./sandpack-components";
import { Button } from "~/components/ui/button";
import { useMobile } from "~/hooks/use-mobile";

export type SandpackTemplate =
  | "static"
  | "vanilla"
  | "vanilla-ts"
  | "vite-react"
  | "vite-react-ts"
  | "node";

export interface SandpackConfig {
  files?: Record<string, string>;
  template: string;
  options?: {
    visibleFiles?: string[];
    activeFile?: string;
    showLineNumbers?: boolean;
    showInlineErrors?: boolean;
    editorHeight?: string;
    template?: SandpackTemplate;
    theme?: "light" | "dark" | "auto";
    autorun?: boolean;
    customSetup?: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
  };
}

const defaultOptions = {
  showLineNumbers: true,
  showInlineErrors: true,
  showTabs: false,
  editorHeight: "360px",
  template: "react",
  theme: "auto",
  autorun: true,
};

const templateMap: Record<string, string> = {
  vite_react: "react",
  vite_react_ts: "react",
  vanilla: "javascript",
  vanilla_ts: "typescript",
  static: "HTML/CSS/JS",
  node: "Node.js",
};

export function StylishSandpack({
  files,
  template,
  options = {},
}: SandpackConfig) {
  const [theme] = useTheme();
  const isMobile = useMobile();
  const [activeView, setActiveView] = React.useState<ViewProps>("split");
  const [showConsole, setShowConsole] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const sandpackRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // On mobile, default to "preview" view instead of "split"
  React.useEffect(() => {
    if (isMobile && activeView === "split") {
      setActiveView("preview");
    }
  }, [isMobile, activeView]);

  // Determine what to show based on activeView and device type
  const showPreview =
    activeView === "preview" || (activeView === "split" && !isMobile);
  const showEditor =
    activeView === "editor" || (activeView === "split" && !isMobile);

  const spTemp = React.useMemo(
    () => template.replace("_", "-") as SandpackTemplate,
    [template],
  );
  const isDarkMode = theme === Theme.DARK;

  const mergedOptions = React.useMemo(
    () => ({
      ...defaultOptions,
      ...options,
    }),
    [options],
  );

  const templateLabel = templateMap[spTemp] || "Javascript";

  const handleFullscreenChange = React.useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  React.useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = React.useCallback(() => {
    if (!isFullscreen && sandpackRef.current) {
      sandpackRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }, [isFullscreen]);

  const renderPreviewSection = React.useCallback(
    () => (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b p-1">
          <RunButton />
          <ShowConsole
            showConsole={showConsole}
            setShowConsole={setShowConsole}
          />
          <RefreshButton />
        </div>

        <div className="h-full">
          <SandpackPreview
            className={cn({
              "!h-[70%]": showConsole,
              "!h-full": !showConsole,
            })}
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
          />

          {showConsole && (
            <div
              className={cn("border-t", {
                "!h-[30%]": showConsole,
                "!h-0": !showConsole,
              })}
            >
              <SandpackConsole resetOnPreviewRestart />
            </div>
          )}
        </div>
      </div>
    ),
    [showConsole],
  );

  return (
    <div
      ref={sandpackRef}
      className={cn(
        "overflow-hidden rounded-xl border bg-gray-100 transition-all duration-300 dark:bg-gray-700",
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none" : "",
      )}
    >
      <SandpackProvider
        theme={isDarkMode ? atomDark : ecoLight}
        template={spTemp}
        files={files}
        options={{
          autorun: mergedOptions.autorun,
          recompileMode: "delayed",
          recompileDelay: 300,

          classes: {
            "sp-wrapper": "sandpack-wrapper",
            "sp-preview": "sandpack-preview",
            "sp-console": "sandpack-console",
            "sp-editor": "sandpack-editor",
          },
        }}
        customSetup={mergedOptions.customSetup}
      >
        <div
          className={cn(
            "flex h-8 items-center justify-between border-b px-2 pb-2",
            {
              "h-full py-1": isFullscreen,
            },
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium">
              <Code className="size-4" />
              <span className="capitalize">{templateLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SandpackTabs
              activeView={activeView}
              setActiveView={setActiveView}
              isMobile={isMobile}
            />
            <Button
              onClick={toggleFullscreen}
              size="icon"
              className="ml-4 size-7"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex h-full"
          style={{
            height: isFullscreen
              ? "calc(100vh - 80px)"
              : mergedOptions.editorHeight,
          }}
        >
          <div
            className={cn(
              "!h-full !min-h-full border-r",
              isMobile
                ? "w-[150px] min-w-[100px] max-w-[150px]"
                : "w-[200px] min-w-[150px] max-w-[200px]",
            )}
          >
            <SandpackFileExplorer className="sandpack-file-explorer" />
          </div>

          <div className="relative flex h-full flex-1">
            {showEditor && showPreview && activeView === "split" ? (
              <>
                <div className="h-full w-1/2 overflow-hidden">
                  <SandpackCodeEditor
                    showLineNumbers={mergedOptions.showLineNumbers}
                    showInlineErrors={mergedOptions.showInlineErrors}
                    showTabs={mergedOptions.showTabs}
                    wrapContent
                    className="h-full w-full rounded-none border-none"
                  />
                </div>

                <div className="h-full w-1/2 overflow-hidden border-l">
                  {renderPreviewSection()}
                </div>
              </>
            ) : (
              <div className="h-full w-full">
                {showEditor && !showPreview && (
                  <SandpackCodeEditor
                    showLineNumbers={mergedOptions.showLineNumbers}
                    showInlineErrors={mergedOptions.showInlineErrors}
                    showTabs={mergedOptions.showTabs}
                    wrapContent
                    className="h-full w-full rounded-none border-none"
                  />
                )}

                {showPreview && !showEditor && renderPreviewSection()}
              </div>
            )}
          </div>
        </div>

        <div className="flex h-6 items-center justify-between border-t px-2 pt-2 text-xs">
          <StatusIndicator />
          <CopyCode />
        </div>
      </SandpackProvider>
    </div>
  );
}
