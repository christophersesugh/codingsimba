// import React from "react";
// import { useSandpack } from "@codesandbox/sandpack-react";
// import {
//   Check,
//   Code,
//   Copy,
//   Eye,
//   Layout,
//   Play,
//   RefreshCw,
//   Terminal,
// } from "lucide-react";
// import { Button } from "~/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "~/components/ui/tooltip";
// import { cn } from "~/lib/shadcn";

// export type ViewProps = "editor" | "preview" | "split";

// export function SandpackTabs({
//   activeView,
//   setActiveView,
// }: {
//   activeView: ViewProps;
//   setActiveView: (view: ViewProps) => void;
// }) {
//   return (
//     <div className="ml-auto flex items-center gap-2">
//       <Tabs
//         value={activeView}
//         onValueChange={(value) => setActiveView(value as ViewProps)}
//         className="h-7"
//       >
//         <TabsList className="h-7 p-1">
//           <TabsTrigger
//             value="editor"
//             className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
//           >
//             <Code className="mr-1.5 size-3.5" />
//             Editor
//           </TabsTrigger>
//           <TabsTrigger
//             value="split"
//             className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
//           >
//             <Layout className="mr-1.5 size-3.5" />
//             Split
//           </TabsTrigger>
//           <TabsTrigger
//             value="preview"
//             className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
//           >
//             <Eye className="mr-1.5 size-3.5" />
//             Preview
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>
//     </div>
//   );
// }

// export function RunButton() {
//   const { sandpack } = useSandpack();

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             variant="default"
//             size="sm"
//             className="h-6 rounded-md bg-violet-500 text-xs text-white hover:bg-violet-600"
//             onClick={() => sandpack.runSandpack()}
//             disabled={sandpack.status === "running"}
//           >
//             <Play className="mr-1 size-3" />
//             Run
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent side="bottom">
//           <p>Run code</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }

// export function RefreshButton() {
//   const { sandpack } = useSandpack();

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="size-6 rounded-md"
//             onClick={() => sandpack.resetAllFiles()}
//             aria-label="Reset files"
//           >
//             <RefreshCw className="size-3.5" />
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent side="bottom">
//           <p>Reset files</p>
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//   );
// }

// export function CopyCode() {
//   const { sandpack } = useSandpack();
//   const [copied, setCopied] = React.useState(false);

//   function copyToClipboard() {
//     const activeFileContent = sandpack.files[sandpack.activeFile]?.code || "";
//     navigator.clipboard.writeText(activeFileContent).then(() => {
//       setCopied(true);
//       const timer = setTimeout(() => setCopied(false), 2000);
//       return () => clearTimeout(timer);
//     });
//   }
//   return (
//     <Button
//       onClick={copyToClipboard}
//       variant="ghost"
//       size="sm"
//       className="h-6 rounded-md px-2 text-xs"
//     >
//       {copied ? (
//         <>
//           <Check className="text-blue-600" />
//           Copied
//         </>
//       ) : (
//         <>
//           <Copy className="text-gray-500" />
//           Copy Code
//         </>
//       )}
//     </Button>
//   );
// }

// export function ShowConsole({
//   showConsole,
//   setShowConsole,
// }: {
//   showConsole: boolean;
//   setShowConsole: (showConsole: boolean) => void;
// }) {
//   return (
//     <Button
//       variant="ghost"
//       size="sm"
//       className="h-6 rounded-md px-3 text-xs"
//       onClick={() => setShowConsole(!showConsole)}
//     >
//       <Terminal className="mr-1 size-3.5" />
//       Console
//     </Button>
//   );
// }

// export function StatusIndicator() {
//   const { sandpack } = useSandpack();
//   const [status, setStatus] = React.useState({
//     color: "bg-amber-500",
//     text: "Initializing...",
//   });

