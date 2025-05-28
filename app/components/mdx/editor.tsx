import React from "react";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "~/lib/shadcn";

type MarkdownProps = {
  value?: string;
  setValue: (value: string) => void;
  className?: string;
};

function MilkdownEditor(props: MarkdownProps) {
  const { value = "", setValue, className } = props;
  const [mounted, setMounted] = React.useState(false);
  const [editorKey, setEditorKey] = React.useState(0); // Force re-mount
  const lastValueRef = React.useRef(value);
  const isInternalUpdate = React.useRef(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Force editor re-mount when value changes externally
  React.useEffect(() => {
    if (!isInternalUpdate.current && value !== lastValueRef.current) {
      lastValueRef.current = value;
      setEditorKey((prev) => prev + 1); // Force re-mount
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleChange = React.useCallback(
    (markdown: string) => {
      if (markdown !== lastValueRef.current) {
        isInternalUpdate.current = true; // Flag internal update
        lastValueRef.current = markdown;
        setValue(markdown);
      }
    },
    [setValue],
  );

  useEditor(
    (root) => {
      const crepe = new Crepe({
        root,
        defaultValue: value,
        features: {
          [Crepe.Feature.ImageBlock]: false,
          [Crepe.Feature.Latex]: false,
          [Crepe.Feature.Table]: false,
          [Crepe.Feature.LinkTooltip]: false,
          [Crepe.Feature.Placeholder]: true,
          [Crepe.Feature.Toolbar]: false,
        },
        featureConfigs: {
          [Crepe.Feature.Placeholder]: {
            text: "Write your comment... Press '/' for commands",
            mode: "block",
          },
        },
      });

      crepe.on((view) => {
        view.markdownUpdated((_, markdown) => {
          handleChange(markdown);
        });
      });

      return crepe;
    },
    [editorKey],
  );

  if (!mounted) return <Skeleton className="h-16" />;
  return (
    <div className={cn("w-full", className)} key={editorKey}>
      <Milkdown />
    </div>
  );
}

export const MDXEditor = React.memo((props: MarkdownProps) => {
  return (
    <MilkdownProvider>
      <MilkdownEditor {...props} />
    </MilkdownProvider>
  );
});

MDXEditor.displayName = "MDXEditor";
