import React from "react";
import { SandpackConsole, SandpackPreview } from "@codesandbox/sandpack-react";
import { RefreshButton, RunButton, ShowConsole } from "./sandpack-components";
import { cn } from "~/utils/misc";

/**
 * Props for the Preview component
 */
interface PreviewProps {
  /** Whether the console is currently visible */
  showConsole: boolean;
  /** Function to toggle console visibility */
  setShowConsole: (showConsole: boolean) => void;
}

/**
 * Preview component that displays the Sandpack preview with optional console
 * @param {PreviewProps} props - Component props
 * @returns {JSX.Element} Preview component with optional console
 */
export const Preview = React.memo(function Preview({
  showConsole,
  setShowConsole,
}: PreviewProps) {
  const toggleConsole = React.useCallback(() => {
    setShowConsole(!showConsole);
  }, [showConsole, setShowConsole]);

  const previewClassName = React.useMemo(
    () =>
      cn({
        "!h-[70%]": showConsole,
        "!h-full": !showConsole,
      }),
    [showConsole],
  );

  const consoleClassName = React.useMemo(
    () =>
      cn("border-t", {
        "!h-[30%]": showConsole,
        "!h-0": !showConsole,
      }),
    [showConsole],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-1">
        <RunButton />
        <ShowConsole showConsole={showConsole} setShowConsole={toggleConsole} />
        <RefreshButton />
      </div>

      <div className="h-full">
        <SandpackPreview
          className={previewClassName}
          showNavigator={false}
          showRefreshButton={false}
          showOpenInCodeSandbox={false}
        />

        {showConsole && (
          <div className={consoleClassName}>
            <SandpackConsole resetOnPreviewRestart />
          </div>
        )}
      </div>
    </div>
  );
});
