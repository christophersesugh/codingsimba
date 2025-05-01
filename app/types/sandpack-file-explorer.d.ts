declare module "sandpack-file-explorer" {
  import React from "react";

  export interface SandpackFileExplorerProps {
    className?: string;
  }

  export const SandpackFileExplorer: React.FC<SandpackFileExplorerProps>;
}