//   React.useEffect(() => {
//     switch (sandpack.status) {
//       case "idle":
//         setStatus({ color: "bg-emerald-500", text: "Ready" });
//         break;
//       case "timeout":
//         setStatus({ color: "bg-red-500", text: "Timeout" });
//         break;
//       case "running":
//         setStatus({ color: "bg-blue-500", text: "Running" });
//         break;
//       default:
//         setStatus({ color: "bg-gray-500", text: "Unknown" });
//     }
//   }, [sandpack.status]);

//   return (
//     <div className="flex items-center gap-1.5 text-sm">
//       <div className={cn("size-2 rounded-full", status.color)} />
//       <span>{status.text}</span>
//     </div>
//   );
// }

"use client";

import React from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import {
  Check,
  Code,
  Copy,
  Eye,
  Layout,
  Play,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/shadcn";

export type ViewProps = "editor" | "preview" | "split";

export function SandpackTabs({
  activeView,
  setActiveView,
  isMobile = false,
}: {
  activeView: ViewProps;
  setActiveView: (view: ViewProps) => void;
  isMobile?: boolean;
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as ViewProps)}
        className="h-7"
      >
        <TabsList className="h-7 p-1">
          <TabsTrigger
            value="editor"
            className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
          >
            <Code className="mr-1.5 size-3.5" />
            Editor
          </TabsTrigger>
          {!isMobile && (
            <TabsTrigger
              value="split"
              className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
            >
              <Layout className="mr-1.5 size-3.5" />
              Split
            </TabsTrigger>
          )}
          <TabsTrigger
            value="preview"
            className="h-7 rounded-md px-3 text-xs font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
          >
            <Eye className="mr-1.5 size-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

export function RunButton() {
  const { sandpack } = useSandpack();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="h-6 rounded-md bg-violet-500 text-xs text-white hover:bg-violet-600"
            onClick={() => sandpack.runSandpack()}
            disabled={sandpack.status === "running"}
          >
            <Play className="mr-1 size-3" />
            Run
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Run code</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function RefreshButton() {
  const { sandpack } = useSandpack();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 rounded-md"
            onClick={() => sandpack.resetAllFiles()}
            aria-label="Reset files"
          >
            <RefreshCw className="size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Reset files</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function CopyCode() {
  const { sandpack } = useSandpack();
  const [copied, setCopied] = React.useState(false);

  function copyToClipboard() {
    const activeFileContent = sandpack.files[sandpack.activeFile]?.code || "";
    navigator.clipboard.writeText(activeFileContent).then(() => {
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    });
  }
  return (
    <Button
      onClick={copyToClipboard}
      variant="ghost"
      size="sm"
      className="h-6 rounded-md px-2 text-xs"
    >
      {copied ? (
        <>
          <Check className="text-blue-600" />
          Copied
        </>
      ) : (
        <>
          <Copy className="text-gray-500" />
          Copy Code
        </>
      )}
    </Button>
  );
}

export function ShowConsole({
  showConsole,
  setShowConsole,
}: {
  showConsole: boolean;
  setShowConsole: (showConsole: boolean) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 rounded-md px-3 text-xs"
      onClick={() => setShowConsole(!showConsole)}
    >
      <Terminal className="mr-1 size-3.5" />
      Console
    </Button>
  );
}

export function StatusIndicator() {
  const { sandpack } = useSandpack();
  const [status, setStatus] = React.useState({
    color: "bg-amber-500",
    text: "Initializing...",
  });

  React.useEffect(() => {
    switch (sandpack.status) {
      case "idle":
        setStatus({ color: "bg-emerald-500", text: "Ready" });
        break;
      case "timeout":
        setStatus({ color: "bg-red-500", text: "Timeout" });
        break;
      case "running":
        setStatus({ color: "bg-blue-500", text: "Running" });
        break;
      default:
        setStatus({ color: "bg-gray-500", text: "Unknown" });
    }
  }, [sandpack.status]);

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <div className={cn("size-2 rounded-full", status.color)} />
      <span>{status.text}</span>
    </div>
  );
}
